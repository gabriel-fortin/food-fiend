import { Ref } from "Model";

import { SetRootRefAction } from "./UncategorisedActions";


/** Action creator */
export function setRootRef(rootRef: Ref | null): SetRootRefAction {
    return {
        type: "SET ROOT REF",
        rootRef: rootRef,
    };
}

