export default RootReducer;

function RootReducer(state, action) {
    if (state === undefined) {
        console.error(">> RootRedicer: missing initial state");
    }

    if (action.type === 'ENTRY_TOGGLED') {
        return {...state,
            onScreenFood: state.onScreenFood.map(x => {
                if (x.id !== action.entryId) return x;
                return x.withIsSelected(!x.isSelected);
            }),
        };
    }

    return state;
};
