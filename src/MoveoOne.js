import axios from "axios";

const API_URL = "https://api.moveo.one/api/analytic/event";
const DOLPHIN_BASE_URL = "https://dolphin-prod-229920351162.europe-west1.run.app";

import { version as LIB_VERSION } from "../package.json";

export class MoveoOne {
  static instance = null;

  constructor(token) {
    if (typeof token !== "string" || token.trim() === "") {
      throw new Error("Invalid token provided");
    }
    this.token = token;
    this.buffer = [];
    this.logging = false;
    this.flushInterval = 10 * 1000; // 10 seconds
    this.maxThreshold = 500;
    this.flushTimeout = null;
    this.started = false;
    this.context = "";
    this.sessionId = "";
    this.customPush = false;
    this.calculateLatencyFlag = true; // Default to true
  }

  static getInstance(token) {
    if (!MoveoOne.instance) {
      MoveoOne.instance = new MoveoOne(token);
    }
    return MoveoOne.instance;
  }

  initialize(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  setLogging(enabled) {
    this.logging = enabled;
  }

  setFlushInterval(interval) {
    if (interval < 5000 || interval > 60000) {
      this.log("Flush interval must be between 5000ms and 60000ms.");
    } else {
      this.flushInterval = interval;
    }
  }

  isCustomFlush() {
    return this.customPush;
  }

  calculateLatency(enabled) {
    this.calculateLatencyFlag = enabled;
  }

  start(context, metadata = {}) {
    if (!this.started) {
      this.log("start");
      this.flushOrRecord(true);
      this.started = true;
      this.context = context;
      this.sessionId = `sid_${this.generateUUID()}`;

      const modifiedMetadata = {
        libVersion: LIB_VERSION,
        ...metadata,
      };

      this.addEventToBuffer(
        context,
        "start_session",
        {},
        modifiedMetadata
      );
      this.flushOrRecord(false);
    }
  }

  track(context, moveoOneData) {
    this.log("track");
    const properties = this.prepareProperties(moveoOneData);
    this.trackInternal(context, properties, moveoOneData.metadata || {});
  }

  tick(moveoOneData) {
    this.log("tick");
    const properties = this.prepareProperties(moveoOneData);
    this.tickInternal(properties, moveoOneData.metadata || {});
  }

  updateSessionMetadata(metadata) {
    this.log("update session metadata");
    if (this.started) {
      this.addEventToBuffer(
        this.context,
        "update_metadata",
        {},
        metadata
      );
      this.flushOrRecord(false);
    }
  }

  updateAdditionalMetadata(additionalMetadata) {
    this.log("update additional metadata");
    if (this.started) {
      this.buffer.push({
        c: this.context,
        type: "update_metadata",
        t: Date.now(),
        prop: {},
        meta: {},
        additionalMeta: additionalMetadata,
        sId: this.sessionId,
      });
      this.flushOrRecord(false);
    }
  }

  trackInternal(context, properties, metadata) {
    if (!this.started) {
      this.start(context, metadata);
    }
    this.addEventToBuffer(context, "track", properties, metadata);
    this.flushOrRecord(false);
  }

  tickInternal(properties, metadata) {
    if (!this.context) {
      this.verifyContext(this.context);
      this.start(this.context, metadata);
    }
    this.addEventToBuffer(
      this.context,
      "track",
      properties,
      metadata
    );
    this.flushOrRecord(false);
  }

  flushOrRecord(isStopOrStart) {
    if (!this.customPush) {
      if (this.buffer.length >= this.maxThreshold || isStopOrStart) {
        this.flush();
      } else {
        if (!this.flushTimeout) {
          this.setFlushTimeout();
        }
      }
    }
  }

  addEventToBuffer(context, type, prop, metadata) {
    this.buffer.push({
      c: context,
      type: type,
      t: Date.now(),
      prop: prop,
      meta: metadata,
      sId: this.sessionId,
    });
  }

  flush() {
    if (!this.customPush) {
      this.log("flush");
      this.clearFlushTimeout();
      if (this.buffer.length > 0) {
        const dataToSend = [...this.buffer];
        this.sendDataToServer(dataToSend);
        this.buffer = [];
      }
    }
  }

  customFlush() {
    if (this.customPush) {
      const dataToSend = [...this.buffer];
      this.buffer = [];
      return dataToSend;
    }
    return [];
  }

  sendDataToServer(dataToSend) {
    axios
      .post(
        API_URL,
        { events: dataToSend },
        {
          headers: { Authorization: this.token },
        }
      )
      .then((response) => this.log(response.data))
      .catch((error) => this.log(error));
  }

  async sendLatencyData(modelId, totalExecutionTimeMs, latencyData = {}) {
    try {
      const latencyRequest = {
        model_id: modelId,
        session_id: this.sessionId,
        client: "react-native",
        total_execution_time_ms: totalExecutionTimeMs,
        latency_data: latencyData
      };

      await axios.post(
        `${DOLPHIN_BASE_URL}/api/prediction-latency`,
        latencyRequest,
        {
          headers: {
            Authorization: this.token,
            "Content-Type": "application/json"
          },
          timeout: 5000 // 5 second timeout for latency tracking
        }
      );

    } catch (error) {
      this.log(`Failed to send latency data for model "${modelId}":`, error.message);
    }
  }

  setFlushTimeout() {
    this.log("setting flush timeout");
    this.flushTimeout = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  clearFlushTimeout() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }

  verifyContext(context) {
    if (typeof context !== "string" || context.trim() === "") {
      throw new Error("Invalid context provided.");
    }
  }

  verifyProps(props) {
    if (typeof props !== "object" || props === null) {
      throw new Error("Invalid properties provided.");
    }
  }

  log(msg) {
    if (this.logging) {
      console.log("MoveoOne ->", msg);
    }
  }

  isStarted() {
    return this.started;
  }

  getContext() {
    return this.context;
  }

  prepareProperties(moveoOneData) {
    let properties = {};
    properties["sg"] = moveoOneData.semanticGroup || "";
    properties["eID"] = moveoOneData.id || "";
    properties["eA"] = moveoOneData.action || "";
    properties["eT"] = moveoOneData.type || "";

    if (typeof moveoOneData.value === "string") {
      properties["eV"] = moveoOneData.value;
    } else if (Array.isArray(moveoOneData.value)) {
      properties["eV"] = moveoOneData.value.join(",");
    } else if (typeof moveoOneData.value === "number") {
      properties["eV"] = moveoOneData.value.toString();
    } else {
      properties["eV"] = "-";
    }

    return properties;
  }

  /**
   * Makes a prediction request to the Dolphin service
   * @param {string} modelId - The model ID to use for prediction
   * @returns {Promise<Object>} Promise that resolves to prediction result or error
   */
  async predict(modelId) {
    // Validate model ID
    if (typeof modelId !== "string" || modelId.trim() === "") {
      return {
        success: false,
        status: "invalid_model_id",
        message: "Model ID is required and must be a non-empty string"
      };
    }

    // Check if token is available
    if (!this.token || this.token.trim() === "") {
      return {
        success: false,
        status: "not_initialized",
        message: "MoveoOne must be initialized with a valid token before using predict method"
      };
    }

    // Ensure session is started
    if (!this.started || !this.sessionId) {
      return {
        success: false,
        status: "no_session",
        message: "Session must be started before making predictions. Call start() method first."
      };
    }
    
    // Record start time for latency calculation
    const startTime = performance.now();
    
    try {
      const timeoutMs = 400; // 400ms
      
      const response = await axios({
        method: "post",
        url: `${DOLPHIN_BASE_URL}/api/models/${encodeURIComponent(modelId)}/predict`,
        data: {
          events: this.buffer,
          session_id: this.sessionId
        },
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json"
        },
        timeout: timeoutMs
      });
      
      const { data, status } = response;
      
      // Calculate execution time
      const endTime = performance.now();
      const totalExecutionTimeMs = Math.round(endTime - startTime);
      
      // Handle 202 responses (pending states)
      if (status === 202) {
        const result = {
          success: false,
          status: "pending",
          message: data.message || "Model is loading"
        };
        
        // Send latency data asynchronously if enabled
        if (this.calculateLatencyFlag) {
          this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
        }
        
        return result;
      }
      
      // Handle successful prediction (200)
      if (status === 200 && data) {
        const result = {
          success: true,
          status: "success",
          prediction_probability: data.prediction_probability,
          prediction_binary: data.prediction_binary
        };
        
        // Send latency data asynchronously if enabled
        if (this.calculateLatencyFlag) {
          this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
        }
        
        return result;
      }
      
      // Handle unexpected response format
      const result = {
        success: false,
        status: "server_error",
        message: "Unexpected server response"
      };
      
      // Send latency data asynchronously if enabled
      if (this.calculateLatencyFlag) {
        this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
      }
      
      return result;

    } catch (error) {
      
      this.log(`predict - error for model "${modelId}":`, error.message);
      
      // Calculate execution time for error cases
      const endTime = performance.now();
      const totalExecutionTimeMs = Math.round(endTime - startTime);
      
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        const result = {
          success: false,
          status: "timeout",
          message: "Request timed out after 400ms"
        };
        
        // Send latency data asynchronously if enabled (including timeout)
        if (this.calculateLatencyFlag) {
          this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
        }
        
        return result;
      }

      if (error.response) {
        const { status, data } = error.response;
        
        let result;
        switch (status) {
          case 401:
            result = {
              success: false,
              status: "unauthorized",
              message: "Authentication token is invalid or expired"
            };
            break;
          case 403:
            result = {
              success: false,
              status: "forbidden",
              message: "Access denied to this model"
            };
            break;
          case 404:
            result = {
              success: false,
              status: "not_found",
              message: "Model not found or not accessible"
            };
            break;
          case 409:
            result = {
              success: false,
              status: "conflict",
              message: "Conditional event not found for prediction"
            };
            break;
          case 422:
            result = {
              success: false,
              status: "invalid_data",
              message: data.detail || "Invalid prediction data"
            };
            break;
          case 500:
            result = {
              success: false,
              status: "server_error",
              message: "Server error processing prediction request"
            };
            break;
          default:
            result = {
              success: false,
              status: "server_error",
              message: data.detail || `Server error with status ${status}`
            };
        }
        
        // Send latency data asynchronously if enabled
        if (this.calculateLatencyFlag) {
          this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
        }
        
        return result;
      }

      if (error.request) {
        const result = {
          success: false,
          status: "network_error",
          message: "Network error - please check your connection"
        };
        
        // Send latency data asynchronously if enabled
        if (this.calculateLatencyFlag) {
          this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
        }
        
        return result;
      }

      const result = {
        success: false,
        status: "unknown_error",
        message: error.message || "An unexpected error occurred"
      };
      
      // Send latency data asynchronously if enabled
      if (this.calculateLatencyFlag) {
        this.sendLatencyData(modelId, totalExecutionTimeMs, {}).catch(() => {});
      }
      
      return result;
    }
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
