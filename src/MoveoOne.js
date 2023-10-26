
const PARAMS = {
    TOKEN: "token",
    DISTINCT_ID: "distinctId",
    ALIAS: "alias",
    CONTEXT_NAME: "contextName",
    GROUP_KEY: "groupKey",
    GROUP_ID: "groupID",
    PROPERTIES: "properties",
    PROPERTY_NAME: "propertyName",
    PROP: "prop",
    NAME: "name",
    CHARGE: "charge",
    PROPERTY_VALUE: "property value",
    MOVEO_ANALYTICS: "MoveoOne analytics",
}

const ERROR_MESSAGE = {
    INVALID_OBJECT: " is not a valid json object",
    INVALID_STRING: " is not a valid string",
    REQUIRED_DOUBLE: " is not a valid number",
    INSTANCE_NOT_CREATED: " instance is not created"
}

export class MoveoOne {

    static instance = null;

    constructor(token) {
        
        if (!StringHelper.isValid(token)) {
            StringHelper.raiseError('TOKEN ERROR');
        }
        this.token = token;
        this.buffer = [];
        this.maxThreashold = 500;
        this.flushInterval = 10 * 1000; //10s
        this.flushTimeout = null;
        this.started = false;
        this.userId = '';
        this.context = '';
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
        this.userId = userId
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
            if (key === 'semanticGroup') {
                newKey = 'sg';
            } else if (key === 'elementId') {
                newKey = 'eID';
            } else if (key === 'action') {
                newKey = 'eA';
            } else if (key === 'type') {
                newKey = 'eT';
            } else if (key === 'value') {
                newKey = 'eV';
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
            for (let i = 0; i < this.buffer.length; i++) {
                this.sendDataToServer()
            }
            this.buffer = [];
        }

    }

    sendDataToServer() {
        console.log(this.buffer[i]);
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
        if (!StringHelper.isValid(context)) {
            StringHelper.raiseError(PARAMS.CONTEXT_NAME);
        } 
    }

    verifyProperties(properties) {
        if (!ObjectHelper.isValidOrUndefined(properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES);
        }
    }

    /**
     * Track an event with specific groups.
     */
    trackWithGroups(eventName, properties, groups) {
        if (!StringHelper.isValid(eventName)) {
            StringHelper.raiseError(PARAMS.CONTEXT_NAME);
        }
        if (!ObjectHelper.isValidOrUndefined(properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES);
        }


    }
}


class StringHelper {
    /**
      Check whether the parameter is not a blank string.
     */
    static isValid(str) {
        return typeof str === "string" && !(/^\s*$/).test(str);
    }

    /**
      Check whether the parameter is undefined or not a blank string.
     */
    static isValidOrUndefined(str) {
        return str === undefined || StringHelper.isValid(str);
    }

    /**
      Raise a string validation error.
     */
    static raiseError(paramName) {
        throw new Error(`${paramName}${ERROR_MESSAGE.INVALID_STRING}`);
    }
}

class ObjectHelper {
    /**
      Check whether the parameter is an object.
     */
    static isValid(obj) {
        return typeof obj === "object";
    }

    /**
      Check whether the parameter is undefined or an object.
     */
    static isValidOrUndefined(obj) {
        return obj === undefined || ObjectHelper.isValid(obj);
    }

    /**
      Raise an object validation error.
     */
    static raiseError(paramName) {
        throw new Error(`${paramName}${ERROR_MESSAGE.INVALID_OBJECT}`);
    }
}

class InstanceHelper {
    /**
      Raise an object validation error.
     */
    static raiseError(paramName) {
        throw new Error(`${paramName}${ERROR_MESSAGE.INSTANCE_NOT_CREATED}`);
    }
}
