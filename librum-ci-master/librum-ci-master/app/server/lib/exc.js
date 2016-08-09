class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class PodStreamError extends ExtendableError {
    constructor(message, pod) {
        super(message);
        this.pod = pod;
        this.name = 'PodStreamError';
        Error.captureStackTrace(this, PodStreamError);
    }
}

export {PodStreamError};
