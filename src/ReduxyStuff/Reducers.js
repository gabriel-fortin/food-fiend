export default RootReducer;

function RootReducer(state, action) {
    if (state === undefined) {
        console.error(">> RootReducer: missing initial state");
    }

    if (action.type === "IMPORT_DATA") {
        // TODO: do not accept data blindly but:
        //       - compute what is a derived value (e.g. macros) and
        //       - assign the id ourselves

        // reducer and its initial value
        const startValue = {
            lastEl: {id: 42},
            res: [],
        };
        const discoverNeighbouringDuplicates = (acc, item) => {
            // assuming that collection is sorted: first by id, then by version
            if (acc.lastEl.id === item.id &&
                acc.lastEl.version === item.version) {
                throw Error(`repeated item in imported data; id: ${item.id}; name: ${item.name}`);
            }
            
            // immutability is not needed for a local, temporary computation
            acc.lastEl = item;
            acc.res.push(item);
            return acc;
        };

        // TODO: use lens/accessor to get current data
        const mergedData = state.current.foodData.concat(action.data);
        const sanitisedData = mergedData
                // sort by id, then by version (if ids equal)
                .sort((x, y) => {
                    const idCompare = x.id - y.id;
                    if (idCompare !== 0) return idCompare;
                    return x.version - y.version;
                })
                .reduce(discoverNeighbouringDuplicates, startValue)
                .res;
        return {
            ...state,
            current: {
                ...state.current,
                foodData: sanitisedData,
            }
        };
    }

    if (action.type === "CHANGE_FOOD_QUANTITY") {
        console.log(`quantity change; meal: ${action.mealId}; `
                + `index: ${action.foodPosInMeal}; quantity: ${action.newQuantity}`);

        // TODO: do not update version if it was not used by anything
        //       (requires the 'usedBy' field changes to be implemented)

        // TODO: update meal's macros after updating quantity
        //       probably this should be a separate function
        //       (which can also be used for IMPORT_DATA)

        return {
            ...state,
            current: {
                ...state.current,
                foodData: state.current.foodData.map(food => {
                    if (food.id !== action.mealId) return food;
                    return {
                        ...food,
                        version: food.version + 1,
                        components: food.components.map((componentFood, i) => {
                            if (i !== action.foodPosInMeal) return componentFood;
                            return {
                                ...componentFood,
                                quantity: action.newQuantity,
                            };
                        }),
                    };
                }),
            }
        };
    }

    return state;
};

