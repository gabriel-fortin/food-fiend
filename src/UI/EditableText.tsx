import React, { useState } from "react";
import { Editable, EditablePreview, EditableInput, EditableProps } from "@chakra-ui/core";


// TODO: use pattern
//          - don't fire onNewTextAccepted if pattern not matched
//          - visually show when input doesn't match the pattern


interface Props {
    text: string;
    onNewTextAccepted?: (newValue: string) => void;
    pattern?: string;
}

export const EditableText: React.FC<Props & Omit<EditableProps, "children">> = ({
    text,
    onNewTextAccepted = () => {},
    pattern = ".*",
    ...props
}) => {
    const [currrentValue, setCurrentValue] = useState(text);

    return (
        <Editable
            {...props}
            value={currrentValue}
            onChange={setCurrentValue}
            onSubmit={() => onNewTextAccepted(currrentValue)}
        >
            <EditablePreview />
            <EditableInput />
        </Editable>
    );
}
