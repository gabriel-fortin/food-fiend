import React from "react";

import { setErrorMessage } from "Store";
import { useDispatch } from "react-redux";

import { AsHorizontalButtons as UI } from "./AsHorizontalButtons";


export const Connector: React.FC = () => {
    const dispatch = useDispatch();

    const onSave = () => {
        dispatch(setErrorMessage(`@Browser Storage: on Save: NOT IMPLEMENTED`));
    };
    const onLoad = () => {
        dispatch(setErrorMessage(`@Browser Storage: on Load: NOT IMPLEMENTED`));
    };
    const onClear = () => {
        dispatch(setErrorMessage(`@Browser Storage: on Clear: NOT IMPLEMENTED`));
    };

    return <UI onSave={onSave} onLoad={onLoad} onClear={onClear} />;
};
