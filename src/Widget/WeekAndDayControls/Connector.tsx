import React, { useState } from "react";
import { connect } from "react-redux";
import { useDisclosure } from "@chakra-ui/core";

import { FoodType, Ingredient, Ref } from "Model";
import { State, useAppState } from "Store";
import { WeekEditor } from "Widget";
import { Onion, useOnion } from "Onion";
import { eqRef, filterOne } from "tools";

import { WeeksAndDaysHorizontally as UI } from "./UI/WeeksAndDaysHorizontally";


interface Props {
    children: (selectedDayRef: Ref | null, context: Onion) => void;
    // TODO: accept currently selected week as prop
}


export const Connector: React.FC<Props> = ({children: dataChangeNotify}) => {
    const [selectedWeekRef, setSelectedWeekRef] = useState<Ref|null>(null);
    const [editedWeekRef, setEditedWeekRef] = useState<Ref|null>(null);
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number|null>(null);
    const {
        isOpen: isWeekEditorOpen,
        onOpen: openWeekEditor,
        onClose: closeWeekEditor } = useDisclosure();
    const state = useAppState();
    const onion = useOnion();

    const onWeekEditorClose = (updatedWeekRef: Ref | null) => {
        console.log(`Week And Day:: on Close: updatedWeekRef: `, updatedWeekRef);
        if (updatedWeekRef !== null) {
            setSelectedWeekRef(updatedWeekRef);
        }
        closeWeekEditor();
    };

    const mapState = (state: State) => {
        const weekData = state.getAllFoodOfType(FoodType.Week);
        
        return {
            weekData,
            selectedWeek: selectedWeekRef,
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
            onWeekSelected: (weekRef: Ref | null) => {
                setSelectedWeekRef(weekRef);
    
                // after selecting a week, the day of the week is not known
                // although, maybe we want to keep the day selection unchanged
                setSelectedDayOfWeek(null);
            },
            onDaySelected: (dayOfWeek: number) => {
                if (selectedWeekRef === null) {
                    dataChangeNotify(null, onion);
                    // PERF: use 'useEffect' to notify only on actual changes?
    
                    return;
                }
    
                const choosePositionMatchingDayOfWeek =
                    (ingredient: Ingredient) => ingredient.position === dayOfWeek;
                const week = state.findFood(selectedWeekRef);
                const dayRef = filterOne(week.ingredientsRefs, choosePositionMatchingDayOfWeek).ref;
    
                setSelectedDayOfWeek(dayOfWeek);
                dataChangeNotify(dayRef, onion);
            },
            selectedDay: selectedDayOfWeek,
            todayDay: null, // TODO
        };
    };

    const ConnectedUI = connect(mapState)(UI);
    return (
        <>
            <ConnectedUI/>
            <WeekEditor
                weekRef={editedWeekRef}
                isOpen={isWeekEditorOpen}
                onClose={onWeekEditorClose}
            />
        </>
    );
};

