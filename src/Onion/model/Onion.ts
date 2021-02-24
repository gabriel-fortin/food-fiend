import { Ref } from "Model";
import { eqRef } from "tools";

import { Layer, LayerKind, RefLayer, PositionLayer, RootRefLayer } from "./Layer";


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
        const allowedPreviousLayers = [LayerKind.POS, LayerKind.ROOT_REF];
        this.checkPreviousLayer(allowedPreviousLayers, this.withFoodLayer.name);

        const newLayer: RefLayer = {
            kind: LayerKind.REF,
            ref,
        };
        return new Onion([newLayer, ...this.layers]);
    }

    withPositionLayer(position: number): Onion {
        const allowedPreviousLayers = [LayerKind.REF];
        this.checkPreviousLayer(allowedPreviousLayers, this.withPositionLayer.name);

        const newLayer: PositionLayer = {
            kind: LayerKind.POS,
            pos: position,
        };

        return new Onion([newLayer, ...this.layers]);
    }

    withRootRefLayer(ref: Ref | null): Onion {
        const allowedPreviousLayers = [] as LayerKind[];
        this.checkPreviousLayer(allowedPreviousLayers, this.withRootRefLayer.name);

        const newLayer: RootRefLayer = {
            kind: LayerKind.ROOT_REF,
            ref,
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

    toString(): string {
        /* eslint-disable array-callback-return */
        return this.layers.reduce((acc, layer) => {
            switch (layer.kind) {
                case LayerKind.REF:
                    return `${acc}> REF(${layer.ref.id},${layer.ref.ver}) `;
                case LayerKind.POS:
                    return `${acc}> POS(${layer.pos}) `;
                case LayerKind.ROOT_REF:
                    return `${acc}> ROOT_REF `;
            }
        }, "");
        /* eslint-enable array-callback-return */
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


export const eqOnion: (o1: Onion | null, o2: Onion | null) => boolean
    = (o1, o2) => {
        // both same object or both null
        if (o1 === o2) return true;

        // if one is null then the other one isn't
        if (o1 === null || o2 === null) return false;

        const layers1 = (o1 as any).layers as Layer[];
        const layers2 = (o2 as any).layers as Layer[];
        if (layers1.length !== layers2.length) return false;

        for (let i = 0; i < layers1.length; i++) {
            if (layers1[i].kind !== layers2[i].kind) return false;

            switch (layers1[i].kind) {
                case LayerKind.POS:
                    const pos1 = (layers1[i] as PositionLayer).pos;
                    const pos2 = (layers2[i] as PositionLayer).pos;
                    if (pos1 !== pos2) return false;
                    break;
                case LayerKind.REF:
                case LayerKind.ROOT_REF:
                    const ref1 = (layers1[i] as RefLayer | RootRefLayer).ref;
                    const ref2 = (layers2[i] as RefLayer | RootRefLayer).ref;
                    if (!eqRef(ref1, ref2)) return false;
                    break;
                default:
                    throw new Error(`Onion: equals: .layers[${i}]: unrecognised kind : ${layers1[i].kind}`);
            }
        }

        return true;
    };