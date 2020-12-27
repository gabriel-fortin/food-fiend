import { Ref } from "Model";

import { SetCurrentDayAction } from "./UncategorisedActions";


/** Action creator */
export function setCurrentDay(dayRef: Ref): SetCurrentDayAction {
    return {
        type: "SET CURRENT DAY",
        dayRef,
    };
}

