import React, { useState } from "react";


// TODO: use pattern
//          - don't fire userAcceptsChange if pattern not matched
//          - visually show when input doesn't match the pattern


interface Props {
    text: string;
    userAcceptsChange?: (q: string) => void;
    pattern?: string;
}

export const EditableText: React.FC<Props> = ({
    text,
    userAcceptsChange = () => {},
    pattern = ".*",
}) => {
    const [editMode, setEditMode] = useState(false);
    const userClicksQuantityValue = () => {
        setEditMode(true);
    };
    const userAbandonsEditing = () => {
        setEditMode(false);
    };

    return (
        editMode
        &&
        <span className="editable-text">
            <input
                pattern={pattern}
                autoFocus
                onFocus={e => {
                    // when editing starts, put the current value in and select it
                    // so the user can enter a new value more easily
                    e.target.value = text;
                    e.target.select();
                }}
                onBlur={e => userAbandonsEditing()}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Escape') userAbandonsEditing();
                    if (e.key === 'Enter') userAcceptsChange(e.currentTarget.value);
                }}
            />
        </span>
        ||
        <span
            onClick={e => userClicksQuantityValue()}
        >
            {text}
        </span>
    );
}
