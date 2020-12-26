import React from "react";
import { BoxProps, Button, ButtonGroup, IButton, PseudoBoxProps } from "@chakra-ui/core";

import { Props } from "./Props";


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
        background: "linear-gradient(0deg, rgba(183, 121, 31, 0.6), rgba(183, 121, 31, 0.3) 20%, transparent)",
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

export const DayControls: React.FC<Props> = ({ selectedDay, todayDay }) => {
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
            {daysOfTheWeek.map((dayName, i) => {
                const buttonProps = {
                    ...dayButtonProps,
                    ...(selectedDay === i) && selectedDayStyle,
                    ...(todayDay === i) && todayStyle,
                };
                return (
                    <Button key={i} {...buttonProps}>
                        {dayName}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
};
