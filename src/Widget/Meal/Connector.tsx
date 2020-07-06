import React from "react";
import { connect, useDispatch } from "react-redux";

import { State, changeFoodName, removeIngredient, setErrorMessage } from "Store";
import { Ref } from "Model";
import { FoodLayerProvider, useOnion } from "Onion";
import { IngredientsList } from "Widget";
import { FoodAdder } from "./FoodAdder";

import { InitiallyStyledMeal as MealUI } from "./InitiallyStyledMeal";
import { Button, Stack, Modal, useDisclosure, ModalContent, ModalOverlay, ModalBody, ModalCloseButton } from "@chakra-ui/core";


interface Props {
    mealRef: Ref;
}

/**
 * Connects Meal to the redux store
 */
export const Connector: React.FC<Props> = ({ mealRef }) => {
    const onion = useOnion();
    
    const dispatch = useDispatch();
    const removeMeal = () => {
        console.log(`Onion: ${JSON.stringify((onion as any).layers, null, 2)}`);
        dispatch(removeIngredient(onion));
    };

    // const onCreateMeal = () => {
    //     // create dialog with Meal
    // };

    return (
    <>
        <FoodLayerProvider food={mealRef}>
            <ConnectedUI mealRef={mealRef}>
                <IngredientsList
                    mealRef={mealRef}
                />
                <Stack
                    isInline
                    alignItems="center"
                >
                    <MealAdder />
                    <FoodAdder />
                </Stack>
            </ConnectedUI>
        </FoodLayerProvider>
    </>
    );
};


const ConnectedUI: React.FC<{ mealRef: Ref }> = ({
    mealRef,
    children,
}) => {
    const onion = useOnion();

    const mapState = (state: State) => {
        const meal = state.findFood(mealRef);
        return {
            name: meal.name,
            totalMacros: meal.macros,
        };
    };
    const mapDispatch = ({
        onNameChange: (newName: string) => {
            console.log(`Connector: on Name Change; newName: ${newName}`);
            
            return changeFoodName(newName, onion);
        },
        onRemoveMeal: () => {
            return setErrorMessage(`@Meal.ConnectedUI: 'onRemoveMeal' NOT IMPLEMENTED`);
        },
    });

    const ConnectedUI = connect(mapState, mapDispatch)(MealUI);
    return (
        <ConnectedUI>
            {children}
        </ConnectedUI>
    );
};


const MealAdder: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const onCreateMealClick = () => {
        dispatch(setErrorMessage(`NOT IMPLEMENTED`));
        // onOpen();
        // TODO: dispatch action to create meal
        // TODO: somehow, make that meal being written to "current dialog" in State
    };

    // TODO: create a ModalLayerPRovider in Onion
    // TODO: in reducers, handle a "modal layer"
    // TODO: in reducers, handle "set current day" scenario by having a "current day layer"

    return (
        <>
            <Button
                onClick={onCreateMealClick}
                size="sm"
                variant="outline"
                variantColor="pink"
            >
                + Create and add new meal
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        Hello
                        {/* <ModalLayerProvider>  */}
                            {/* <Meal mealRef={} /> */}
                        {/* </ModalLayerProvider> */}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
