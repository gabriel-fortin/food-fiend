import React from "react";
import { Stack } from "@chakra-ui/core";

import { FoodType } from "Model";

import { Props } from "./Props";
import { DayControls } from "./DayControls";
import { WeekControls } from "./WeekControls";
import { eqRef, formatRef } from "tools";


export const WeeksAndDaysHorizontally: React.FC<Props> = (props) => {
    const { weekData, selectedWeek: selected } = props;

    weekData.forEach((food, i) => {
        if (food.type !== FoodType.Week) {
            throw new Error(`Expected "week data" to contain weeks but item ${i} has type ` +
                `'${food.type}'`);
        }
    });

    if (selected !== null && weekData.every(f => !eqRef(f.ref, selected))) {
        console.warn(`All available weeks (${weekData.length}): ` +
            weekData.map(w => formatRef(w.ref)));
        console.warn(`Received week ${selected} is not on that list`);
        
        throw new Error(`The "selected week" ref [${selected.id}/${selected.ver}] ` +
            `does not exist on the "week data" list`);
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginX={5}
            marginTop={10}
        >

            <WeekControls {...props} />
            <DayControls {...props} />

        </Stack>
    );
};
