import React from "react";
import { Menu, MenuButton, Button, Badge, MenuList, MenuItem } from "@chakra-ui/core";


interface Props {
    // TODO
}

export const BadgeMenu: React.FC<Props> = () => {

    // TODO: use real data coming from props

    // TODO: implement callbacks to notify about change


    return (
        <Menu>
            {/* TODO: maybe "as={Badge}" would work well in here? */}
            <MenuButton
                as={Button}
                marginY="auto"  // to keep vertically centered
                //@ts-ignore
                rightIcon="chevron-down"
                variant="ghost"  // bigger clicking area but visually less intrusive
            >
                <Badge
                    variantColor="purple"
                    variant="solid"
                    paddingLeft={2}
                    paddingRight={5}  // lots of space for the arrow icon
                    marginRight={-6}  // let the down arrow visually fall inside the badge
                >
                    v9
                </Badge>
            </MenuButton>

            <MenuList
                width="3em"
                minW="0.1em"
            >
                <MenuItem
                    minW="1em"
                    minH="10px"
                >
                    v1
                </MenuItem>
                <MenuItem
                    minW="1em"
                    minH="10px"
                >
                    v2
                </MenuItem>
            </MenuList>
        </Menu>
    );
};
