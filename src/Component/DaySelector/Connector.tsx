import React, { ReactElement } from "react";

import { FoodLayerProvider, PositionLayerProvider } from "Onion";
import { useAppState } from "Store";
import { Ref } from "Model";
import { formatRef } from "tools";

import { HorizontalButtonsUI } from "./HorizontalButtonsUI";


interface Props {
    weekRef: Ref | null;
    children?: (dayRef: Ref) => ReactElement;
}


export const Connector: React.FC<Props> = ({
    weekRef,
    children = () => null,
}) => {
    const appState = useAppState();
    const someHalfRandomDayRef = (weekRef!==null && appState.findFood(weekRef).ingredientsRefs[0].ref) as Ref;

    console.log(`DAY SELECTOR:  constructed day ref: ${formatRef(someHalfRandomDayRef)}`);
    console.log(`DAY SELECTOR:  week ref: ${formatRef(weekRef)}  children present: ${children!==undefined}`);

    const seelctedDay: number | null = 0;

    return (
        <>
            {weekRef !== null && seelctedDay !== null &&
                <FoodLayerProvider food={weekRef}>
                    <PositionLayerProvider position={seelctedDay}>
                        {children(someHalfRandomDayRef)}
                    </PositionLayerProvider>
                </FoodLayerProvider>
            }
            <HorizontalButtonsUI
                selectedDay={seelctedDay}
                todayDay={null}
                onDaySelected={() => console.log(`NOT IMPLEMENTED: on day selected`)}
            />
        </>
    );
};
