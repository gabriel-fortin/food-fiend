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
    <Stack isInline padding={1}>
        <Button onClick={onSave} variant="outline">
            Save to browser storage
        </Button>
        <Button onClick={onLoad} variant="outline">
            Load from browser storage
        </Button>
        <Button onClick={onClear} variant="outline">
            Clear browser storage
        </Button>
    </Stack>
    ;
