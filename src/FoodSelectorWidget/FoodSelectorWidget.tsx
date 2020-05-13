import React, { useState } from 'react';

import './food-selector.css';


interface DataItem {
    id: number,
    name: string,
}


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


interface TheInputFieldProps {
    onTextChange: (value: string) => void,
    onEscape: () => void,
}
const TheInputField: React.FC<TheInputFieldProps> = ({onTextChange, onEscape}) => {
    return (
        <input
            onChange={e => onTextChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onEscape(); }}
        />
    );
}


interface PopupListProps {
    dataToDisplay: DataItem[],
    onSelection: (id: number) => void,
}
const PopupList: React.FC<PopupListProps> = ({dataToDisplay, onSelection}) => {
    return (
        <div id="popup">
            {dataToDisplay.map(x => (
                <div
                    key={x.id}
                    // value={x.id}
                    onClick={e => onSelection(x.id)}
                    >
                        {x.name}
                </div>
            ))}
        </div>
    );
}
