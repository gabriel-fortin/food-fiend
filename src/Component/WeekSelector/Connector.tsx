import React, { ReactElement } from "react";
import { connect, useDispatch } from "react-redux";

import { FoodType, Ref } from "Model";
import { State } from "Store";
import { FoodLayerProvider, useOnion } from "Onion";
import { addWeek, editWeek } from "Component/WeekEditor";
import { eqRef } from "tools";

import { SleekUI as UI } from "./SleekUI";


interface Props {
    weekRef: Ref | null;
    onWeekChanged: (w: Ref) => void;
    children?: (dayRef: Ref) => ReactElement;
}


/**
 * @param weekRef mandatory; week to be currently selected
 * @param onWeekChanged mandatory; called when user chooses a different week
 * @param children optional; can be used to inherit the weekRef ref and the rest of the onion
 */
export const Connector: React.FC<Props> = ({
    weekRef: selectedWeekRef,
    onWeekChanged: notifyWeekChanged,
    children,
}) => {
    const parentOnion = useOnion();
    const dispatch = useDispatch();

    const mapState = (state: State) => {
        const weekData = state.getAllFoodOfType(FoodType.Week);
        
        return {
            weekData,
            selectedWeekRef,
            isPrevWeekAvailable: weekData !== [] && selectedWeekRef !== null
                && !eqRef(selectedWeekRef, weekData[0].ref),
            isNextWeekAvailable: weekData !== [] && selectedWeekRef !== null
                && !eqRef(selectedWeekRef, weekData[weekData.length - 1].ref),
            onPrevWeekSelected: () => console.warn(`NOT IMPLEMENTED: on prev week selected`),
            onNextWeekSelected: () => console.warn(`NOT IMPLEMENTED: on next week selected`),
            onWeekAddRequest: () => {
                dispatch(addWeek(parentOnion));
            },
            onWeekEditRequest: () => {
                dispatch(editWeek(parentOnion, selectedWeekRef!));
            },
            onWeekSelected: (userSelectedWeekRef: Ref) => {
                notifyWeekChanged(userSelectedWeekRef);
            },
        };
    };
    
    const ConnectedUI = connect(mapState)(UI);
    return (
        <>
            {(selectedWeekRef !== null) &&
                <FoodLayerProvider food={selectedWeekRef}>
                    {children}
                </FoodLayerProvider>
            }
            <ConnectedUI/>
        </>
    );
};
