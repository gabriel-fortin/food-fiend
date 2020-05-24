import React, { useState } from "react";
import { Box, Button, Collapse, Flex, IconButton } from "@chakra-ui/core";

import { Onion, PlantOnionGarden } from "Onion";
import { FoodSelector } from "Widget";


interface Props {
    context: Onion,
}

export const FoodAdder: React.FC<Props> = ({ context }) => {
    const [showFoodSelector, setShowFoodSelector] = useState(false);

    return (
        <Box marginX={2} marginY={3}>
            <Collapse isOpen={!showFoodSelector}>
                <Button
                    size="sm"
                    variant="outline"
                    variantColor="pink"
                    borderStyle="solid 1px black"
                    onClick={() => setShowFoodSelector(true)}
                >
                    + Add food
                </Button>
            </Collapse>
            <Collapse isOpen={showFoodSelector}>
                <Flex alignItems="center">
                    <IconButton aria-label="close food selector"
                        variant="outline"
                        icon="close"
                        variantColor="red"
                        size="sm"
                        mr={2}
                        opacity={0.6}
                        _hover={{opacity: 1}}
                        onClick={() => setShowFoodSelector(false)}
                    />
                    <PlantOnionGarden onion={context}>
                        <FoodSelector />
                    </PlantOnionGarden>
                </Flex>
            </Collapse>
        </Box>
    );
};
