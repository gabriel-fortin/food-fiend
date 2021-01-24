import { Ref } from "Model";


export interface SetRootRefAction {
    type: "SET ROOT REF",
    rootRef: Ref | null,
}
