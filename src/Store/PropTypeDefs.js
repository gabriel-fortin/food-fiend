import PropTypes from 'prop-types';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import { FoodType_PropTypeDef } from '../data/FoodType';

const IngredientRef_PropTypeDef = {
    id: PropTypes.number.isRequired,
    version: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    notes: PropTypes.any,
};

const IngredientData_PropTypeDef = {
    id: PropTypes.number.isRequired,
    version: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    macros: MacrosInfo.PropTypeDef.macros,
    extra: PropTypes.any,

    type: FoodType_PropTypeDef,
    unit: PropTypes.string.isRequired,  // for quantity display only
    portionSize: PropTypes.number.isRequired,  // grams per portion
    portions: PropTypes.number.isRequired,
    // list of <id, version> of ingredients
    ingredientsRefs: PropTypes.arrayOf(PropTypes.shape(IngredientRef_PropTypeDef)).isRequired,
    // list of <id, version> of depending meals
    // it's redundant data so it's there for potential performance gain
    usedBy: PropTypes.arrayOf(PropTypes.any).isRequired,  // TODO: 'food.userBy' prop type def
    // allow uncertainty of macros (and maybe other things)
    uncertainty: PropTypes.oneOfType([PropTypes.oneOf([false]), MacrosInfo.PropTypeDef.macros]),

};

export { IngredientRef_PropTypeDef, IngredientData_PropTypeDef };
