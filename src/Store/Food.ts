export default interface Food {
    // TODO: replace 'id' and 'version' with 'ref'
    id: number;
    version: number;
    name: string;
    macros: any;  // TODO: TS: type for macros
    extra: any;
    type: any;  // TODO: TS: use FoodType (when it's implemented)
    unit: string;
    portionSize: number;  // TODO:: TS: maybe: make a 'gram'/'weight' type?
    portions: number;
    ingredientsRefs: any[];  // TODO: TS: type for ingredientsRefs
    usedBy: any[];
    uncertainty: any;  // TODO: TS: same type as macros
}
