import React, { ReactNode } from "react";
import { Heading } from "@chakra-ui/core";

interface Props {
    title: string;
    children: ReactNode;
}

export const UnstyledMealList: React.FC<Props> = ({ title, children }) =>
    <>
        <Heading>
            {title}
        </Heading>
        {children}
    </>;
