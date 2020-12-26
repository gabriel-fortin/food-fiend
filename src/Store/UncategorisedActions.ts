import { Message, Ref } from "Model";

export interface SetCurrentDayAction {
    type: "SET CURRENT DAY",
    dayRef: Ref,
}

export interface SetMessageAction {
    type: "SET MESSAGE",
    messagePayload: Message | null,
}

