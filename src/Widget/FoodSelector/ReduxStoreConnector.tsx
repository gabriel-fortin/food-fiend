import React from "react";
import { connect } from "react-redux";

import { State, appendIngredient } from "Store";
import { useOnion } from "Onion";
import { Ref } from "Model";

import { ChakraStyledFoodSelector as FoodSelectorUI } from "./ChakraStyledFoodSelector";


export const ReduxStoreConnector: React.FC<{}> = () => {
    const onion = useOnion();

    const mapState = (state: State) => ({
        data: state.getAllLatestFoods(),
    });

    const mapDispatch = {
        onFoodSelected: (ref: Ref) => {
            // add ingredient to whatever is indicated by the current Onion context
            return appendIngredient(ref, onion);
        },
    };

    const Connected = connect(mapState, mapDispatch)(FoodSelectorUI);
    return <Connected />;
};
