import { Ref } from 'Model';


export enum LayerKind {
    REF = "REF LAYER",
    POS = "POSITION LAYER",
}
export interface RefLayer {
    kind: LayerKind.REF;
    ref: Ref;
}
export interface PositionLayer {
    kind: LayerKind.POS;
    pos: number;
}
export type Layer = RefLayer | PositionLayer;


/**
 * For keeping track of the navigation path or UI context.
 * A little like breadcrumbs.
 * 
 * `Onion` objects are immutable
 */
export class Onion {
    
    private readonly layers: Layer[];

    private constructor(layers: Layer[]) {
        this.layers = layers;
    }

    static create(): Onion {
        return new Onion([]);
    }

    withFoodLayer(ref: Ref): Onion {
        const lastAddedLayer = this.layers[0];

        if (lastAddedLayer && lastAddedLayer.kind !== LayerKind.POS) {
            console.error(`@Onion: @withFoodLayer: expected last added layer to be non-existing or of ${LayerKind.POS} kind`, this);
        }

        const newLayer: RefLayer = {
            kind: LayerKind.REF,
            ref,
        };
        return new Onion([newLayer, ...this.layers]);
    }

    withPositionLayer(position: number): Onion {
        const lastAddedLayer = this.layers[0];

        if (lastAddedLayer && lastAddedLayer.kind !== LayerKind.REF) {
            console.error(`@Onion: @withPositionLayer: expected last added layer to be non-existing or of ${LayerKind.REF} kind`, this);
        }

        const newLayer: PositionLayer = {
            kind: LayerKind.POS,
            pos: position,
        };

        return new Onion([newLayer, ...this.layers]);
    }

    layersLeft(): number {
        return this.layers.length;
    }

    peelOneLayer(): [Layer, Onion] {
        if (this.layers.length < 1) {
            throw RangeError(`Cannot peel one layer, there are only none left in this Onion.`);
        }

        const peeledLayers = this.layers.slice(0, 1);
        const remainingOnion = this.layers.slice(1);

        return [peeledLayers[0], new Onion(remainingOnion)];
    }

    peelTwoLayers(): [Layer, Layer, Onion] {
        if (this.layers.length < 2) {
            throw RangeError(`Cannot peel two layers, there are only ` + 
                `${this.layers.length} left in this Onion: ${JSON.stringify(this.layers)}`);
        }

        const peeledLayers = this.layers.slice(0, 2);
        const remainingOnion = this.layers.slice(2);

        return [peeledLayers[0], peeledLayers[1], new Onion(remainingOnion)];
    }

}
