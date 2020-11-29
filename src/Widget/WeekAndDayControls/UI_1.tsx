import React, { useState } from "react";
import { Box, Stack, Heading, Button, ButtonGroup, IButton, BoxProps } from "@chakra-ui/core";


export const UI_1: React.FC = () => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" marginX={5} marginTop={10}>

            <WeekControls />
            <DayControls />

        </Stack>
    );
};

export const WeekControls: React.FC = () => {
    const [isMouseWithinWeekArea, setIsMouseWithinWeekArea] = useState(false);

    const weekTitleClick = () => {
        alert(`show list of weeks`);
    };
    const weekArrowClick = () => {
        alert(`change to next/prev week`);
    };
    const mouseEntersWeekArea = () => {
        setIsMouseWithinWeekArea(true);
    };
    const mouseLeavesWeekArea = () => {
        setIsMouseWithinWeekArea(false);
    };

    const showAdditionalWeekControls = isMouseWithinWeekArea;

    const MainControls = () => (
        <>
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
        </>
    );

    const ExtendedControls = () => (
        <>
            <Box display={showAdditionalWeekControls ? "flex" : "none"}
                justifyContent="space-evenly" color="teal.900"
                position="absolute" width="100%" bottom="-0.4em" paddingBottom="2.8em" paddingTop={2}
                borderRadius={4} boxShadow="0 0 4px 2px rgba(0, 0, 0, 0.1)">
                <Button variant="ghost" size="sm" aria-label="add week" leftIcon="add">add week</Button>
                <Button variant="ghost" size="sm" aria-label="edit week" leftIcon="edit">edit week</Button>
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
