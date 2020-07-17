import { Ref } from "./Ref";


/** Compare two instances of 'Ref' */
export const eqRef: (ref1: Ref, ref2: Ref) => boolean
    = (ref1, ref2) => {
        // both same object or both null
        if (ref1 === ref2) return true;

        // if one is null then the other one isn't
        if (ref1 === null || ref2 === null) return false;

        // both not null so deep compare
        return ref1.id === ref2.id
            && ref1.ver === ref2.ver;
    };
