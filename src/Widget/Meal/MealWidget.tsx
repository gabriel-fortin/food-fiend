import React, { useState } from 'react';
import { Box, Button, Collapse, Flex, IconButton, } from '@chakra-ui/core';

import { MacrosInfo } from 'Widget';
import { Macros, Food, Ingredient } from 'Model';
import { IngredientsListWidget } from 'Widget';
import Onion from 'Onion';
import { ConnectedFoodSelectorWidget as FoodSelectorWidget } from 'Widget';

import './meal-widget.css';


interface MWProps {
    name: string;
    totalMacros: Macros;
    data: {ingredient: Ingredient, food: Food}[];
    changeIngredientQuantity: (pos: number, q: string) => void;
    uiEnclosure: Onion;
}
export const MealWidget: React.FC<MWProps> = ({name, totalMacros, data, changeIngredientQuantity, uiEnclosure = Onion.create()}) => {
    // TODO: when IngredientsList becomes more independent, pass 'uiEnclosure' to it
    return (
        <div className="meal">
            <div className="meal-header">
                <h2 className="meal-title">
                    {name}
                </h2>
                <div className="meal-macros">
                    <MacrosInfo macros={totalMacros} />
                </div>
            </div>
            <IngredientsListWidget
                data={data}
                onQuantityChange={(pos: number, q: string) => changeIngredientQuantity(pos, q)}
                onSelectionToggle={undefined}
            />
            <AddFoodWidget context={uiEnclosure} />
        </div>
    );
}


interface AddFoodButtonProps {
    context: Onion,
}
const AddFoodWidget: React.FC<AddFoodButtonProps> = ({ context }) => {
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
                    <FoodSelectorWidget context={context} />
                </Flex>
            </Collapse>
        </Box>
    );
};
