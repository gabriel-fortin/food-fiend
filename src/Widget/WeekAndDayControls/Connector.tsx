import React, { useState } from "react";
import { connect } from "react-redux";

import { addDays, DayExtra, eqRef, Food, FoodType, Ref, WeekExtra } from "Model";
import { setCurrentDay, State } from "Store";

import { WeeksAndDaysHorizontally as UI } from "./UI/WeeksAndDaysHorizontally";


export const Connector: React.FC = () => {
    const [selectedWeekRef, setSelectedWeekRef] = useState<Ref|null>(null);
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number|null>(null);

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
            selectedDay: selectedDayOfWeek, // TODO
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
    };

    const ConnectedUI = connect(mapState, mapDispatch)(UI);
    return (
        <ConnectedUI/>
    );
};
