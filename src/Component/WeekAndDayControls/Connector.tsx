import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/core";

import { FoodType, Ingredient, Ref } from "Model";
import { replaceIngredient, State, useAppState } from "Store";
import { WeekEditor } from "Component";
import { FoodLayerProvider, Onion, PositionLayerProvider, useOnion } from "Onion";
import { eqRef, filterOne } from "tools";

import { WeeksAndDaysHorizontally as UI } from "./UI/WeeksAndDaysHorizontally";
import { ContextReceiver } from "Component/ContextTransfer";


interface Props {
    weekRef: Ref | null;
    contextReceiver: ContextReceiver;
}


export const Connector: React.FC<Props> = ({ weekRef: selectedWeekRef, contextReceiver }) => {
    const [editedWeekRef, setEditedWeekRef] = useState<Ref|null>(null);
    const [selectedDayOfWeek_internal, setSelectedDayOfWeek] = useState<number|null>(null);
    const selectedDayOfWeek = 0;

    const {
        isOpen: isWeekEditorOpen,
        onOpen: openWeekEditor,
        onClose: closeWeekEditor } = useDisclosure();
    const state = useAppState();
    const parentOnion = useOnion();
    const dispatch = useDispatch();

    const onWeekEditorClose = (updatedWeekRef: Ref | null) => {
        console.log(`Week And Day:: on Close: updatedWeekRef: `, updatedWeekRef);
        if (updatedWeekRef !== null) {
            dispatch(replaceIngredient(updatedWeekRef, parentOnion));
        }
        closeWeekEditor();
    };

    const mapState = (state: State) => {
        const weekData = state.getAllFoodOfType(FoodType.Week);
        
        return {
            weekData,
            selectedWeek: selectedWeekRef,
            isPrevWeekAvailable: weekData !== [] && selectedWeekRef !== null
                && !eqRef(selectedWeekRef, weekData[0].ref),
            isNextWeekAvailable: weekData !== [] && selectedWeekRef !== null
                && !eqRef(selectedWeekRef, weekData[weekData.length - 1].ref),
            onPrevWeekSelected: () => console.warn(`NOT IMPLEMENTED: on prev week selected`),
            onNextWeekSelected: () => console.warn(`NOT IMPLEMENTED: on next week selected`),
            onWeekAddRequest: () => {
                setEditedWeekRef(null);
                openWeekEditor();
            },
            onWeekEditRequest: () => {
                setEditedWeekRef(selectedWeekRef);
                openWeekEditor();
            },
            onDaySelected: (dayOfWeek: number) => {
                console.log(`Week And Day Controls - on Day selected`);
                
                if (selectedWeekRef === null) {
                    // notifyOnionReceiver(parentOnion);
                    contextReceiver(parentOnion, null);
                    
                    return null;
                }
                
                const choosePositionMatchingDayOfWeek =
                    (ingredient: Ingredient) => ingredient.position === dayOfWeek;
                const week = state.findFood(selectedWeekRef);
                const dayRef = filterOne(week.ingredientsRefs, choosePositionMatchingDayOfWeek).ref;
                
                setSelectedDayOfWeek(dayOfWeek);
    
                contextReceiver(parentOnion.withFoodLayer(selectedWeekRef).withPositionLayer(dayOfWeek), dayRef);

                // notifyOnionReceiver(parentOnion.withFoodLayer(selectedWeekRef).withPositionLayer(dayOfWeek));
                // TODO: I hope the line above can be removed in favour of the following happening:
                //      - on day selection, day number is saved to state
                //      - on the next render, day number is passed to Position Layer Provider
                // Yeah, that should work
            },
            selectedDay: selectedDayOfWeek,
            todayDay: null, // TODO
        };
    };
    
    const mapDispatch = ({
        onWeekSelected: (userSelectedWeekRef: Ref | null) => {
            console.log(`Week And Day Controls - on Week selected`);
            
            // setSelectedWeekRef(userSelectedWeekRef);
            
            // after selecting a week, the day of the week is not known
            // although, maybe we want to keep the day selection unchanged
            // setSelectedDayOfWeek(null);
            
            if (userSelectedWeekRef === null) {
                // dataChangeNotify(null, parentOnion);
                return null;
            }

            const weekData = state.findFood(userSelectedWeekRef);
            const dayRef = weekData.ingredientsRefs[selectedDayOfWeek].ref;
            // contextReceiver(parentOnion.withFoodLayer(userSelectedWeekRef).withPositionLayer(selectedDayOfWeek), dayRef);
            return replaceIngredient(userSelectedWeekRef, parentOnion);
        },
    });

    const dayRef = selectedWeekRef ? state.findFood(selectedWeekRef).ingredientsRefs[0].ref : null;

    const ConnectedUI = connect(mapState, mapDispatch)(UI);
    return (
        <>
            {selectedWeekRef &&
                <FoodLayerProvider food={selectedWeekRef}>
                    <PositionLayerProvider position={selectedDayOfWeek}>
                        <OnionForwarder receiver={contextReceiver} dayRef={dayRef}/>
                    </PositionLayerProvider>
                </FoodLayerProvider>
            }
            <ConnectedUI/>
            <WeekEditor
                weekRef={editedWeekRef}
                isOpen={isWeekEditorOpen}
                onClose={onWeekEditorClose}
            />
        </>
    );
};

const OnionForwarder: React.FC<{ receiver: (o: Onion, r: Ref | null) => void, dayRef: Ref | null }> = ({ receiver, dayRef }) => {
    const onion = useOnion();
    receiver(onion, dayRef);
    return null;
};

