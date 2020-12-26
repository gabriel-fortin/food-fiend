import localforage from "localforage";
import { ThunkAction } from "redux-thunk";

import { Food, Ref, StorageInfo } from "Model";

import { State } from "./Store";
import { Action } from "./ActionRegister";
import { importData } from "./DataActionCreators";
import { SetCurrentDayAction, SetMessageAction } from "./UncategorisedActions";

/** Action creator */
export function setCurrentDay(dayRef: Ref): SetCurrentDayAction {
    return {
        type: "SET CURRENT DAY",
        dayRef,
    };
}

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

const LAST_SAVE = "last save";
const USER_DATA = "user data";

/** Action creator */
export function saveToBrowserStorage(): ThunkAction<void, State, any, Action> {
    return (dispatch, getState) => {
        const t0 = performance.now();

        const storeCriterium = (f: Food) => !(f.extra as StorageInfo).isInitialItem;
        const dataToSave: Food[] = getState().foodData.filter(storeCriterium);

        localforage
            .setItem(LAST_SAVE, new Date())
            .then(() => localforage.setItem(USER_DATA, dataToSave))
            .then(() => {
                const t1 = performance.now();
                dispatch(setInfoMessage(`saved ${dataToSave.length} items!  it took ${t1 - t0}ms`));
            })
            .catch(err => {
                const msg = `saving to browser storage - Failed!  ${err}`;
                console.error(msg);
                return dispatch(setErrorMessage(msg));
            });
    };
}

/** Action creator */
export function loadFromBrowserStorage(): ThunkAction<void, State, any, Action> {
    return (dispatch, getState) => {
        const t0 = performance.now();
        // TODO: recognise that data was never saved (first run); otherwise, `.getItem` fails

        localforage
            .getItem<Date>(LAST_SAVE)
            .then(lastSaveDate => {
                console.log(`E||  flag present: ${lastSaveDate}`);
                if (lastSaveDate === null) throw "no data in store";

                localforage
                    .getItem<Food[]>(USER_DATA)
                    .then((data) => {
                        if (data === null) throw "data is null";
                        
                        dispatch(importData(data));
                        const t1 = performance.now();
                        dispatch(setInfoMessage(`loaded ${data.length} items!  it took ${t1 - t0}ms`));
                        return data;
                    })
                    .catch(err => {
                        const msg = `loading from browser storage - Failed!  ${err}`;
                        console.error(msg);
                        dispatch(setErrorMessage(msg));
                    });
            })
            .catch(err => {
                dispatch(setWarningMessage(`Nothing to load: ${err}`));
            });
    };
}

/** Action creator */
export function clearBrowserStorage(): ThunkAction<Promise<void>, State, any, Action> {
    return (dispatch, getState) =>
        localforage.removeItem(LAST_SAVE)
            .then(() => localforage.removeItem(USER_DATA))
            .then(() => {
                dispatch(setInfoMessage(`removed user data`));
            });
}
