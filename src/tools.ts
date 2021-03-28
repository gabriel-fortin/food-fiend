import { Ref } from "Model";


/** Compare two instances of 'Ref' */
export const eqRef: (ref1: Ref | null, ref2: Ref | null) => boolean
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

/**
 * Works like '.filter' but expects exactly one element to match predicate.
 * 
 * Returns the single element that matches the predicate.
 */
export function filterOne<T>(array: T[], predicate: (x: T) => boolean) {
    const arrayWithOneElement = array.filter(predicate);

    const len = arrayWithOneElement.length;
    if (len !== 1) throw new Error(`Expected exactly one element but found ${len}`);

    return arrayWithOneElement[0];
}

export const formatRef
    = (ref: Ref | null) =>
        ref === null
            ? "[null]"
            : `[${ref.id} / ${ref.ver}]`;

export const withStrippedTime: (d: Date) => Date
    = (date: Date) => {
        date.setHours(0, 0, 0, 0);
        return date;
    }
