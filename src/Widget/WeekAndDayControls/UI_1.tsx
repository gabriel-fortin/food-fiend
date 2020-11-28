import React, { useRef, useState } from "react";
import { Box, Stack, Heading, IconButton, Button, ButtonGroup, IButton, BoxProps, Divider } from "@chakra-ui/core";

import { Meal } from "Widget";
import { Ref } from "Model";


export const UI_1: React.FC = () => {
    return (
        <>
            <Box height="50px"/>
            <MultiLineHeaderSection />
            <Box padding={2}>
                <ShowDay />
            </Box>
            
            <Box height="200px"/>
            <SingleLineHeaderSection />
            <Box padding={2}>
                <ShowDay />
            </Box>
            
            <Box height="200px"/>
            <ThirdAttemptHeaderSection />
            <Box padding={2}>
                <ShowDay />
            </Box>
            
            <Box height="200px"/>
        </>
    );
};

export const MultiLineHeaderSection: React.FC = () => {
    const today = "outline";
    const selectedDay="solid";
    const dayButton: Omit<IButton & BoxProps, "children"> = {
        isFullWidth: true,
    };

    return (
        <>
            <Stack m={5}>
                <Button variant="ghost" rightIcon="chevron-down" color="teal.400" marginX="auto" size="lg">
                    <Heading marginTop={2}>
                        Week 323
                    </Heading>
                </Button>

                <ButtonGroup d="flex" variant="ghost" color="yellow.600" marginX={4}>
                    <Button {...dayButton} variant={selectedDay}>Mon</Button>
                    <Button {...dayButton} variant={today}>Tue</Button>
                    <Button {...dayButton}>Wed</Button>
                    <Button {...dayButton}>Thu</Button>
                    <Button {...dayButton}>Fri</Button>
                    <Button {...dayButton}>Sat</Button>
                    <Button {...dayButton}>Sun</Button>
                </ButtonGroup>

            </Stack>
            <Divider />
        </>
    );
};

export const SingleLineHeaderSection: React.FC = () => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const today = "outline";
    const selectedDay="solid";
    const dayButton: Omit<IButton & BoxProps, "children"> = {
        isFullWidth: true,
    };
    const weekTitleClick = () => {
        if (selectRef.current)
            selectRef.current.click();
    };

    return (
        <>
            <Stack m={5} direction="row" alignItems="center">
                <IconButton variant="ghost" variantColor="teal" aria-label="add week" icon="add" />
                <IconButton variant="ghost" size="lg" variantColor="teal" aria-label="edit week" icon="edit" marginLeft={8} />

                <Button variant="outline" rightIcon="chevron-down" color="teal.400" marginLeft={0} paddingLeft={12} paddingRight={16} paddingTop={2} size="lg" onClick={weekTitleClick}>
                    <Heading marginTop={0} marginX={3}>
                        Week 323
                    </Heading>
                </Button>

                <ButtonGroup d="flex" variant="ghost" color="yellow.600" marginX={16} width="100%">
                    <Button {...dayButton} variant={selectedDay}>Mon</Button>
                    <Button {...dayButton} variant={today}>Tue</Button>
                    <Button {...dayButton}>Wed</Button>
                    <Button {...dayButton}>Thu</Button>
                    <Button {...dayButton}>Fri</Button>
                    <Button {...dayButton}>Sat</Button>
                    <Button {...dayButton}>Sun</Button>
                </ButtonGroup>

            </Stack>
            <Divider />
        </>
    );
};

export const ThirdAttemptHeaderSection: React.FC = () => {
    const [isMouseWithinWeekArea, setIsMouseWithinWeekArea] = useState(false);

    const today = { borderBottomWidth: 4, borderTopWidth: 4 };
    const selectedDay = { variant: "solid" as IButton["variant"] };
    const dayButton: Omit<IButton & BoxProps, "children"> = {
        // isFullWidth: true,
    };

    const weekTitleClick = () => {
        alert(`show list of weeks`);
    };
    const weekArrowClick = (event: React.MouseEvent<any, MouseEvent>) => {
        event.stopPropagation();
        alert(`change to next/prev week`);
    };
    const mouseEntersWeekArea = () => {
        setIsMouseWithinWeekArea(true);
    };
    const mouseLeavesWeekArea = () => {
        setIsMouseWithinWeekArea(false);
    };

    const showAdditionalWeekControls = isMouseWithinWeekArea;

    return (
        <>
            <Stack m={5} direction="row" alignItems="center" justifyContent="space-between">

                <Box color="teal.400"
                        position="relative" // allows the expanded controls to be absolutely-positioned
                        onMouseEnter={mouseEntersWeekArea} onMouseLeave={mouseLeavesWeekArea}>

                    {/* main controls */}
                    <Button variant="ghost" leftIcon="arrow-left"
                            onClick={weekArrowClick}
                            zIndex={15} // has to be 'higher' than expanded controls
                            marginLeft={2}>
                    </Button>
                    <Button variant="ghost"
                            onClick={weekTitleClick}
                            zIndex={15} // has to be 'higher' than expanded controls
                            paddingX={1}>
                        <Heading marginTop={2} marginX={3}>
                            Week 323
                        </Heading>
                    </Button>
                    <Button variant="ghost" rightIcon="arrow-right"
                            onClick={weekArrowClick}
                            zIndex={15} // has to be 'higher' than expanded controls
                            marginRight={2}>
                    </Button>

                    {/* extended controls */}
                    <Box display={showAdditionalWeekControls ? "flex" : "none"}
                            justifyContent="space-evenly" color="teal.900"
                            position="absolute" width="100%" bottom="-0.4em" paddingBottom="2.8em" paddingTop={2}
                            borderRadius={4} boxShadow="0 0 4px 2px rgba(0, 0, 0, 0.1)">
                        <Button variant="ghost" size="sm" aria-label="add week" leftIcon="add">add week</Button>
                        <Button variant="ghost" size="sm" aria-label="edit week" leftIcon="edit">edit week</Button>
                    </Box>

                </Box>

                <ButtonGroup d="flex" variant="outline" color="yellow.600"  borderColor="grey.100" padding={1} borderRadius={4} size="md">
                    <Button {...dayButton}>Mon</Button>
                    <Button {...dayButton} {...selectedDay}>Tue</Button>
                    <Button {...dayButton}>Wed</Button>
                    <Button {...dayButton}>Thu</Button>
                    <Button {...dayButton}>Fri</Button>
                    <Button {...dayButton} {...today}>Sat</Button>
                    <Button {...dayButton}>Sun</Button>
                </ButtonGroup>

            </Stack>
            <Divider />
        </>
    );
};

export const ShowDay: React.FC = () => {
    return (
        <>
            <Box paddingLeft={4}>
                <Meal mealRef={new Ref(6789, 1)} />
            </Box>
        </>
    );
};
