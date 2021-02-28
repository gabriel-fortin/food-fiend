import React from "react";
import { BoxProps, Button, ButtonGroup, IButton, PseudoBoxProps } from "@chakra-ui/core";


interface Props {
    selectedDay: number | null;
    todayDay: number | null;
    startDay?: string;
    weekLength?: number;
    onDaySelected: (day: number) => void;
}


export const HorizontalButtonsUI: React.FC<Props> = ({
    selectedDay,
    todayDay,
    startDay = "Mon",
    weekLength = 7,
    onDaySelected,
}) => {
    const dayShift = daysOfTheWeek.indexOf(startDay);
    if (dayShift < 0) throw new Error(`Start day '${startDay}' not found`);
    const shiftedDays = [...daysOfTheWeek.slice(dayShift), ...daysOfTheWeek.slice(0, dayShift)];
    // by doubling the days, up to 14 days can be handled in a 'week'
    const adjustedDaysOfTheWeek = [...shiftedDays, ...shiftedDays].slice(0, weekLength);

    return (
        <ButtonGroup
            display="flex"
            variant="outline"
            size="md"
            padding={1}
            borderRadius={4}
            color="yellow.600"
            borderColor="grey.100"
        >
            {adjustedDaysOfTheWeek.map((dayName, i) => {
                const buttonProps = {
                    ...dayButtonProps,
                    ...(selectedDay === i) && selectedDayStyle,
                    ...(todayDay === i) && todayStyle,
                };
                return (
                    <Button
                        key={i}
                        {...buttonProps}
                        onClick={() => onDaySelected(i)}
                    >
                        {dayName}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
};

const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dayButtonProps: Omit<IButton & BoxProps, "children"> = {
};

const todayStyle: Omit<IButton & BoxProps & PseudoBoxProps, "children"> = {
    // borderBottomWidth: 4,
    // borderBottomColor: "yellow.600",
    _after: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        // background: "linear-gradient(0deg, rgba(183, 121, 31, 0.6), rgba(183, 121, 31, 0.3) 20%, transparent)",
        background: "linear-gradient(0deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3) 25%, transparent 50%)",
        borderBottomLeftRadius: "md",
        borderBottomRightRadius: "md",
        content: `"TODAY"`,
        fontSize: "60%",
        color: "yellow.800",
    }
};

const selectedDayStyle: Omit<IButton & BoxProps, "children"> = {
    variant: "solid",
};