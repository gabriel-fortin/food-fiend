import React, { useState } from "react";
import { connect } from "react-redux";

import { FoodType, Ingredient, Ref } from "Model";
import { setCurrentDay, State, useAppState } from "Store";
import { eqRef, filterOne } from "tools";

import { WeeksAndDaysHorizontally as UI } from "./UI/WeeksAndDaysHorizontally";


export const Connector: React.FC = () => {
    const [selectedWeekRef, setSelectedWeekRef] = useState<Ref|null>(null);
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number|null>(null);
    const state = useAppState();

    const mapState = (state: State) => {
        const weekData = state.getAllFoodOfType(FoodType.Week)

        return {
            weekData,
            selectedWeek: selectedWeekRef,
            isPrevWeekAvailable: weekData !== [] && selectedWeekRef !== null && !eqRef(selectedWeekRef, weekData[0].ref),
            isNextWeekAvailable: weekData !== [] && selectedWeekRef !== null && !eqRef(selectedWeekRef, weekData[weekData.length - 1].ref),
        onPrevWeekSelected: () => console.warn(`NOT IMPLEMENTED: on prev week selected`),
        onNextWeekSelected: () => console.warn(`NOT IMPLEMENTED: on next week selected`),
        onWeekAdd: () => console.warn(`NOT IMPLEMENTED: on week add`),
        onWeekEdit: () => console.warn(`NOT IMPLEMENTED: on week edit`),
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
            if (selectedWeekRef === null) return;

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
        <ConnectedUI/>
    );
};
