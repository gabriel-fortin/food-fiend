import React from 'react';


interface TheInputFieldProps {
    onTextChange: (value: string) => void,
    onEscape: () => void,
}

export const TheInputField: React.FC<TheInputFieldProps> = ({onTextChange, onEscape}) => {
    return (
        <input
            onChange={e => onTextChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onEscape(); }}
        />
    );
}
