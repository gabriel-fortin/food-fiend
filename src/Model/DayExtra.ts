import { timelessDate } from "tools";

export class DayExtra {
    date: Date;
    weekDayName: string|null;

    constructor(date: Date, weekDayName: string|null = null) {
        this.date = timelessDate(date);
        this.weekDayName = weekDayName;
    }
}
