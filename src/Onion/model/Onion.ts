import { Ref } from "Model";

import { Layer, LayerKind, RefLayer, PositionLayer } from "./Layer";


/**
 * For keeping track of the navigation path or UI context.
 * A little like breadcrumbs.
 * 
 * `Onion` objects are immutable
 */
export class Onion {
    
    private readonly layers: Layer[];

    protected constructor(layers: Layer[]) {
        this.layers = layers;
    }

    static create(): Onion {
        return new Onion([]);
    }

    withFoodLayer(ref: Ref): Onion {
        const allowedPreviousLayers = [LayerKind.POS];
        this.checkPreviousLayer(allowedPreviousLayers, this.withFoodLayer.name)

        const newLayer: RefLayer = {
            kind: LayerKind.REF,
            ref,
        };
        return new Onion([newLayer, ...this.layers]);
    }

    withPositionLayer(position: number): Onion {
        const allowedPreviousLayers = [LayerKind.REF];
        this.checkPreviousLayer(allowedPreviousLayers, this.withPositionLayer.name)

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

    private checkPreviousLayer(allowedPreviousLayers: LayerKind[], tag: string = "<some method>") {
        const hasUnexpectedKind =
            (layer: Layer) =>
                layer && !allowedPreviousLayers.includes(layer.kind);

        const lastAddedLayer = this.layers[0];

        if (hasUnexpectedKind(lastAddedLayer)) {
            console.error(`@Onion: @${tag}: expected last added layer's kind to ` +
                `be non-existing or one of ${JSON.stringify(allowedPreviousLayers)}.` +
                ` Current layers:`, this.layers);
        }
    }

}
