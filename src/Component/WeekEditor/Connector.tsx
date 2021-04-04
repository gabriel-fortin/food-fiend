import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, FormControl, FormHelperText, FormLabel, Input, Stack }
    from "@chakra-ui/core";

import { useOnion } from "Onion";
import { useTypedSelector } from "Store";

import { saveWeekEditor, cancelWeekEditor } from "./ActionCreators";


export const Connector: React.FC = () => {
    const leastDestructiveUiActionRef = useRef(null); // needed for AlertDialog

    const [weekName, setWeekName] = useState<string>("?");
    const [weekStart, setWeekStart] = useState<string>("?");

    const dispatch = useDispatch(); // TODO: spilt this into UI part and connector; then use react-redux to connect to store, instead of manually dispatching
    const onion = useOnion();

    const isOpen = useTypedSelector(x => x.editWeek.isOpen);
    const data = useTypedSelector(x => x.editWeek.data);

    // on editor open, read data from store
    useEffect(() => {
        if (!isOpen) return;
        if (data === null) throw new Error(`'data' for week editor is null, somehow`);

        setWeekName(data.weekName);
        setWeekStart(data.weekStartDate.toISOString().substring(0, 10));
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleWeekNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setWeekName(e.currentTarget.value);
    };

    const handleWeekStartChange = (e: React.FormEvent<HTMLInputElement>) => {
        setWeekStart(e.currentTarget.value);
    };

    const handleSaving = () => {
        dispatch(saveWeekEditor(onion, weekName, weekStart));
    };

    const handleCancelling = () => {
        dispatch(cancelWeekEditor());
    };

    const handleDialogWantingToClose = () => {
        // nothing
    };

    return (
        <AlertDialog
            isOpen={true} /* there's another return for when isOpen=false */
            onClose={handleDialogWantingToClose}
            leastDestructiveRef={leastDestructiveUiActionRef}
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>Week Editor</AlertDialogHeader>
                <AlertDialogBody>
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel>Week name</FormLabel>
                            <Input
                                value={weekName}
                                onChange={handleWeekNameChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Week start</FormLabel>
                            <Input
                                type="date"
                                value={weekStart}
                                onChange={handleWeekStartChange}
                            />
                            <FormHelperText marginLeft={3}>
                                {new Date(weekStart).toLocaleDateString(["pl"], {weekday: "long"})}
                            </FormHelperText>
                        </FormControl>
                    </Stack>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Stack
                        isInline
                        spacing={5}
                        width="100%"
                    >
                        <Button
                            variantColor="teal"
                            onClick={handleSaving}
                        >
                            Save
                        </Button>
                        <Button
                            variantColor="teal"
                            variant="link"
                            onClick={handleCancelling}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
