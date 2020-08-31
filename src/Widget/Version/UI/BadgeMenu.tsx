import React from "react";
import { Menu, MenuButton, Button, Badge, MenuList, MenuItem } from "@chakra-ui/core";


interface Props {
    // TODO
}

export const BadgeMenu: React.FC<Props> = () => {

    // TODO: use real data coming from props

    // TODO: implement callbacks to notify about change

    const currentText = "v9";
    const itemsTexts = ["v1", "v2"];

    return (
        <Menu>
            <MenuButton
                as={Button}
                marginY="auto"  // to keep vertically centered
                //@ts-ignore
                rightIcon="chevron-down"
                variant="ghost"  // requires 'as={Button}'; provides bigger clicking area while visually being less intrusive
            >
                <Badge
                    variantColor="purple"
                    variant="solid"
                    paddingLeft={2}
                    paddingRight={5}  // lots of space for the chevron
                    marginRight={-6}  // let the down arrow visually fall inside the badge
                >
                    {currentText}
                </Badge>
            </MenuButton>

            <MenuList
                width="3em"
                minW="0.1em"
            >
                {itemsTexts.map(item =>
                    <MenuItem
                        minW="1em"
                        minH="10px"
                    >
                        {item}
                    </MenuItem>
                )}
            </MenuList>
        </Menu>
    );
};
