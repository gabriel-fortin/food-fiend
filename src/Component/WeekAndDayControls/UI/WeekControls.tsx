import React, { useState } from "react";
import { Box, Button, Heading, PseudoBox, useDisclosure } from "@chakra-ui/core";

import { Ref } from "Model";

import { Props } from "./Props";
import "./pulsing-animation.css";
import { eqRef } from "tools";


export const WeekControls: React.FC<Props> = ({
    weekData,
    selectedWeek,
    isPrevWeekAvailable,
    isNextWeekAvailable,
    onWeekSelected,
    onPrevWeekSelected,
    onNextWeekSelected,
    onWeekAddRequest,
    onWeekEditRequest,
}) => {
    const [isMouseWithinWeekArea, setIsMouseWithinWeekArea] = useState(false);
    const { isOpen: isWeekDropdownOpen, onOpen: onWeekDropdownOpen, onClose: onWeekDropdownClose } = useDisclosure();

    const mouseEntersWeekArea = () => {
        setIsMouseWithinWeekArea(true);
    };
    const mouseLeavesWeekArea = () => {
        setIsMouseWithinWeekArea(false);
    };

    const onDropdownGetsCancelled = () => {
        onWeekDropdownClose();
        setIsMouseWithinWeekArea(false);
    };

    const onDropdownWeekGetsSelected = (weekRef: Ref) => {
        onWeekSelected(weekRef);
        onWeekDropdownClose();
    };

    const noDataAtAll = weekData.length === 0;
    const noWeekSelected = selectedWeek === null;
    const showAdditionalWeekControls = noDataAtAll || noWeekSelected || isMouseWithinWeekArea || isWeekDropdownOpen;

    const MainControls = () => (
        <>
            {/* left arrow - previous week */}
            <Button variant="ghost" leftIcon="arrow-left"
                isDisabled={!isPrevWeekAvailable}
                onClick={onPrevWeekSelected}
                zIndex={15} // has to be 'higher' than expanded controls
                marginLeft={2}>
            </Button>

            {/* week selection popup, absolutely positioned */}
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

            {/* selected week & week selector */}
            <Button
                variant="ghost"
                isDisabled={noDataAtAll}
                onClick={onWeekDropdownOpen}
                minWidth="7em"
                zIndex={15} // has to be 'higher' than expanded controls
                paddingX={4}
            >

                {
                    noDataAtAll
                        ? <Box>– – –</Box>
                        : noWeekSelected
                            ?
                            <Box className="pulsing-animation">
                                select week
                            </Box>
                            :
                            <Heading marginTop={2} marginX={3}>
                                {weekData.filter(x => eqRef(x.ref, selectedWeek))[0].name}
                            </Heading>
                }
            </Button>

            {/* left arrow - next week */}
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
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="add week"
                    leftIcon="add"
                    onClick={onWeekAddRequest}
                    className={noDataAtAll ? "pulsing-animation" : ""}
                >
                    add week
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="edit week"
                    leftIcon="edit"
                    onClick={onWeekEditRequest}
                    isDisabled={noWeekSelected}
                >
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
