import React, { useState } from "react";
import { connect } from "react-redux";
import { useDisclosure } from "@chakra-ui/core";

import { FoodType, Ingredient, Ref } from "Model";
import { setCurrentDay, State, useAppState } from "Store";
import { eqRef, filterOne } from "tools";

import { WeeksAndDaysHorizontally as UI } from "./UI/WeeksAndDaysHorizontally";
import { WeekEditor } from "Widget";


export const Connector: React.FC = () => {
    const [selectedWeekRef, setSelectedWeekRef] = useState<Ref|null>(null);
    const [editedWeekRef, setEditedWeekRef] = useState<Ref|null>(null);
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number|null>(null);
    const {
        isOpen: isWeekEditorOpen,
        onOpen: openWeekEditor,
        onClose: closeWeekEditor } = useDisclosure();
    const state = useAppState();

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
            onWeekAdd: () => {
                // 'selectedWeekRef' is used to indicate which week is edited
                // when adding a new week, it needs to be null
                // setSelectedWeekRef(null);

                setEditedWeekRef(null);

                openWeekEditor();
            },
            onWeekEdit: () => {
                setEditedWeekRef(selectedWeekRef);

                openWeekEditor();
            },
            selectedDay: selectedDayOfWeek,
            todayDay: null, // TODO
        };
    };

    const mapDispatch = {
        onWeekSelected: (weekRef: Ref | null) => {
            setSelectedWeekRef(weekRef);

            // after selecting a week, the day of the week is not known
            setSelectedDayOfWeek(null);
            return setCurrentDay(null);
        },
        onDaySelected: (dayOfWeek: number) => {
            if (selectedWeekRef === null) return setCurrentDay(null);

            const positionMatchingDayOfWeek =
                (ingredient: Ingredient) => ingredient.position === dayOfWeek;
            const week = state.findFood(selectedWeekRef);
            const dayRef = filterOne(week.ingredientsRefs, positionMatchingDayOfWeek).ref;

            setSelectedDayOfWeek(dayOfWeek);
            return setCurrentDay(dayRef);
        },
    };

    const ConnectedUI = connect(mapState, mapDispatch)(UI);
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

