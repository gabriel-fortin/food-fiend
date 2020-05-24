import { Ref } from "Model";

import { Onion, Layer } from "./Onion";
import { PlantOnionGarden } from "./Hooks";


const errorMessage = () => `The onion was not initialised. ` + 
    `Did you forget to '${PlantOnionGarden.name}'?`;


export class NonInitialisedOnion extends Onion {
    constructor() {
        super([]);
    }

    withFoodLayer(ref: Ref): Onion {
        throw new Error(errorMessage());
    }

    withPositionLayer(position: number): Onion {
        throw new Error(errorMessage());
    }

    layersLeft(): number {
        throw new Error(errorMessage());
    }

    peelOneLayer(): [Layer, Onion] {
        throw new Error(errorMessage());
    }

    peelTwoLayers(): [Layer, Layer, Onion] {
        throw new Error(errorMessage());
    }
}
