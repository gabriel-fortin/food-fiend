import React, { useState } from "react";
import { Box, Flex, PseudoBox, Link, Editable, EditablePreview, EditableInput } from "@chakra-ui/core";

import { Macros } from "Model";
import { MacrosInfo } from "Widget";

import "./styled-data-row.css";


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
    const [showSideExtensions, setShowSideExtension] = useState(false);
    const mouseEntersRow = () => setShowSideExtension(true);
    const mouseLeavesRow = () => setShowSideExtension(false);

    const userAcceptsQuantityChange = (newQuantity: string) => {
        onQuantityChange(newQuantity);
    };

    const currentRightExtensionSize = showSideExtensions ? "6em" : "0";
    const currentLeftExtensionSize = showSideExtensions ? "0.4em" : "0";

    return (
        <>
            <Box className="divider" />

            <PseudoBox
                gridColumn="1 / -1"
                width="100%"
                className="styled-data-row"
            >

                {/* the thing that is visible on hover */}
                <Flex
                    style={showSideExtensions
                        ? {
                            boxShadow: "1px 1px 13px 1px grey",
                            borderRadius: "3px",
                            paddingRight: currentRightExtensionSize,
                            paddingLeft: currentLeftExtensionSize,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }
                        : {}
                    }
                    marginRight={`-${currentRightExtensionSize}`}
                    marginLeft={`-${currentLeftExtensionSize}`}
                    onMouseEnter={mouseEntersRow}
                    onMouseLeave={mouseLeavesRow}
                >

                    {/* left extension */}
                    <Box
                        display={showSideExtensions ? "unset" : "none"}
                        marginLeft={`-${currentLeftExtensionSize}`}
                        width={currentLeftExtensionSize}
                    >
                    </Box>

                    {/* name */}
                    <Box
                        flexBasis="40%"
                        flexGrow={5}
                        alignSelf="center"
                    >
                        {name}
                    </Box>

                    {/* macros */}
                    <Box
                        flexBasis="9em"
                        flexGrow={1}
                    >
                        <MacrosInfo macros={macros} />
                    </Box>

                    {/* quantity */}
                    <Box
                        flexBasis="5em"
                        textAlign="center"
                        alignSelf="center"
                    >
                        <Editable
                            as="span"
                            defaultValue={String(quantity)}
                            onSubmit={userAcceptsQuantityChange}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <span>g</span>
                    </Box>

                    {/* remove button (right extension) */}
                    <Box
                        display={showSideExtensions ? "unset" : "none"}
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
