export default RootReducer;

function RootReducer(state, action) {
    if (state === undefined) {
        console.error(">> RootReducer: missing initial state");
    }

    if (action.type === "IMPORT_DATA") {
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

    return state;
};

