import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/core";

import { Ref, Food } from "Model";


interface PopupListProps {
    dataToDisplay: Food[],
    onSelection: (ref: Ref) => void,
}

/** how many displayed items to start with */
const START_SIZE = 100;

/** how many more items to display every tick */
const INCREASE_STEP = 300;

/** Gradually fills a popup with given data */
export const PopupList: React.FC<PopupListProps> = ({ dataToDisplay, onSelection }) => {
    const [numberOfItemsToShow, setNumberOfItemsToShow] = useState(START_SIZE);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (dataToDisplay.length > numberOfItemsToShow) {
                setNumberOfItemsToShow(numberOfItemsToShow + INCREASE_STEP);
            }
        }, 1000);
        
        return () => {
            // stops previous process when new 'dataToDisplay' arrives
            clearTimeout(timeoutId);
        };
    }, [numberOfItemsToShow, dataToDisplay]);
    
    const itemsToActuallyShow = dataToDisplay.slice(0, numberOfItemsToShow);

    return (
        <ul className="popup">
            {itemsToActuallyShow.map(item =>
                <Item
                    key={item.ref.id}
                    item={item}
                    onSelection={onSelection}
                />
            )}
        </ul>
    );
};

const Item: React.FC<{
    item: Food,
    onSelection: (ref: Ref) => void,
}> = ({ item, onSelection }) =>
        <li onClick={_e => onSelection(item.ref)}>
            <Box display="flex" justifyContent="space-between">
                <Box flexGrow={1}>
                    {item.name}
                </Box>
                <Box alignSelf="center" flexShrink={0} color="grey" fontSize="sm">
                    <small>v</small>
                </Box>
                <Box alignSelf="center">
                    {item.ref.ver}
                </Box>
            </Box>
        </li>
    ;
