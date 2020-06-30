import { useContext } from "react";

import { Onion } from ".";
import { OnionReactContext } from "./Context";


export const useOnion: () => Onion =
    () => useContext(OnionReactContext);
