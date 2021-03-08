import React, { ReactElement, useState } from "react";

import { FoodLayerProvider, PositionLayerProvider } from "Onion";
import { useAppState } from "Store";
import { Food, FoodType, Ref, WeekExtra } from "Model";
import { eqRef, formatRef } from "tools";

import { HorizontalButtonsUI } from "./HorizontalButtonsUI";


interface Props {
    weekRef: Ref | null;
    children?: (dayRef: Ref | null) => ReactElement;
}


export const Connector: React.FC<Props> = ({
    weekRef,
    children: transmitDayRef = () => null,
}) => {
    let [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [lastSelectedWeek, setLastSelectedWeek] = useState<Ref | null>(null);
    const appState = useAppState();

    if (weekRef === null) {
        return transmitDayRef(null);
    }

    const weekData = appState.findFood(weekRef);
    const weekExtra = (weekData.extra as WeekExtra);
    sanityChecks(weekData);

    // if provided week was switched (not just merely updated)
    if (haveDifferentIds(lastSelectedWeek, weekRef)) {
        setLastSelectedWeek(weekRef);
        // clear day selection
        setSelectedDay(null);
        selectedDay = null;
    }

    function refFor(day: number) {
        return weekData.ingredientsRefs[day].ref;
    };
    
    function todayDay() {
        const todayAsEpoch = new Date().setHours(0, 0, 0, 0); // remove time bits
        const weekStartAsEpoch = weekExtra.startDate.getTime();
        const millisecondsInDay = 24*60*60*1000;
        return Math.round((todayAsEpoch - weekStartAsEpoch) / millisecondsInDay);
    }

    return (
        <>
            <HorizontalButtonsUI
                selectedDay={selectedDay}
                todayDay={todayDay()}
                startDay={weekExtra.startDate.toString().slice(0, 3)}
                weekLength={weekExtra.weekLength}
                onDaySelected={setSelectedDay}
            />

            {(selectedDay === null) && transmitDayRef(null)}
            {(selectedDay !== null) &&
                <FoodLayerProvider food={weekRef}>
                    <PositionLayerProvider position={selectedDay}>
                        {transmitDayRef(refFor(selectedDay))}
                    </PositionLayerProvider>
                </FoodLayerProvider>
            }

        </>
    );
};

const sanityChecks = (weekData: Food) => {
    if (weekData.type !== FoodType.Week) {
        throw new Error(`The food item for the ref '${formatRef(weekData.ref)}' is not a week`);
    }

    const extra = weekData.extra as WeekExtra;
    if (extra.startDate === undefined || extra.weekLength === undefined) {
        console.error(`What we thought is Week Extra:`, weekData.extra);
        throw new Error(`Week Extra is missing; ref '${formatRef(weekData.ref)}'`);
    }

    const ingredientCount = weekData.ingredientsRefs.length;
    const weekLength = (weekData.extra as WeekExtra).weekLength;

    if (ingredientCount !== weekLength) {
        throw new Error(`Mismatch in number of ingredients and length of week: `
            + `'${ingredientCount}', '${weekLength}'`);
    }
};

const haveDifferentIds = (ref1: Ref | null, ref2: Ref | null) => {
    // when both are null
    if (ref1 === null && ref2 === null) return false;

    // when one is null and one has value
    if (ref1 === null || ref2 === null) return true;

    // when both have value
    return ref1.id !== ref2.id;
};
