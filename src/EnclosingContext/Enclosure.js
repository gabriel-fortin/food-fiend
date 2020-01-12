import PropTypes from 'prop-types';


const EnclosingContext_PropTypeDef = PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
        type: PropTypes.oneOf(["FOOD_ITEM"]).isRequired,
        foodId: PropTypes.number.isRequired,
    },
)]));

function foodItemEnclosure(foodId) {
    return {
        type: "FOOD_ITEM",
        foodId: foodId,
    };
}

export { EnclosingContext_PropTypeDef, foodItemEnclosure };
