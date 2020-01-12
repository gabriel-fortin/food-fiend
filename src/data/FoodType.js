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
};

const FoodType_PropTypeDef =
    PropTypes.oneOf([FoodType.Simple, FoodType.Compound]);

export default FoodType;
export { FoodType, FoodType_PropTypeDef };
