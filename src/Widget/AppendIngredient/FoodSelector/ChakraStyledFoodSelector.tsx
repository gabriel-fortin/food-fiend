import React, { useState } from "react";

import { Ref, Food } from "Model";

import { TheInputField } from "./TheInputField";
import { PopupList } from "./PopupList";
import "./food-selector.css";


export interface Props {
    getFilteredData: (partialName: string) => Food[],
    onFoodSelected: (ref: Ref) => void,
}
export const ChakraStyledFoodSelector: React.FC<Props> = ({ getFilteredData, onFoodSelected }) => {
    let [currentText, setCurrentText] = useState("");
    let [popupVisible, setPopupVisibility] = useState(false);

    // reactions to user actions
    const onTextChange = (text : string) => {
        setCurrentText(text);
        setPopupVisibility(text.length > 0);
    };
    const onEscape = () => {
        setPopupVisibility(false);
    };

    return (
        <div className="food-selector">
            <TheInputField
                onTextChange={onTextChange}
                onEscape={onEscape} />
            {popupVisible && <PopupList
                                dataToDisplay={getFilteredData(currentText)}
                                onSelection={onFoodSelected} />}
        </div>
    );
}
