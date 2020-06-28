import React, { useState } from "react";
import { Select, Divider, Text, Flex, Input, InputGroup, InputLeftAddon } from "@chakra-ui/core";

import { FoodType, Ref } from "Model";
import { MealList, Meal } from "Widget";


interface Props {
    getAllOfType: (ft: FoodType) => Ref[];
}
export const JustSimpleUI: React.FC<Props> = ({ getAllOfType }) => {
    const [showType, setShowType] = useState<FoodType | null>(null);

    const selectTypeOfItemsToShow = setShowType;

    let ThingToShow: React.ReactElement[];
    switch (showType) {
        case FoodType.Week:
            ThingToShow = [];
            break;

        case FoodType.Day:
            const allDays = getAllOfType(FoodType.Day);
            ThingToShow = allDays.map(ref => (
                <>
                    <Divider />
                    <MealList dayRef={ref} />
                </>
            ));
            break;
    
        case FoodType.Meal:
            const allMeals = getAllOfType(FoodType.Meal);
            ThingToShow = allMeals.map(ref => (
                <>
                    <Divider />
                    <Meal mealRef={ref} />
                </>
            ));

            break;
        default:
            ThingToShow = [<Text>Nothing selected</Text>];
            break;
    }

    return (
        <>
            <Flex
                flexDirection="row"
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Select
                    flexShrink={0}
                    width="max-context"
                    size="sm"
                    marginX="1.5em"
                    placeholder="what to show?"
                    onChange={e => selectTypeOfItemsToShow(e.currentTarget.value as FoodType)}
                >
                    <option value={FoodType.Week}>Weeks</option>
                    <option value={FoodType.Day}>Days</option>
                    <option value={FoodType.Meal}>Meals</option>
                </Select>
                <InputGroup size="sm" >
                    <InputLeftAddon children="filter:" />
                    <Input placeholder="(doesn't work yet)" />
                </InputGroup>
            </Flex>
            {ThingToShow.length > 0
                && ThingToShow
                || <Text>There are no items of this type to show</Text>
            }
        </>
    );
};
