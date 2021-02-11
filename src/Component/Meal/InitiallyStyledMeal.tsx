import React, { useState } from "react";
import { EditableInput, EditablePreview, Editable, Flex, Box, Link } from "@chakra-ui/core";

import { MacrosInfo } from "Component";
import { Macros } from "Model";

import "./meal-widget.css";


export interface StateProps {
        name: string;
        totalMacros: Macros;
}
export interface DispatchProps {
        onNameChange: (newName: string) => void;
        onRemoveMeal: () => void;
}
export type Props = StateProps & DispatchProps;

export const InitiallyStyledMeal: React.FC<Props> = ({
    name,
    totalMacros,
    onNameChange,
    onRemoveMeal,
    children,
}) => {
    const [hideSideExtensions, setHideSideExtension] = useState(true);
    const mouseEntersHeader =
        () => setHideSideExtension(false);
    const mouseLeavesHeader =
        () => setHideSideExtension(true);

    const currentLeftExtensionSize = "0";
    const currentRightExtensionSize = hideSideExtensions ? "0" : "6.5em";

    const headerBorderRadius = 5;

    return (
    <Box className="meal">
        {/* header section */}
        <Box
            position="relative"
            marginBottom={3}
            paddingRight={currentRightExtensionSize}
            paddingLeft={currentLeftExtensionSize}
            marginRight={`-${currentRightExtensionSize}`}
            marginLeft={`-${currentLeftExtensionSize}`}

            onMouseEnter={mouseEntersHeader}
            onMouseLeave={mouseLeavesHeader}
        >
            {/* on-hover extension */}
            <Flex
                className="meal-extension"

                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={2}
                marginY="auto"
                height="2.8em"  // required for marginY to werk

                justifyContent="flex-end"
                alignItems="center"
            >
                <Link
                    marginRight={4}
                    color="rgba(200, 50, 50, 1)"
                    onClick={onRemoveMeal}
                >
                    remove
                </Link>
            </Flex>

            {/* actual header */}
            <Box
                className="meal-header"
                position="relative"  // fixes z-order w.r.t. the on-hover extension
                borderRadius={headerBorderRadius}
            >
                <Editable
                    marginLeft={4}
                    fontSize="2xl"
                    defaultValue={name}
                    startWithEditView={name === ""}
                    onSubmit={onNameChange}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <div className="meal-macros">
                    {/* TODO: maybe, make Macros Info read its own data */}
                    <MacrosInfo macros={totalMacros} />
                </div>
            </Box>
        </Box>

        {/* body section */}
        {children}
    </Box>
    );
};
