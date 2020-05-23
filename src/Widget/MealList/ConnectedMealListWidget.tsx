import React from 'react';
import { connect } from 'react-redux';

import { Ref } from 'Model';
import { State } from 'Store';
import Onion from 'Onion';

import { MealListWidget } from './MealListWidget';


const mapStateToProps = (dayRef: Ref, uiEnclosure: Onion) => (state: State) => {
    const dayPlan = state.findFood(dayRef);

    const mealsAndRefs = dayPlan.ingredientsRefs;
    return {mealsAndRefs, uiEnclosure};
};

// TODO: MealListWidget: mapDispatchToProps
const mapDispatchToProps = {};


interface CMLWProps {
    dayRef: Ref;
    uiEnclosure: Onion;
}
export const ConnectedMealListWidget: React.FC<CMLWProps> = ({ dayRef, uiEnclosure = Onion.create() }) => {
    const nestedEnclosure = uiEnclosure.withFoodLayer(dayRef);

    const Widget = connect(
        mapStateToProps(dayRef, nestedEnclosure),
        mapDispatchToProps
    )(MealListWidget);

    return <Widget />;
}
