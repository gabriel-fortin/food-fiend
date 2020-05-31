import React, { useState } from "react";
import { Box, Flex, PseudoBox, Link } from "@chakra-ui/core";

import { Macros } from "Model";
import { MacrosInfo } from "Widget";
import { QuantityEditor } from "UI";


// FIX: style of a row is tied to the style of the header (which is defined in IngredientsList)


interface Props {
    name: string;
    macros: Macros;
    quantity: number;
    onQuantityChange: (newQuantity: string) => void;
    onRemoveEntry: () => void;
}

export const StyledDataRow: React.FC<Props> = ({
    name,
    macros,
    quantity,
    onQuantityChange,
    onRemoveEntry,
}) => {
    const [showRightExtension, setShowRightExtension] = useState(false);
    const mouseEntersRow = () => setShowRightExtension(true);
    const mouseLeavesRow = () => setShowRightExtension(false);

    const [editMode, setEditMode] = useState(false);
    const userClicksQuantityValue = () => {
        setEditMode(true);
    };

    const userAcceptsQuantityChange = (newQuantity: string) => {
        onQuantityChange(newQuantity);
        setEditMode(false);
    };
    const userAbandonsEditing = () => {
        setEditMode(false);
    };

    const currentRightExtensionSize = showRightExtension ? "6em" : "0";

    return (
        <>
            <Box className="divider" />

            <PseudoBox
                gridColumn="1 / -1"
                width="100%"
            >
                <Flex
                    style={showRightExtension
                        ? {
                            boxShadow: "1px 1px 13px 1px grey",
                            paddingRight: currentRightExtensionSize,
                        }
                        : {}
                    }
                    marginRight={`-${currentRightExtensionSize}`}
                    onMouseEnter={mouseEntersRow}
                    onMouseLeave={mouseLeavesRow}
                >
                    <Box
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
                        display={showRightExtension ? "unset" : "none"}
                        marginY="auto"
                        marginRight={`-${currentRightExtensionSize}`}
                        width={currentRightExtensionSize}
                        textAlign="center"
                    >
                        <Link
                            color="rgba(200, 50, 50, 1)"
                            onClick={onRemoveEntry}
                        >
                            remove
                        </Link>
                    </Box>
                </Flex>
            </PseudoBox>
        </>
    );
};
