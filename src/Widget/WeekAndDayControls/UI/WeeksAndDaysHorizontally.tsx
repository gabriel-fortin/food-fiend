import React from "react";
import { Stack } from "@chakra-ui/core";

import { FoodType } from "Model";

import { Props } from "./Props";
import { DayControls } from "./DayControls";
import { WeekControls } from "./WeekControls";


export const WeeksAndDaysHorizontally: React.FC<Props> = (props) => {
    const { weekData, selectedWeek: selected } = props;

    weekData.forEach((food, i) => {
        if (food.type !== FoodType.Week) {
            throw new Error(`Expected "week data" to contain weeks but item ${i} has type ` +
                `'${food.type}'`);
        }
    });

    if (selected !== null && weekData.every(f => f.ref !== selected)) {
        console.warn(`All available weeks (${weekData.length}): ` +
            weekData.map(w => `[${selected.id}/${selected.ver}]`));

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