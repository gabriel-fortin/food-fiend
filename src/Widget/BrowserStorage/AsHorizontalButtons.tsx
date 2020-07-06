import React from "react";
import { Button, Stack } from "@chakra-ui/core";


interface Props {
    onSave: () => void;
    onLoad: () => void;
    onClear: () => void;
}

export const AsHorizontalButtons: React.FC<Props> = ({
    onSave,
    onLoad,
    onClear,
}) =>
    <Stack isInline>
        <Button onClick={onSave}>
            Save to browser storage
        </Button>
        <Button onClick={onLoad}>
            Load from browser storage
        </Button>
        <Button onClick={onClear}>
            Clear browser storage
        </Button>
    </Stack>
    ;
