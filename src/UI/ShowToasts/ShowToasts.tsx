import React from "react";
import { useToast } from "@chakra-ui/core";
import { connect, useDispatch } from "react-redux";
import { State, setErrorMessage } from "Store";

interface Props {
    errorMessage: string | null;
}

const ShowToasts: React.FC<Props> = ({ errorMessage }) => {
    const toast = useToast();
    useDispatch()(setErrorMessage(null));

    if (errorMessage != null) {
        setTimeout(() => {
            toast({
                position: "bottom-right",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }, 0);
    }
    
    return null;
};

const mapState = (state: State) => ({
    errorMessage: state.getErrorMessage(),
});

export const ConnectedShowToasts = connect(mapState)(ShowToasts);
