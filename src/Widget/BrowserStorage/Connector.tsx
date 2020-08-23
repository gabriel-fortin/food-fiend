import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import { saveToBrowserStorage, loadFromBrowserStorage, clearBrowserStorage } from "Store";

import { AsHorizontalButtons as UI } from "./AsHorizontalButtons";


interface Props {
    loadOnMount?: boolean;
}

export const Connector: React.FC<Props> = ({
    loadOnMount = false,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (loadOnMount) {
            dispatch(loadFromBrowserStorage());
        }
    });

    const mapDispatch = {
        onSave: saveToBrowserStorage,
        onLoad: loadFromBrowserStorage,
        onClear: clearBrowserStorage,
    };

    const ConnectedUI = connect(undefined, mapDispatch)(UI);

    return <ConnectedUI />
};
