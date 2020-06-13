import React, { ReactNode } from "react";
import { Heading, Button } from "@chakra-ui/core";


interface Props {
    title: string;
    onAddMealClick: () => void;
    children: ReactNode[];
}

export const UnstyledMealList: React.FC<Props> = ({ title, onAddMealClick, children }) =>
    <>
        <Heading>
            {title}
        </Heading>
        
        <Button
            size="sm"
            variant="outline"
            variantColor="teal"
            borderStyle="solid 1px black"
            onClick={onAddMealClick}
        >
            + Add meal
        </Button>

        {children}
    </>;
