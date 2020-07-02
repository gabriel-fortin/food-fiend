import { Ref } from "Model";


export enum LayerKind {
    REF = "REF LAYER",
    POS = "POSITION LAYER",
    CDAY = "CURRENT DAY",
}

export interface RefLayer {
    kind: LayerKind.REF;
    ref: Ref;
}

export interface PositionLayer {
    kind: LayerKind.POS;
    pos: number;
}

export interface CurrentDayLayer {
    kind: LayerKind.CDAY;
    dayRef: Ref | null;
}

export type Layer =
    | RefLayer
    | PositionLayer
    | CurrentDayLayer
    ;
