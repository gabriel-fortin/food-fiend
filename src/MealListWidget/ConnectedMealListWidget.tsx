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
    dayId: number;
    uiEnclosure: Onion;
}
export const ConnectedMealListWidget: React.FC<CMLWProps> = ({ dayId, uiEnclosure = Onion.create() }) => {
    const ref = new Ref(dayId, -14);  // TODO: replace -14 with constant?
    const nestedEnclosure = uiEnclosure.withFoodLayer(ref);

    const Widget = connect(
        // FIX: maybe need to replace -14 with something proper
        mapStateToProps(ref, nestedEnclosure),
        mapDispatchToProps
    )(MealListWidget);

    return <Widget />;
}
