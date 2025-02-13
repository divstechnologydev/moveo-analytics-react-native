import axios from "axios";

const API_URL = "https://api.divstechnology.com/api/analytic/event";

export class MoveoOne {
    static instance = null;

    constructor(token) {
        if (typeof token !== "string" || token.trim() === "") {
            throw new Error("Invalid token provided");
        }
        this.token = token;
        this.userId = "";
        this.buffer = [];
        this.logging = false;
        this.flushInterval = 10 * 1000; // 10 seconds
        this.maxThreshold = 500;
        this.flushTimeout = null;
        this.started = false;
        this.context = "";
        this.sessionId = "";
        this.customPush = false;
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

    identify(userId) {
        this.userId = userId;
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

    start(context, metadata = {}) {
        if (!this.started) {
            this.log("start");
            this.flushOrRecord(true);
            this.started = true;
            this.context = context;
            this.verifyContext(context);
            this.sessionId = `sid_${this.generateUUID()}`;
            this.addEventToBuffer(context, "start_session", {}, this.userId, metadata);
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
            this.addEventToBuffer(this.context, "update_metadata", {}, this.userId, metadata);
            this.flushOrRecord(false);
        }
    }

    trackInternal(context, properties, metadata) {
        if (!this.started) {
            this.start(context, metadata);
        }
        this.verifyContext(context);
        this.verifyProps(properties);
        this.addEventToBuffer(context, "track", properties, this.userId, metadata);
        this.flushOrRecord(false);
    }

    tickInternal(properties, metadata) {
        if (!this.context) {
            this.verifyContext(this.context);
            this.start(this.context, metadata);
        }
        this.verifyProps(properties);
        this.addEventToBuffer(this.context, "track", properties, this.userId, metadata);
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

    addEventToBuffer(context, type, prop, userId, metadata) {
        this.buffer.push({
            c: context,
            type: type,
            userId: userId,
            t: Date.now(),
            prop: prop,
            meta: metadata,
            sId: this.sessionId
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
        axios.post(API_URL, { events: dataToSend }, {
            headers: { Authorization: this.token }
        })
        .then(response => this.log(response.data))
        .catch(error => this.log(error));
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

    generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}