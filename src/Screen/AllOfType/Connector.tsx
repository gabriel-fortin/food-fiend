import React from "react";
import { connect } from "react-redux";

import { State } from "Store";
import { FoodType } from "Model";

import { JustSimpleUI as TheUI } from "./JustSimpleUI";


export const Connector: React.FC = () => {
    const mapState = (state: State) => ({
        getAllOfType: (foodType: FoodType) => state.getAllFoodOfType(foodType).map(x => x.ref),
    });
    const ConnectedUI = connect(mapState)(TheUI);

    return <ConnectedUI />;
};
