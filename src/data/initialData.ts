import fullRawData from './full-data';

import { Food, FoodType, StorageInfo } from 'Model';


// let the base app data have the same date of addition
const initialImportDate = new Date("2019-10-20");

const initialStructuredData = fullRawData
    .map(reshapeIntoExpectedForm)
    .map(ensureIdIsANonZeroInteger)
    .map(parseMacrosValues);

function reshapeIntoExpectedForm(item: any): Food {
    // some simple hash implementation from StackOverflow
    const hashCode = (argString: string) => {
        let hash = 0;
        for (let i = 0; i < argString.length; i++) {
            let char = argString.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    };

    return new Food(
        {
            id: hashCode(JSON.stringify(item)),
            ver: 1,
        },
        item.name,
        FoodType.BaseIngredient,
        {  // quantities per 100g of product
            fat: item.fat,
            protein: item.protein,
            carbs: item.carbs,
        },
        "g",  // unitName: for quantity display only
        1,  // portionSize: grams per portion
        1,  // portions
        {  // extra
            ...item.extra,
            ...new StorageInfo(initialImportDate, /*isInitialItem:*/ true),  // imported from McCance
        },

        // to be used, maybe, in the future
        // portionStep: 5,  // in grams
    );
}

function ensureIdIsANonZeroInteger(item: Food) {
    if (item.ref.id === 0) throw new Error(`Invalid id (expected non-zero) on item "${item.name}"; the value is "${item.ref.id}"`);
    if (Number.isInteger(item.ref.id)) return item;
    throw new Error(`Invalid value (expected integer) on item "${item.name}"; the value is "${item.ref.id}"`);
}

function parseMacrosValues(item: any) {
    const uncertaintyValues = {  // used occasionally, when some data missing or unparseable
        fat: 0,
        protein: 0,
        carbs: 0,
        messages: new Array<any>(),
    };

    const parse = (inValue: string, field: string) => {
        // we treat trace amounts as zero
        if (inValue === "Tr") return 0;

        // most of the time we should get a number
        const value = Number.parseFloat(inValue);
        if (Number.isFinite(value)) return value;

        // finally, we give up on parsing
        // assume 100g of the substance can be additionally present per 100g of product
        (uncertaintyValues as any)[field] = 100;
        uncertaintyValues.messages.push(`Unknown ${field} value for "${item.name}; assuming 100g"`);
        return 0;
    };

    item.macros.fat = parse(item.macros.fat, "fat");
    item.macros.protein = parse(item.macros.protein, "protein");
    item.macros.carbs = parse(item.macros.carbs, "carbs");

    if (uncertaintyValues.fat !== 0 ||
        uncertaintyValues.protein !== 0 ||
        uncertaintyValues.carbs !== 0) {
            item.uncertainty = uncertaintyValues;
        }

    return item;
}

export default initialStructuredData;
