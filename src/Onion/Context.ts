import { createContext, useContext } from "react";

import { Onion } from "./model/Onion";
import { NonFunctionalOnion } from "./model/NonFunctionalOnion";


export const OnionReactContext = createContext(new NonFunctionalOnion());

export const useOnion: () => Onion =
    () => useContext(OnionReactContext);
