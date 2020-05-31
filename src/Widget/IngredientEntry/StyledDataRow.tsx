import React, { useState } from "react";
import { Box, Flex, PseudoBox } from "@chakra-ui/core";

import { Macros } from "Model";
import { MacrosInfo } from "Widget";
import { QuantityEditor } from "UI";


// FIX: style of a row is tied to the style of the header (which is defined in IngredientsList)


interface Props {
    name: string;
    macros: Macros;
    quantity: number;
    onQuantityChange: (newQuantity: string) => void;
}

export const StyledDataRow: React.FC<Props> = ({
    name,
    macros,
    quantity,
    onQuantityChange,
}) => {
    const [editMode, setEditMode] = useState(false);
    const userClicksQuantityValue = () => {
        setEditMode(true);
    };

    const [hoveredOver, setHoveredOver] = useState(false);

    const userAcceptsQuantityChange = (newQuantity: string) => {
        onQuantityChange(newQuantity);
        setEditMode(false);
    };
    const userAbandonsEditing = () => {
        setEditMode(false);
    };

    const rightExtension = "6em";

    return (
        <>
            <Box className="divider" />

            <PseudoBox
                gridColumn="1 / -1"
                width="100%"
            >
                <Flex
                    justify="space-between"
                    position="relative"
                    style={hoveredOver && {
                        boxShadow: "1px 1px 13px 1px grey"
                    } || {}}
                    marginRight={`-${rightExtension}`}
                    onMouseEnter={e => setHoveredOver(true)}
                    onMouseLeave={e => setHoveredOver(false)}
                >
                    <Box
                        className="name"
                        flexBasis="40%"
                        flexGrow={5}
                        alignSelf="center"
                    >
                        {name}
                    </Box>
                    <Box
                        flexBasis="9em"
                        flexGrow={1}
                    >
                        <MacrosInfo macros={macros} />
                    </Box>
                    <Box
                        flexBasis="5em"
                        textAlign="center"
                        onClick={userClicksQuantityValue}
                        alignSelf="center"
                    >
                        {
                            /* eslint-disable no-mixed-operators */
                            editMode
                            && <QuantityEditor
                                quantity={quantity}
                                userAbandonsEditing={userAbandonsEditing}
                                userAcceptsQuantityChange={userAcceptsQuantityChange}
                            />
                            || quantity
                            /* eslint-enable no-mixed-operators */
                        }
                        <span>g</span>
                    </Box>
                    <Box
                        marginY="auto"
                        width={rightExtension}
                        textAlign="center"
                    >
                        REMOVE
                    </Box>
                </Flex>
            </PseudoBox>
        </>
    );
};
