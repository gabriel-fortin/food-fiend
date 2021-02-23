import React, { ReactElement } from "react";
import { useDispatch } from "react-redux";

import { replaceIngredient, useTypedSelector } from "Store";
import { RootRefLayerProvider, useOnion } from "Onion";
import { Ref } from "Model";


interface Props {
    children: (
        weekRef: Ref | null,
        onWeekChange: (w: Ref) => void,
    ) => ReactElement;
}


export const WeekFromStore: React.FC<Props> = ({ children }) => {
    const onion = useOnion();
    const rootRef = useTypedSelector(state => state.getRootRef());
    const dispatch = useDispatch();
    
    const onWeekChange = (newWeekRef: Ref) => {
        dispatch(replaceIngredient(newWeekRef, onion.withRootRefLayer(newWeekRef)));
    };

    return (
        <RootRefLayerProvider food={rootRef}>
            {children(rootRef, onWeekChange)}
        </RootRefLayerProvider>
    );
};
