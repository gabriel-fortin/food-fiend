import { createContext } from "react";

import { NonInitialisedOnion } from "./model/NonInitilisedOnion";


export const OnionReactContext = createContext(new NonInitialisedOnion());
