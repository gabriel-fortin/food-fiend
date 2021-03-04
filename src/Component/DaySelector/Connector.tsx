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

    // if we received a different week ref in props
    if (!eqRef(lastSelectedWeek, weekRef)) {
        setLastSelectedWeek(weekRef);
        // make sure the selected day is still valid within the week
        if (selectedDay !== null && selectedDay >= weekExtra.weekLength) {
            setSelectedDay(null);
            selectedDay = null;
        }
    }

    function refFor(day: number) {
        return weekData.ingredientsRefs[day].ref;
    };

    return (
        <>
            <HorizontalButtonsUI
                selectedDay={selectedDay}
                todayDay={null}
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
