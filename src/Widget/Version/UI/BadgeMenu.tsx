import React from "react";
import { Menu, MenuButton, Button, Badge, MenuList, MenuItem } from "@chakra-ui/core";


interface Item {
    text: string;
    onSelected: () => void;
}

interface Props {
    current: Item;
    options: Item[];
}

export const BadgeMenu: React.FC<Props> = ({ current, options }) => {
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
                    {current.text}
                </Badge>
            </MenuButton>

            <MenuList
                width="3em"
                minW="0.1em"
            >
                {options.map(item =>
                    <MenuItem
                        minW="1em"
                        minH="10px"
                        onClick={item.onSelected}
                    >
                        {item.text}
                    </MenuItem>
                )}
            </MenuList>
        </Menu>
    );
};
