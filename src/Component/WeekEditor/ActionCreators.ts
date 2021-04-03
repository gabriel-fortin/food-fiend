import { Ref } from "Model";
import { Onion } from "Onion";

import { CancelWeekEditorAction, OpenWeekEditorAction, SaveWeekEditorAction } from "./Actions";


export function addWeek(context: Onion): OpenWeekEditorAction {
    return {
        type: "WEEK EDITOR - OPEN",
        context,
        weekRef: null,
    };
}

export function editWeek(context: Onion, weekRef: Ref): OpenWeekEditorAction {
    return {
        type: "WEEK EDITOR - OPEN",
        context,
        weekRef,
    };
}

export function saveWeekEditor(context: Onion, weekName: string, weekStartDate: string): SaveWeekEditorAction {
    return {
        type: "WEEK EDITOR - SAVE",
        weekName,
        weekStartDate,
    };
}

export function cancelWeekEditor(): CancelWeekEditorAction {
    return {
        type: "WEEK EDITOR - CANCEL",
    };
}
