import React from "react";

import { Food, Ref } from "Model";

import { UI_1 } from "./UI_1";


interface Props {
    // weekRef: Ref;
    debug__weekData: Food[];
}


export const Connector: React.FC<Props> = ({ debug__weekData }) => {
    return (
        <UI_1
            weekData={debug__weekData}
            selectedWeek={debug__weekData[0].ref}
            isPrevWeekAvailable={false}
            isNextWeekAvailable={true}
            onPrevWeekSelected={() => console.warn(`NOT IMPLEMENTED: on prev week selected`)}
            onNextWeekSelected={() => console.warn(`NOT IMPLEMENTED: on next week selected`)}
            onWeekSelected={() => console.warn(`NOT IMPLEMENTED: on week selected`)}
            onWeekAdd={() => console.warn(`NOT IMPLEMENTED: on week add`)}
            onWeekEdit={() => console.warn(`NOT IMPLEMENTED: on week edit`)}

            selectedDay={1}
            todayDay={0}
        />
    );
};
