import React from "react";
import { useToast } from "@chakra-ui/core";
import { connect, useDispatch } from "react-redux";

import { State, setErrorMessage } from "Store";
import { Message } from "Model";

interface Props {
    message: Message | null;
}

const ShowToasts: React.FC<Props> = ({ message }) => {
    const toast = useToast();
    useDispatch()(setErrorMessage(null));

    if (message != null) {
        setTimeout(() => {
            toast({
                position: "bottom-right",
                description: message.text,
                status: message.status,
                duration: 5000,
                isClosable: true,
            });
        }, 0);
    }
    
    return null;
};

const mapState = (state: State) => ({
    message: state.getMessage(),
});

export const ConnectedShowToasts = connect(mapState)(ShowToasts);
