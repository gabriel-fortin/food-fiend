import React from "react";
import { Box } from "@chakra-ui/core";

import { Ref, Food } from "Model";


interface PopupListProps {
    dataToDisplay: Food[],
    onSelection: (ref: Ref) => void,
}

export const PopupList: React.FC<PopupListProps> = ({ dataToDisplay, onSelection }) => {
    return (
        <ul className="popup">
            {dataToDisplay.map(item => (
                <li
                    key={item.ref.id}
                    onClick={e => onSelection(item.ref)}
                >
                    <Item item={item} />
                </li>
            ))}
        </ul>
    );
};

const Item: React.FC<{ item: Food }> = ({ item }) =>
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
    ;
