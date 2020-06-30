import { Ref } from "Model";


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

export type Layer =
    | RefLayer
    | PositionLayer
    ;
