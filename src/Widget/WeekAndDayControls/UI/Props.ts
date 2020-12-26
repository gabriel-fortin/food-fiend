import { Food, Ref } from "Model";


export interface Props {
    weekData: Food[];
    selectedWeek: Ref | null;
    isPrevWeekAvailable: boolean;
    isNextWeekAvailable: boolean;
    onWeekSelected: (w: Ref | null) => void;
    onPrevWeekSelected: () => void;
    onNextWeekSelected: () => void;
    onWeekAdd: () => void;
    onWeekEdit: () => void;
    
    selectedDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 | null;
    todayDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 | null;
}
