import React, { ReactElement, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/core";

import { FoodType, Ref } from "Model";
import { replaceIngredient, State } from "Store";
import { WeekEditor } from "Component";
import { FoodLayerProvider, useOnion } from "Onion";
import { eqRef } from "tools";

import { SleekUI as UI } from "./SleekUI";


interface Props {
    weekRef: Ref | null;
    onWeekChanged: (w: Ref) => void;
    children?: (dayRef: Ref) => ReactElement;
}


export const Connector: React.FC<Props> = ({
    weekRef: selectedWeekRef,
    onWeekChanged: notifyWeekChanged,
    children,
}) => {
    const [editedWeekRef, setEditedWeekRef] = useState<Ref|null>(null);

    const {
        isOpen: isWeekEditorOpen,
        onOpen: openWeekEditor,
        onClose: closeWeekEditor } = useDisclosure();
    const parentOnion = useOnion();
    const dispatch = useDispatch();

    const onWeekEditorClose = (updatedWeekRef: Ref | null) => {
        if (updatedWeekRef !== null) {
            dispatch(replaceIngredient(updatedWeekRef, parentOnion));
        }
        closeWeekEditor();
    };

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
                setEditedWeekRef(null);
                openWeekEditor();
            },
            onWeekEditRequest: () => {
                setEditedWeekRef(selectedWeekRef);
                openWeekEditor();
            },
            onWeekSelected: (userSelectedWeekRef: Ref) => {
                console.log(`Week And Day Controls - on Week selected`);
                
                notifyWeekChanged(userSelectedWeekRef);
                return;
            },
        };
    };
    
    const ConnectedUI = connect(mapState)(UI);
    return (
        <>
            {selectedWeekRef &&
                <FoodLayerProvider food={selectedWeekRef}>
                    {children}
                </FoodLayerProvider>
            }
            <ConnectedUI/>
            <WeekEditor
                weekRef={editedWeekRef}
                isOpen={isWeekEditorOpen}
                onClose={onWeekEditorClose}
            />
        </>
    );
};
