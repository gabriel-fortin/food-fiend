import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { findFood, LATEST } from '../Store/Store';
import { EnclosingContext_PropTypeDef, foodItemEnclosure} from '../EnclosingContext';

import MealListWidget from './MealListWidget';

const mapStateToProps = (dayId, dayVersion, uiEnclosure) => (state) => {
    const dayPlan = findFood(state, dayId, dayVersion);
    const meals = dayPlan.ingredientsRefs.map(foodRef =>
        findFood(state, foodRef.id, foodRef.version)
    );
    return {meals, uiEnclosure};
};

// TODO: MealListWidget: mapDispatchToProps
const mapDispatchToProps = {};

function ConnectedMealListWidget({dayId, uiEnclosure=[]}) {
    const Widget = connect(
        mapStateToProps(dayId, LATEST, [...uiEnclosure, foodItemEnclosure(dayId)]),
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
