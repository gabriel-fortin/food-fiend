import { timelessDate } from "tools";

export class WeekExtra {
    startDate: Date;

    constructor(startDate: Date) {
        this.startDate = timelessDate(startDate);
    }
}
