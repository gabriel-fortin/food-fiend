import { Layer, PositionLayer, RefLayer, RootRefLayer } from "./model/Layer";


export function assertRefLayer(layer: Layer): RefLayer {
    if (layer.kind === "REF LAYER") return layer;
    throw new Error(`Expected a Ref Layer but found a layer of kind '${layer.kind}'`);
};

export function assertPositionLayer(layer: Layer): PositionLayer {
    if (layer.kind === "POSITION LAYER") return layer;
    throw new Error(`Expected a Position Layer but found a layer of kind '${layer.kind}'`);
};

export function assertRootRefLayer(layer: Layer): RootRefLayer {
    if (layer.kind === "ROOT REF LAYER") return layer;
    throw new Error(`Expected a Position Layer but found a layer of kind '${layer.kind}'`);
}
