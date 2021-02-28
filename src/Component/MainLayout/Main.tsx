import React from "react";

import { WeekFromStore, StarGate, DaySelector, WeekSelector } from "Component";
import { DiagnosticDayDisplay } from "Component/Day";

import { HorizontalTopBar } from "./HorizontalWeekAndDaySelectors";


export const Main: React.FC = () => {
    return (
        <WeekFromStore>
            {(weekRef, onWeekChange) =>
                <StarGate.Provider>

                    <HorizontalTopBar>
                        <WeekSelector weekRef={weekRef} onWeekChanged={onWeekChange}/>
                        <DaySelector weekRef={weekRef}>
                            {dayRef => <StarGate.In transport={dayRef} />}
                        </DaySelector>
                    </HorizontalTopBar>

                    <StarGate.Out>
                        {ref => <DiagnosticDayDisplay dayRef={ref} />}
                    </StarGate.Out>

                </StarGate.Provider>
            }
        </WeekFromStore>
    );
};
