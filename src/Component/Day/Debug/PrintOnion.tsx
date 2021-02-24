import React from "react";
import { Box, Grid } from "@chakra-ui/core";

import { Onion, LayerKind, Layer } from "Onion";
import { formatRef } from "tools";

export const PrintOnion: React.FC<{ onion: Onion }> = ({ onion }) => {
    const onionInBits = ((onion as any).layers as Layer[])
        .map(layer => {
            switch (layer.kind) {
                case LayerKind.ROOT_REF: return { type: layer.kind, text: formatRef(layer.ref) };
                case LayerKind.REF: return { type: layer.kind, text: formatRef(layer.ref) };
                case LayerKind.POS: return { type: layer.kind, text: layer.pos };
                default: throw new Error(`The layer kind '${(layer as Layer).kind}' is not handled`);
            }
        });

    const style = {
        width: "12em",
        display: "inline",
    };
    
    return (
        <>
            <Box>Onion (size={onion.layersLeft()}):</Box>
            <Grid templateColumns="12em 3em 8em">
                {onionInBits.map(x =>
                    <React.Fragment key={x.type + x.text}>
                        <Box style={style}>{x.type}</Box>
                        <Box> =&gt; </Box>
                        <Box>{x.text}</Box>
                    </React.Fragment>
                )}
            </Grid>
        </>
    );
};
