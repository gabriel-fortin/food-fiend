import { Ref } from './Ref';
import { Ingredient } from './Ingredient';
import { Macros, MacrosUncertainty } from './Macros';
import { FoodType } from './FoodType';

export class Food {

    ref: Ref;

    name: string;

    macros: Macros;

    /** Uncertainty of macros; false means no uncertainty */
    uncertainty: MacrosUncertainty;
    // TODO: start using uncertainty

    extra: any;

    type: FoodType;

    /** A name for the unit, usually 'g' or 'piece' */
    unit: string;
    
    /** Number of grams per one portion */
    portionSize: number;  // TODO:: TS: maybe: make a 'gram'/'weight' type
    
    /** Number of portions from the ingredients */
    portions: number;
    
    ingredientsRefs: Ingredient[];

    /** Foods where this food appears as ingredient */
    usedBy: Ref[];

    constructor(
        ref: Ref,
        name: string,
        type: FoodType,
        macros: Macros,
        unitName: string = "g",
        portionSize: number = 1,
        portions: number = 1,
    ) {
        this.ref = ref;
        this.name = name;
        this.type = type;
        this.macros = macros;
        this.unit = unitName;
        this.portionSize = portionSize;
        this.portions = portions;

        this.ingredientsRefs = [];
        this.usedBy = [];
        this.uncertainty = false;
    }
}
