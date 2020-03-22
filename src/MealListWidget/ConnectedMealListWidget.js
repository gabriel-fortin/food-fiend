import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { findFood, LATEST } from '../Store/Store';
import { EnclosingContext_PropTypeDef, emptyEnclosure} from '../EnclosingContext';

import MealListWidget from './MealListWidget';


const mapStateToProps = (dayId, dayVersion, uiEnclosure) => (state) => {
    const dayPlan = findFood(state, dayId, dayVersion);
    const mealsAndRefs = dayPlan.ingredientsRefs.map(foodRef =>
        ({foodRef, foodData: findFood(state, foodRef.id, foodRef.version)})
    );
    return {mealsAndRefs, uiEnclosure};
};

// TODO: MealListWidget: mapDispatchToProps
const mapDispatchToProps = {};

function ConnectedMealListWidget({dayId, uiEnclosure=emptyEnclosure()}) {
    const nestedEnclosure = uiEnclosure.withFoodItem(dayId, -14);  // TODO: replace -14 with constant
    const Widget = connect(
        mapStateToProps(dayId, LATEST, nestedEnclosure),
        mapDispatchToProps
    )(MealListWidget);

    return <Widget />;
}


ConnectedMealListWidget.PropTypeDef = {
    dayId: PropTypes.number.isRequired,
    dayVersion: PropTypes.number.isRequired,
    uiEnclosure: EnclosingContext_PropTypeDef,
};


export default ConnectedMealListWidget;
