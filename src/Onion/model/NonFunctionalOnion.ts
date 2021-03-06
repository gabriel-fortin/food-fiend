import { Ref } from "Model";

import { Onion } from "./Onion";
import { Layer, PlantOnionGarden } from "..";


const errorMessage = () => `The onion was not initialised. ` + 
    `Did you forget to '${PlantOnionGarden.name}'?`;


export class NonFunctionalOnion extends Onion {
    constructor() {
        super([]);
    }

    withFoodLayer(ref: Ref): Onion {
        throw new Error(errorMessage());
    }

    withPositionLayer(position: number): Onion {
        throw new Error(errorMessage());
    }

    withRootRefLayer(ref: Ref | null): Onion {
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
