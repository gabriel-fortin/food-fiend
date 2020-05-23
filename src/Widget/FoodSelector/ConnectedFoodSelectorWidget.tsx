import React from "react";
import { connect } from "react-redux";

import { State, appendIngredient } from "Store";
import { Ref } from "Model";
import Onion from "Onion";

import { FoodSelectorWidget } from "./FoodSelectorWidget";


interface ConnectedFoodSelectorProps {
    context: Onion;
}

export const ConnectedFoodSelectorWidget: React.FC<ConnectedFoodSelectorProps> = ({ context }) => {
    const mapState = (state: State) => ({
        data: state.getAllLatestFoods(),
    });
    const mapDispatch = {
        onFoodSelected: (ref: Ref) => {
            return appendIngredient(ref, context);
        },
    };

    const ConnectedWidget = connect(mapState, mapDispatch)(FoodSelectorWidget);

    return <ConnectedWidget />;
};
