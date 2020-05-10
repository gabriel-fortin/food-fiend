import { Ref } from "./Ref";

export class Ingredient {

    ref: Ref;
    
    /** Position in a list of ingredients */
    position: number;

    quantity: number;

    notes: any;

    /** For React's lists */
    key: number;

    private static nextKey: number = 1;

    constructor(
        ref: Ref,
        position: number,
        quantity: number,
        notes: any,
    ){
        this.ref = ref;
        this.position = position;
        this.quantity = quantity;
        this.notes = notes;
        
        this.key = Ingredient.nextKey++;
    }
}
