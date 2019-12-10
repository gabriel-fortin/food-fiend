export default RootReducer;

function RootReducer(state, action) {
    if (state === undefined) {
        console.error(">> RootReducer: missing initial state");
    }

    if (action.type === 'ENTRY_TOGGLED') {
        return {
            ...state,
            onScreenFood: state.onScreenFood.map(x => {
                if (x.id !== action.entryId) return x;
                return x.withIsSelected(!x.isSelected);
            }),
        };
    }

    if (action.type === "IMPORT_DATA") {
        // reducer and its initial value
        const guardValue = {
            lastEl: {id: -1},
            res: [],
        };
        const checkForDuplicates = (acc, item) => {
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
                .sort((x, y) => x.id < y.id)
                .reduce(checkForDuplicates, guardValue)
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

