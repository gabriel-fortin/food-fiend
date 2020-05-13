import React, { useState } from 'react';

import { Food, Ref } from 'Model';

import { TheInputField } from './TheInputField';
import { PopupList } from './PopupList';
import { DataItem } from './DataItem';
import './food-selector.css';


interface FoodSelectorProps {
    data: DataItem[],
    onFoodSelected: (id: number) => void,
}
export const FoodSelectorWidget: React.FC<FoodSelectorProps> = ({data, onFoodSelected}) => {
    let [currentText, setCurrentText] = useState("");
    let [popupVisible, setPopupVisibility] = useState(false);

    // data processing
    const foodMatching = (input: string) => {
        const sanitisedInput = input.replace(/[^-'%/a-zA-Z]/g, "");
        const regex = new RegExp(sanitisedInput, "i");
        return data.filter(x => regex.test(x.name));
    };
    const filteredSuggestions = foodMatching(currentText);

    // reactions to user actions
    const onTextChange = (text : string) => {
        setCurrentText(text);
        setPopupVisibility(text.length > 0);
    };
    const onEscape = () => {
        setPopupVisibility(false);
    };

    return (
        <div id="food-selector">
            <TheInputField
                onTextChange={onTextChange}
                onEscape={onEscape} />
            {popupVisible && <PopupList
                                dataToDisplay={filteredSuggestions}
                                onSelection={onFoodSelected} />}
        </div>
    );
}