import React, { ReactNode } from "react";
import { Heading, Button } from "@chakra-ui/core";

interface Props {
    title: string;
    children: ReactNode[];
}

export const UnstyledMealList: React.FC<Props> = ({ title, children }) =>
    <>
        <Heading>
            {title}
        </Heading>
        
        <Button
            size="sm"
            variant="outline"
            variantColor="pink"
            borderStyle="solid 1px black"
            onClick={() => console.error(`NOT IMPLEMENTED: onClick in UnstyledMealLsit`)}
        >
            + Add meal
        </Button>

        {children}
    </>;
