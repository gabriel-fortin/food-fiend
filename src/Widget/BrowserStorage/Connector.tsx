import React from "react";

import { saveToBrowserStorage, loadFromBrowserStorage, clearBrowserStorage } from "Store";
import { connect } from "react-redux";

import { AsHorizontalButtons as UI } from "./AsHorizontalButtons";


export const Connector: React.FC = () => {

    const mapDispatch = {
        onSave: saveToBrowserStorage,
        onLoad: loadFromBrowserStorage,
        onClear: clearBrowserStorage,
    };

    const ConnectedUI = connect(undefined, mapDispatch)(UI);

    return <ConnectedUI />
};
