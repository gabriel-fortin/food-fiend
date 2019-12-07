import rawData from './almostRawInitialData';

const initialStructuredData = rawData
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

        unit: "g",  // for quantity display only
        portionSize: 1,  // grams per portion
        portions: 1,
        ingredients: [],
        usedBy: [],  // list of <id, version> of depending meals

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
    const parse = (value, field) => {
        // we treat trace amounts as zero
        if (value === "Tr") return 0;

        value = Number.parseInt(value);
        if (Number.isInteger(value)) return value;
        if (value === 0.0) return 0;
        throw new Error(`Invalid value (expected int or "Tr") on item "${item.name}", field '${field}'; the value is "${value}"`);
    };

    item.macros.fat = parse(item.macros.fat, "fat");
    item.macros.protein = parse(item.macros.protein, "protein");
    item.macros.carbs = parse(item.macros.carbs, "carbs");

    return item;
}

export default initialStructuredData;
