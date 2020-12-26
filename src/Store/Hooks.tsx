import React from "react";
import { createStore, Store as ReduxStore } from "redux";
import { useStore, Provider, TypedUseSelectorHook, useSelector } from "react-redux";

import { State } from "./Store";
import { Action } from "./ActionRegister";
import { rootReducer } from "./Reducers";


// hides details of what the actual store is and how it's implemented
export const useAppState: () => State =
    () => useStore<State, Action>().getState();

export const useTypedSelector: TypedUseSelectorHook<State> = useSelector;


interface Props {
    // TODO: remove debug injector when TestingArea no longer needs it
    _debug__injectStore: ReduxStore<State, Action>;
}

export const AppStateProvider: React.FC<Props> = ({ _debug__injectStore, children }) => {
    const store = _debug__injectStore || createStore(rootReducer, State.create());

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};
