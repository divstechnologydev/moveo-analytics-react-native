import axios from "axios";
import { KEYS } from "./MoveoKeys";


const PARAMS = {
    TOKEN: "token",
    CONTEXT_NAME: "contextName",
    PROPERTIES: "properties",
    MOVEO_ANALYTICS: "MoveoOne analytics",
}

const API = {
    URL: "https://api.divstechnology.com/api/analytic/event"
}

const ERROR_MESSAGE = {
    JSON_INVALID: " is not a valid json object",
    STRING: " is not a valid string",
    INSTANCE_NOT_CREATED: " instance is not created",
    SEND_DATA_ERROR: "Failed to send data to server",
}

const SHORT_KEY = {
    GROUP: "sg",
    ELEMENT_ID: "eID",
    ACTION: "eA",
    TYPE: "eT",
    VALUE: "eV"
}

export class MoveoOne {

    static instance = null;

    constructor(token) {
        
        if (!StringVerifier.isValid(token)) {
            StringVerifier.raiseError('TOKEN ERROR');
        }
        this.token = token;
        this.buffer = [];
        this.maxThreashold = 500;
        this.flushInterval = 10 * 1000; //10s
        this.flushTimeout = null;
        this.started = false;
        this.userId = '';
        this.context = '';
        this.log = false;
    }

    static getInstance(token) {
        if (MoveoOne.instance == null) {
            MoveoOne.instance = new MoveoOne(token)
        }
        return this.instance;
    }

    static fetchInstance() {
        if (MoveoOne.instance == null) {
            InstanceHelper.raiseError(PARAMS.MOVEO_ANALYTICS);
        }
        return this.instance;
    }

    /**
     * Associate all future calls to track() with the user identified by
     * the given distinct id.
     *
     */
    identify(userId) {
        this.userId = userId;
    }

    setLogging(enabled) {
        this.log = enabled;
    }

    setFlushInterval(interval) {
        if (interval < 5000 || interval > 60000) {
            if (this.log) {
                console.log("interval not allowed, needs to be [5s, 60s] in milliseconds");
            }
        } else {
            this.flushInterval = interval
        }
    }


    start(context) {
        if (!this.started) {
            this.flushOrRecord(true);
            this.started = true;
            this.context = context
            this.verifyContext(context);
            this.addEventToBuffer(context, 'start', {}, this.userId);
            this.flushOrRecord(false);
        }
    }

    stop(context) {
        if (this.started) {
            this.started = false;
            this.verifyContext(context);
            this.addEventToBuffer(context, 'stop', {}, this.userId);
            this.flushOrRecord(true);
        }
    }

    /**
     * Track an event.
     *
     */
    track(context, properties) {
        if (!this.started) {
            this.start(context);
        }
        this.verifyContext(context);
        this.verifyProperties(properties);
        this.addEventToBuffer(context, 'track', properties, this.userId);
        this.flushOrRecord(false);
    }

    /**
     * Tick an event if there is already started tracker
     */
    tick(properties) {
        if (!this.started || this.context === '') {
            this.verifyContext(this.context);
            this.start(this.context);
        }
        this.verifyProperties(properties);
        this.addEventToBuffer(this.context, 'track', properties, this.userId);
        this.flushOrRecord(false);
    }


    flushOrRecord(isStopOrStart) {
        if (this.buffer.length >= this.maxThreashold || isStopOrStart) {
            this.flush();
        } else {
            if (this.flushTimeout == null) {
                this.setFlushTimeout();
            }
        }
    }

    addEventToBuffer(context, type, prop, userId) {
        const updatedProps = {}
        for (const key in prop) {
            let newKey = key;
            if (key === KEYS.GROUP) {
                newKey = SHORT_KEY.GROUP;
            } else if (key === KEYS.ELEMENT_ID) {
                newKey = SHORT_KEY.ELEMENT_ID;
            } else if (key === KEYS.ACTION) {
                newKey = SHORT_KEY.ACTION;
            } else if (key === KEYS.TYPE) {
                newKey = SHORT_KEY.TYPE;
            } else if (key === KEYS.VALUE) {
                newKey = SHORT_KEY.VALUE;
            } else {
                newKey = key;
            }
            updatedProps[newKey] = prop[key]
        }
        this.buffer.push({ c: context, type: type, prop: updatedProps, t: Date.now(), userId: userId })
    }

    flush() {
        this.clearFlushTimeout()
        if (this.buffer.length > 0) {
            const dataForSending = [...this.buffer];
            this.sendDataToServer(dataForSending)
            this.buffer = [];
        }

    }

    sendDataToServer(dataToSend) {
        this.storeContent(dataToSend)
            .then((data) => {
                if (this.log) {
                    console.log('response: ', data);
                }
            })
            .catch((error) => {
                if (this.log) {
                    console.log('error: ', error);
                }
            });
    }

    setFlushTimeout() {
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
        if (!StringVerifier.isValid(context)) {
            StringVerifier.raiseError(PARAMS.CONTEXT_NAME);
        } 
    }

    verifyProperties(properties) {
        if (!JSONObjectVerifier.isValidOrUndefined(properties)) {
            JSONObjectVerifier.raiseError(PARAMS.PROPERTIES);
        }
    }

    storeContent = (data) => {
        return new Promise((resolve, reject) => {
    
            const config = {
                headers: {
                    Authorization: this.token
                }
            };

            const payload = {
                events: data
            };
    
            try {
                axios
                    .post(API.URL, payload, config)
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        reject(err.message);
                    });
            } catch (error) {
                reject(SEND_DATA_ERROR);
            }
        });
    }
}


class StringVerifier {
    
    static isValid(str) {
        return typeof str === "string" && !(/^\s*$/).test(str);
    }

    static isValidOrUndefined(str) {
        return str === undefined || StringVerifier.isValid(str);
    }

    static raiseError(paramName) {
        throw new Error(`${paramName}${ERROR_MESSAGE.STRING}`);
    }
}

class JSONObjectVerifier {
    
    static isValid(obj) {
        return typeof obj === "object";
    }

    static isValidOrUndefined(obj) {
        return obj === undefined || JSONObjectVerifier.isValid(obj);
    }

    static raiseError(paramName) {
        throw new Error(`${paramName}${ERROR_MESSAGE.JSON_INVALID}`);
    }
}

class InstanceHelper {

    static raiseError(paramName) {
        throw new Error(`${paramName}${ERROR_MESSAGE.INSTANCE_NOT_CREATED}`);
    }
}
