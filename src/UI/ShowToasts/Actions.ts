import { Message } from "Model";


export interface SetMessageAction {
    type: "SET MESSAGE",
    messagePayload: Message | null,
}
