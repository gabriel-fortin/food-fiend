import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const UnstyledMealList: React.FC<Props> = ({ children }) =>
    <>
        {children}
    </>;
