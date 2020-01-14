import fullRawData from './full-data';
import FoodType from './FoodType';

const initialStructuredData = fullRawData
    .map(reshapeIntoExpectedForm)
    .map(ensureIdIsANonZeroInteger)
    .map(parseMacrosValues);

function reshapeIntoExpectedForm(item) {
    // some simple hash implementation from StackOverflow
    const hashCode = argString => {
        let hash = 0;
        for (let i = 0; i < argString.length; i++) {
            let char = argString.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    return {
        version: 1,  // to enable immutability but still allow changes

        id: hashCode(JSON.stringify(item)),
        name: item.name,
        macros: {  // quantities per 100g of product
            fat: item.fat,
            protein: item.protein,
            carbs: item.carbs,
        },
        extra: item.extra,

        type: FoodType.Simple,
        unit: "g",  // for quantity display only
        portionSize: 1,  // grams per portion
        portions: 1,
        ingredientsRefs: [],  // list of <id, version> of ingredients
        usedBy: [],  // list of <id, version> of depending meals
                    // it's redundant data so it's there for potential performance gain
        uncertainty: false,  // allow uncertainty of macros (and maybe other things)

        // to be used, maybe, in the future
        // portionStep: 5,  // in grams
    };
}

function ensureIdIsANonZeroInteger(item) {
    if (item.id === 0) throw new Error(`Invalid id (expected non-zero) on item "${item.name}"; the value is "${item.id}"`);
    if (Number.isInteger(item.id)) return item;
    throw new Error(`Invalid value (expected integer) on item "${item.name}"; the value is "${item.id}"`);
}

function parseMacrosValues(item) {
    const uncertaintyValues = {  // used occasionally, when some data missing or unparseable
        fat: 0,
        protein: 0,
        carbs: 0,
        messages: [],
    };

    const parse = (value, field) => {
        // we treat trace amounts as zero
        if (value === "Tr") return 0;

        // most of the time we should get a number
        value = Number.parseFloat(value);
        if (Number.isFinite(value)) return value;

        // finally, we give up on parsing
        // assume 100g of the substance can be additionally present per 100g of product
        uncertaintyValues[field] = 100;
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
