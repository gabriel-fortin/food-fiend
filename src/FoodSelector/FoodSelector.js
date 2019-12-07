import React, {useState} from 'react';
import './food-selector.css';

function FoodSelector({data, onFoodSelected}) {
    let [currentText, setCurrentText] = useState("");
    let [popupVisible, setPopupVisibility] = useState(false);

    // data processing
    const foodMatching = input => {
        const sanitisedInput = input.replace(/[^-'%/a-zA-Z]/g, "");
        const regex = new RegExp(sanitisedInput, "i");
        return data.filter(x => regex.test(x.name));
    };
    const filteredSuggestions = foodMatching(currentText);

    // reactions to user actions
    const onTextChange = text => {
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

function TheInputField({onTextChange, onEscape}) {
    return (
        <input
            onChange={e => onTextChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onEscape(); }}
        />
    );
}

function PopupList({dataToDisplay, onSelection}) {
    return (
        <div id="popup">
            {dataToDisplay.map(x => (
                <div
                    key={x.id}
                    value={x.id}
                    onClick={e => onSelection(x.id)}
                >
                        {x.name}
                </div>
            ))}
        </div>
    );
}

export default FoodSelector;