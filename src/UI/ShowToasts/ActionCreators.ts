import { SetMessageAction } from "./Actions";


/** Action creator */
export function setErrorMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "error",
                text: message,
            }
    };
}

/** Action creator */
export function setSuccessMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "success",
                text: message,
            }
    };
}

/** Action creator */
export function setInfoMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "info",
                text: message,
            }
    };
}

/** Action creator */
export function setWarningMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "warning",
                text: message,
            }
    };
}
