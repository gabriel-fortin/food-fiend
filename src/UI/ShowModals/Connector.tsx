import React from "react";
import { connect } from "react-redux";

import { State, setWarningMessage } from "Store";

import { InitiallyStyledModal as ModalUI } from "./InitiallyStyledModal";


export const Connector: React.ComponentType = () => {

    const mapState = (state: State) => {
        return {
            title: "TEST TITLE",
        };
    };
    const mapDispatch = {
        onModalClosing: () => setWarningMessage(`modal closed`),
    };
    const ConnectedUI = connect(mapState, mapDispatch)(ModalUI);

    return (
        <ConnectedUI>
            What should happen if we edit a meal in here? <br />
            Should just the day (from which it was opened) be updated? <br />
            Should all days (containing it) be updated? <br />
            <br />
            There is no universal answer to this question. User input is required.
            That means, we need 'usedBy' to let the user choose what they want to be updated.
        </ConnectedUI>
    );
};
