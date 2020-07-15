import { immerable } from 'immer';

import { Ref } from './Ref';
import { Macros } from './Macros';
import { FoodType } from './FoodType';
import { Ingredient } from './Ingredient';
import { Food } from './Food';
import { StorageInfo } from './StorageInfo';


const immeriseModels = () => {
    (Ref.prototype as any)[immerable] = true;
    (Macros.prototype as any)[immerable] = true;
    (Ingredient.prototype as any)[immerable] = true;
    (Food.prototype as any)[immerable] = true;
    (StorageInfo.prototype as any)[immerable] = true;
};
immeriseModels();


export type MacrosUncertainty = import ('./Macros').MacrosUncertainty;
export type Message = import('./Message').Message;

export { Ref, Macros, FoodType, Ingredient, Food, StorageInfo };
