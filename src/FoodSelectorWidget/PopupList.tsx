import React from 'react';

import { DataItem } from './DataItem';


interface PopupListProps {
    dataToDisplay: DataItem[],
    onSelection: (id: number) => void,
}

export const PopupList: React.FC<PopupListProps> = ({dataToDisplay, onSelection}) => {
    return (
        <div id="popup">
            {dataToDisplay.map(x => (
                <div
                    key={x.id}
                    // value={x.id}  // was there but doesn't compile in typescript
                    onClick={e => onSelection(x.id)}
                    >
                        {x.name}
                </div>
            ))}
        </div>
    );
}