import { Ref } from "Model";

import { SetCurrentDayAction } from "./UncategorisedActions";


/** Action creator */
export function setCurrentDay(dayRef: Ref|null): SetCurrentDayAction {
    return {
        type: "SET CURRENT DAY",
        dayRef,
    };
}

