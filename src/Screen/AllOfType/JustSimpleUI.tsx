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

    let ThingToShow: React.ReactNode[];
    switch (showType) {
        case FoodType.Week:
            ThingToShow = [];
            break;

        case FoodType.Day:
            const allDays = getAllOfType(FoodType.Day);
            ThingToShow = allDays.map(ref => (
                <React.Fragment key={ref.id}>
                    <Divider />
                    <MealList dayRef={ref} />
                </React.Fragment>
            ));
            break;
    
        case FoodType.Meal:
            const allMeals = getAllOfType(FoodType.Meal);
            ThingToShow = allMeals.map(ref => (
                <React.Fragment key={ref.id}>
                    <Divider />
                    <Meal mealRef={ref} />
                </React.Fragment>
            ));

            break;
        default:
            ThingToShow = [<Text key="nothing">Nothing selected</Text>];
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
            {
                /* eslint-disable no-mixed-operators */
                ThingToShow.length > 0
                && ThingToShow
                || <Text>There are no items of this type to show</Text>
                /* eslint-enable no-mixed-operators */
            }
        </>
    );
};
