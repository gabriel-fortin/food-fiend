import { Ref } from "Model"
import { Onion } from "Onion";


export interface OpenWeekEditorAction {
    type: "WEEK EDITOR - OPEN";
    context: Onion;
    weekRef: Ref | null;
}

export interface SaveWeekEditorAction {
    type: "WEEK EDITOR - SAVE";
    weekName: string;
    weekStartDate: string;
}

export interface CancelWeekEditorAction {
    type: "WEEK EDITOR - CANCEL";
}
