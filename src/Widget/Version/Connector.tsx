import React, { useState } from "react";

import { Ref, Food } from "Model";

import { BadgeMenu as VersionUI } from "./UI/BadgeMenu";
import { connect, useDispatch } from "react-redux";
import { State, changeFoodVersion } from "Store";
import { useOnion } from "Onion";


interface Props {
    foodRef: Ref
}

export const Connector: React.FC<Props> = ({ foodRef }) => {
    const dispatch = useDispatch();
    const onion = useOnion();

    const mapState = (state: State) => {
        const allVersions = state.findFoodAllVersions(foodRef.id);
        return {
            currentVersionText: String(foodRef.ver),
            options: allVersions.map(food => {
                // versionText, onSelected

                return {
                    versionText: versionTextFromFood(food),
                    onSelected: () => 
                        dispatch(changeFoodVersion(food.ref.ver, onion)),
                };
            }),
        };
    };
    const ConnectedUI = connect(mapState)(VersionUI);

    return (<ConnectedUI />);
};

const versionTextFromFood: (f: Food) => string =
    (food: Food) => `v${food.ref.ver}`;
