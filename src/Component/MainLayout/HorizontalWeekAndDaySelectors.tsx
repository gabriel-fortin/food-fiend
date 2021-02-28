import React from "react";
import { Stack } from "@chakra-ui/core";


export const HorizontalTopBar: React.FC = ({ children }) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginX={5}
            marginTop={10}
        >

            {children}

        </Stack>
    );
};
