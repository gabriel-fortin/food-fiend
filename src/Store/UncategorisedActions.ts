import { Ref } from "Model";


export interface SetCurrentDayAction {
    type: "SET CURRENT DAY",
    dayRef: Ref|null,
}
