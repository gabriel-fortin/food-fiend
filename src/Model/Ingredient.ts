import Ref from "./Ref";

class Ingredient {

    ref: Ref;
    
    /** Position in a list of ingredients */
    position: number;

    quantity: number;

    notes: any;

    constructor(
        ref: Ref,
        position: number,
        quantity: number,
    ){
        this.ref = ref;
        this.position = position;
        this.quantity = quantity;
    }
}

export default Ingredient;