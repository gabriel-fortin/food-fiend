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

/** Creates new Date with the time components removed */
export const timelessDate: (date: Date) => Date
    = (date) => new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

/** Creates new Date with the number of days added */
export const addDays: (date: Date, numDays: number) => Date
    = (date, numDays) => {
        if (!Number.isInteger(numDays)) {
            throw new Error(`Value '${numDays}' is a non-integer number`);
        }

        const resultDate = new Date(date);
        resultDate.setDate(resultDate.getDate() + numDays);
        return resultDate;
    };