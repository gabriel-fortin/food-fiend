import { timelessDate } from "tools";

export class WeekExtra {
    startDate: Date;
    weekLength: number;

    constructor(startDate: Date, weekLength: number) {
        if (weekLength <= 0){
            throw Error(`A week usually has about 7 days, not '${weekLength}'`);
        }

        this.startDate = timelessDate(startDate);
        this.weekLength = weekLength;
    }
}
