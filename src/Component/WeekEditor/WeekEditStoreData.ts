import { Ref } from "Model";
import { Onion } from "Onion";


export interface WeekEditStoreData {
    weekRef: Ref | null;
    callerContext: Onion;
    weekName: string;
    weekStartDate: Date;
}
