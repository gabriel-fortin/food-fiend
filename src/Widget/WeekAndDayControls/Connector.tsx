import React from "react";
import { connect } from "react-redux";

import { FoodType, Ref } from "Model";
import { State } from "Store";

import { WeeksAndDaysHorizontally as UI } from "./UI/WeeksAndDaysHorizontally";


interface Props {
    weekRef: Ref;
    onWeekSelected: (ref: Ref | null) => void;
}


export const Connector: React.FC<Props> = ({ weekRef, onWeekSelected }) => {
    const mapState = (state: State) => ({
        weekData: state.getAllFoodOfType(FoodType.Week),
        selectedWeek: weekRef,
        onWeekSelected,
        isPrevWeekAvailable: false, // TODO
        isNextWeekAvailable: false, // TODO
        onPrevWeekSelected: () => console.warn(`NOT IMPLEMENTED: on prev week selected`),
        onNextWeekSelected: () => console.warn(`NOT IMPLEMENTED: on next week selected`),
        onWeekAdd: () => console.warn(`NOT IMPLEMENTED: on week add`),
        onWeekEdit: () => console.warn(`NOT IMPLEMENTED: on week edit`),
        selectedDay: 1, // TODO
        todayDay: 0, // TODO
    });

    const ConnectedUI = connect(mapState)(UI);
    return (
        <ConnectedUI/>
    );
};
