import React, { useState } from "react";
import { Box, Stack, Heading, Button, ButtonGroup, IButton, BoxProps, useDisclosure, PseudoBox } from "@chakra-ui/core";

import { FoodType, Food, Ref } from "Model";


interface Props {
    weekData: Food[];
    selectedWeek: Ref | null;
    isPrevWeekAvailable: boolean;
    isNextWeekAvailable: boolean;
    onWeekSelected: (w: Ref | null) => void;
    onPrevWeekSelected: () => void;
    onNextWeekSelected: () => void;
    onWeekAdd: () => void;
    onWeekEdit: () => void;
}


export const UI_1: React.FC<Props> = (props) => {
    const { weekData, selectedWeek: selected } = props;

    weekData.forEach((food, i) => {
        if (food.type !== FoodType.Week)
            throw new Error(`Expected "week data" to contain weeks but item ${i} has type '${food.type}'`);
    });
    if (selected !== null && weekData.every(f => f.ref !== selected) )
        throw new Error(`The "selected week" ref [${selected.id}/${selected.ver}] does not exist on the "week data" list`);

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" marginX={5} marginTop={10}>

            <WeekControls {...props} />
            <DayControls />

        </Stack>
    );
};

export const WeekControls: React.FC<Props> = ({
    weekData,
    selectedWeek,
    isPrevWeekAvailable,
    isNextWeekAvailable,
    onWeekSelected,
    onPrevWeekSelected,
    onNextWeekSelected,
    onWeekAdd,
    onWeekEdit,
}) => {
    const [isMouseWithinWeekArea, setIsMouseWithinWeekArea] = useState(false);
    const { isOpen: isWeekDropdownOpen, onOpen: onWeekDropdownOpen, onClose: onWeekDropdownClose } = useDisclosure();

    const mouseEntersWeekArea = () => {
        console.log(`mouse ENTERS week area`);
        console.log(`   set is mouse within week area -> true`);
        setIsMouseWithinWeekArea(true);
    };
    const mouseLeavesWeekArea = () => {
        console.log(`mouse LEAVES week area`);
        console.log(`   set is mouse within week area -> false`);
        setIsMouseWithinWeekArea(false);
    };

    const onDropdownGetsCancelled = () => {
        console.log(`back-drop: onclick`);
        onWeekDropdownClose();
        setIsMouseWithinWeekArea(false);
    };

    const onDropdownWeekGetsSelected = (weekRef: Ref) => {
        onWeekSelected(weekRef);
        onWeekDropdownClose();
    };

    const onWeekGetsAdded = () => {
        onWeekAdd();
        // TODO
    };

    const onWeekGetsEdited = () => {
        onWeekEdit();
        // TODO
    };

    const noWeekSelected = selectedWeek === null;
    const showAdditionalWeekControls = isMouseWithinWeekArea || noWeekSelected || isWeekDropdownOpen;

    const MainControls = () => (
        <>
            <Button variant="ghost" leftIcon="arrow-left"
                isDisabled={!isPrevWeekAvailable}
                onClick={onPrevWeekSelected}
                zIndex={15} // has to be 'higher' than expanded controls
                marginLeft={2}>
            </Button>

            {/* week selection popup */}
            <Box // 'relative' container for nested 'absolute' child
                display={isWeekDropdownOpen ? "inline" : "none"}
                position="relative"
                zIndex={4000}
            >
                <Box
                    position="fixed"
                    backgroundColor="transparent"
                    onClick={onDropdownGetsCancelled}
                    left={0}
                    right={0}
                    top={0}
                    bottom={0}
                ></Box>
                <Box
                    position="absolute"
                    left={4} // that's the padding of the button which triggers this
                    backgroundColor="gray.200"
                    borderRadius="md"
                    shadow="lg"
                >
                    {weekData.map(food =>
                        <PseudoBox
                            key={food.ref.id}
                            onClick={() => onDropdownWeekGetsSelected(food.ref)}
                            width="max-content"
                            fontSize="xl"
                            marginY={1}
                            paddingY={1}
                            paddingX={5}
                            color="teal.500"
                            _hover={{
                                color: "teal.600",
                                backgroundColor: "orange.100",
                            }}
                            cursor="pointer"
                        >
                            {food.name}
                        </PseudoBox>
                    )}
                </Box>
            </Box>

            <Button
                variant="ghost"
                onClick={onWeekDropdownOpen}
                minWidth="7em"
                zIndex={15} // has to be 'higher' than expanded controls
                paddingX={4}>

                {noWeekSelected
                    ? <Box color="red.500">please select</Box>
                    : <Heading marginTop={2} marginX={3}>
                        {weekData.filter(x => x.ref === selectedWeek)[0].name}
                    </Heading>
                }

            </Button>

            <Button variant="ghost" rightIcon="arrow-right"
                isDisabled={!isNextWeekAvailable}
                onClick={onNextWeekSelected}
                zIndex={15} // has to be 'higher' than expanded controls
                marginRight={2}>
            </Button>
        </>
    );

    const ExtendedControls = () => (
        <>
            <Box display={showAdditionalWeekControls ? "flex" : "none"}
                    justifyContent="space-evenly" color="teal.800"
                    position="absolute" width="100%" bottom="-0.4em" paddingBottom="2.8em" paddingTop={2}
                    borderRadius="lg"
                    // boxShadow="0 0 4px 2px rgba(0, 0, 0, 0.1)"
                    shadow="sm"
                    >
                <Button variant="ghost" size="sm" aria-label="add week" leftIcon="add" onClick={onWeekGetsAdded}>
                    add week
                </Button>
                <Button variant="ghost" size="sm" aria-label="edit week" leftIcon="edit" onClick={onWeekGetsEdited} isDisabled={noWeekSelected}>
                    edit week
                </Button>
            </Box>
        </>
    );

    return (
        <Box color="teal.400"
            position="relative" // allows the expanded controls to be absolutely-positioned
            onMouseEnter={mouseEntersWeekArea} onMouseLeave={mouseLeavesWeekArea}>

            <MainControls />
            <ExtendedControls />

        </Box>
    );
};

export const DayControls: React.FC = () => {
    const today = { borderBottomWidth: 4, borderTopWidth: 4 };
    const selectedDay = { variant: "solid" as IButton["variant"] };
    const dayButtonProps: Omit<IButton & BoxProps, "children"> = {};

    return (
        <ButtonGroup d="flex" variant="outline" color="yellow.600" borderColor="grey.100" padding={1} borderRadius={4} size="md">
            <Button {...dayButtonProps}>Mon</Button>
            <Button {...dayButtonProps} {...selectedDay}>Tue</Button>
            <Button {...dayButtonProps}>Wed</Button>
            <Button {...dayButtonProps}>Thu</Button>
            <Button {...dayButtonProps}>Fri</Button>
            <Button {...dayButtonProps} {...today}>Sat</Button>
            <Button {...dayButtonProps}>Sun</Button>
        </ButtonGroup>
    );
};
