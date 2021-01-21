import React, { useRef, useState } from "react";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Input }
    from "@chakra-ui/core";
import { useDispatch } from "react-redux";

import { FoodType, WeekExtra, Ref } from "Model";
import { Onion } from "Onion";
import { addCompositeFood } from "Store";


interface Props {
    weekRef: Ref | null;
    isOpen: boolean;
    onClose: (updatedWeek: Ref | null) => void;
}

export const Connector: React.FC<Props> = ({ weekRef, isOpen, onClose: onCloseNotify }) => {
    const leastDestructiveUiActionRef = useRef(null); // needed for AlertDialog
    const [weekName, setWeekName] = useState("");
    const dispatch = useDispatch(); // TODO: spilt this into UI part and connector; then use react-redux to connect to store, instead of manually dispatching

    const saveWeek = () => {
        console.log(`Week Edit Dialog:: weekRef: `, weekRef);

        if (weekRef === null) {
            // TODO: get start date from a field on the form
            const startDate = new Date();
            const onFoodAddedCallback = (foodRef: Ref | null) => {
                onCloseNotify(foodRef);
            };
            dispatch(addCompositeFood(Onion.create(), FoodType.Week, weekName, "week", new WeekExtra(startDate, 7), onFoodAddedCallback));
            // TODO: add new week to store, add days for the week
            // an empty context wil be needed?
        } else {
            alert('todo');
            // TODO: update existing week in store
            // do I need anything in context? probably not, an empty one will do
        }
        // onClose();
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={() => onCloseNotify(null)}
            leastDestructiveRef={leastDestructiveUiActionRef}
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>Edit week</AlertDialogHeader>
                <AlertDialogBody>
                    Hellloo
                    <Input
                        // value={weekName}
                        onChange={(e: React.FormEvent<any> & React.ChangeEvent<HTMLInputElement>) => {
                            setWeekName(e.currentTarget.value);
                        }}
                    />
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        variantColor="teal"
                        onClick={saveWeek}
                    >
                        Save
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
