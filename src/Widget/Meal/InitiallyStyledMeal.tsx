import React from "react";
import { EditableInput, EditablePreview, Editable } from "@chakra-ui/core";

import { MacrosInfo } from "Widget";
import { Macros } from "Model";

import { FoodAdder } from "./FoodAdder";
import "./meal-widget.css";


interface Props {
    name: string;
    totalMacros: Macros;
    onNameChange: (newName: string) => void;
}

export const InitiallyStyledMeal: React.FC<Props> = ({ name, totalMacros, onNameChange, children }) => {
    return (
        <div className="meal">
            <div className="meal-header">
                <h2>
                    <Editable
                        marginLeft={3}
                        defaultValue={name}
                        startWithEditView={name === ""}
                        onSubmit={onNameChange}
                    >
                        <EditablePreview />
                        <EditableInput />
                    </Editable>
                </h2>
                <div className="meal-macros">
                {/* TODO: maybe, make Macros Info read its own data */}
                    <MacrosInfo macros={totalMacros} />
                </div>
            </div>
            {children}
            <FoodAdder />
        </div>
    );
}
