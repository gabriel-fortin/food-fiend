export class Macros {

    fat: number;

    protein: number;

    carbs: number;

    constructor(
        fat: number,
        protein: number,
        carbs: number,
    ){
        this.fat = fat;
        this.protein = protein;
        this.carbs = carbs;
    }
}

export type MacrosUncertainty = Macros | false;
