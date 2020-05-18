import React from 'react';

import { Ref, Food } from 'Model';


interface PopupListProps {
    dataToDisplay: Food[],
    onSelection: (ref: Ref) => void,
}

export const PopupList: React.FC<PopupListProps> = ({dataToDisplay, onSelection}) => {
    return (
        <div id="popup">
            {dataToDisplay.map(x => (
                <div
                    key={x.ref.id}
                    // value={x.id}  // was there but doesn't compile in typescript
                    onClick={e => onSelection(x.ref)}
                    >
                        {x.name}
                </div>
            ))}
        </div>
    );
}