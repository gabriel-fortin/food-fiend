import React from "react";


interface Props {
    quantity: number;
    userAbandonsEditing: () => void;
    userAcceptsQuantityChange: (q: string) => void;
}

export const QuantityEditor: React.FC<Props> = ({
    quantity,
    userAbandonsEditing,
    userAcceptsQuantityChange,
}) => {
    return (
        <span className="quantity-editor">
            <input
                pattern="\d+(\.\d+)?"
                autoFocus
                onFocus={e => {
                    // when editing starts, put the current value in and select it
                    // so the user can enter a new value more easily
                    e.target.value = String(quantity);
                    e.target.select();
                }}
                onBlur={e => userAbandonsEditing()}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Escape') userAbandonsEditing();
                    if (e.key === 'Enter') userAcceptsQuantityChange(e.currentTarget.value);
                }}
            />
        </span>
    );
}
