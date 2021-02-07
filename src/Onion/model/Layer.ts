import { Ref } from "Model";


export enum LayerKind {
    REF = "REF LAYER",
    POS = "POSITION LAYER",
    ROOT_REF = "ROOT REF LAYER",
}

export interface RefLayer {
    kind: LayerKind.REF;
    ref: Ref;
}

export interface PositionLayer {
    kind: LayerKind.POS;
    pos: number;
}

export interface RootRefLayer {
    kind: LayerKind.ROOT_REF;
    ref: Ref;
}

export type Layer =
    | RefLayer
    | PositionLayer
    | RootRefLayer
    ;
