import React from "react";
import { useDispatch } from "react-redux";
import { Box, Button } from "@chakra-ui/core";

import { Ref } from "Model";
import { useOnion } from "Onion";
import { changeFoodName } from "Store";
import { formatRef } from "tools";

import { PrintOnion } from "./PrintOnion";


export const DiagnosticDayDisplay: React.FC<{
    dayRef: Ref | null
}> = ({ dayRef }) => {
    const onion = useOnion();
    const dispatch = useDispatch();

    const style = {
        width: "12em",
        display: "inline",
    };

    return (
        <Box margin="3em">
            Debug Day
            <Box>{`day ref: ${dayRef ? formatRef(dayRef) : dayRef}`}</Box>
            <PrintOnion onion={onion} />
            {dayRef !== null &&
                <Button
                    onClick={() => {
                        console.log(`DebugDay: dispatching food name change action; with onion:`, onion);
                        dispatch(changeFoodName("abc", onion.withFoodLayer(dayRef)));
                    }}
                >
                    Fire action
                </Button>
            }
        </Box>
    );
};
