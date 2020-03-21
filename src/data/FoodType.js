import PropTypes from 'prop-types';

const FoodType = {
    /**
     * Simple food ingredient
     */
    Simple: "SiMpLe",

    /**
     * Food that is composed of some ingredients
     */
    Compound: "CoMPouNd",

    /**
     * Unversioned (thus mutable) food that represents a day
     */
    Day: "DaY",
};

const FoodType_PropTypeDef =
    PropTypes.oneOf([FoodType.Simple, FoodType.Compound]);

export default FoodType;
export { FoodType, FoodType_PropTypeDef };
