import { Food, Ref } from "Model";


export interface Props {
    weekData: Food[];
    selectedWeek: Ref | null;
    isPrevWeekAvailable: boolean;
    isNextWeekAvailable: boolean;
    onWeekSelected: (w: Ref | null) => void;
    onPrevWeekSelected: () => void;
    onNextWeekSelected: () => void;
    onWeekAddRequest: () => void;
    onWeekEditRequest: () => void;
    
    selectedDay: number | null;
    todayDay: number | null;
    onDaySelected: (day: number) => void;
}
