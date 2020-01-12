import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { findFood, LATEST } from '../Store/Store';

import MealListWidget from './MealListWidget';

const mapStateToProps = (dayId, dayVersion) => (state) => {
    const dayPlan = findFood(state, dayId, dayVersion);
    const meals = dayPlan.ingredientsRefs.map(foodRef =>
        findFood(state, foodRef.id, foodRef.version)
    );
    return {meals};
};

// TODO: MealListWidget: mapDispatchToProps
const mapDispatchToProps = {};

function ConnectedMealListWidget({dayId}) {
    const Widget = connect(
        mapStateToProps(dayId, LATEST),
        mapDispatchToProps
    )(MealListWidget);

    return <Widget />;
}
ConnectedMealListWidget.PropTypeDef = {
    dayId: PropTypes.number.isRequired,
    dayVersion: PropTypes.number.isRequired,
};


export default ConnectedMealListWidget;
