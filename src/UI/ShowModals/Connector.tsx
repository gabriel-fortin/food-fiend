import React from "react";
import { connect } from "react-redux";

import { setInfoMessage } from "Store";

import { InitiallyStyledModal as ModalUI } from "./InitiallyStyledModal";


export const Connector: React.ComponentType = () => {
    const mapDispatch = {
        onModalClosing: () => setInfoMessage("Connector: Modal CLOSE"),
    };
    const ConnectedUI = connect(null, mapDispatch)(ModalUI);
    return <ConnectedUI />;
};
