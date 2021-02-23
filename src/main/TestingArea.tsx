/* eslint-disable */
import React, { ReactElement, useState } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect, useDispatch } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ThemeProvider, CSSReset, Box, Grid, Button } from '@chakra-ui/core';

import { State, storeReducer, importData, AppStateProvider, changeFoodName, replaceIngredient, useTypedSelector } from 'Store'
// import OldFoodType from '../data/FoodType';
import initialData from '../data/initialData';

import { MacrosBar, MacrosInfo, WeekAndDayControls, Meal, StarGate } from 'Component';
// import { IngredientsListWidget as IngredientsDisplay } from 'Widget';
// import { FoodSelector } from 'Widget';
import { Layer, LayerKind, Onion, PlantOnionGarden, RootRefLayerProvider, useOnion } from 'Onion';
import { Ingredient, Food, FoodType, Ref } from 'Model';
import { AllOfType } from "Screen";
import { ShowToasts, ShowModals } from 'UI';
import { BrowserStorage } from 'Component/BrowserStorage';
import { formatRef } from 'tools';
import ReactDOM from 'react-dom';


function createEmptyStore() {
    // return createStore<State, Action, any, any>(storeReducer, new State());
    return createStore(storeReducer, State.create(), applyMiddleware(thunkMiddleware));
}

export default function TestingArea() {
    // return showOfMacrosBar();
    // return showOfMacrosInfo();
    // return ShowOfTableDisplay();
    // return FigureOutReduxAndCreatingMeals();
    // return DisplayDataFromStore();
    // return FoodSelection();
    // return DisplayMeal();
    // return DisplayAllMeals();
    return DisplayDay();
}

// eslint-disable-next-line
function DisplayDay() {
    // meal to test on
    const lunch = createMeal(12345, 1,
        [initialData[9], initialData[774], initialData[85]], "Lunch");
    const obiad = createMeal(6789, 1,
        [initialData[39], initialData[227], initialData[597]], "Obiad");
    const tempDay1 = createDay(666, [lunch, obiad], "test day 1");
    const tempDay2 = createDay(667, [obiad], "test day 2");
    const tempWeek1 = { ...createDay(111, [tempDay1], "Week 61"), type: FoodType.Week as FoodType,
            ingredientsRefs: [new Ingredient(tempDay2.ref, 0, 1, null)] };
    const tempWeek2 = { ...createDay(112, [tempDay1], "Week 62"), type: FoodType.Week as FoodType,
            ingredientsRefs: [new Ingredient(tempDay1.ref, 0, 1, null)] };
    // IMPORTANT
    // normally we should update the 'usedBy' field of each used ingredient


    // prepare store
    const store = createEmptyStore();
    store.dispatch(importData(initialData));
    store.dispatch(importData([lunch]));
    store.dispatch(importData([obiad]));
    store.dispatch(importData([tempDay1]));
    store.dispatch(importData([tempDay2]));
    store.dispatch(importData([tempWeek1]));
    store.dispatch(importData([tempWeek2]));

    return (
        <ThemeProvider>
            <CSSReset />
            <AppStateProvider _debug__injectStore={store}>
                <ShowToasts />
                <BrowserStorage loadOnMount />
                {/* <ShowModals /> */}
                <PlantOnionGarden>
                    <ControlWeekFromState>
                        {(weekRef, onWeekChange) =>
                            <StarGate.Provider>
                                <WeekAndDayControls weekRef={weekRef} onWeekChanged={onWeekChange}>
                                    {dayRef => <StarGate.In transport={dayRef} />}
                                </WeekAndDayControls>
                                <StarGate.Out>
                                    {ref =>
                                        <DebugDay dayRef={ref} />
                                    }
                                </StarGate.Out>
                            </StarGate.Provider>
                        }
                    </ControlWeekFromState>
                    <RootRefFeeder_connected>
                        {(rootRef) =>
                            <>
                                <WrappedWeekAndDayControls weekRef={rootRef}>
                                    {(dayRef) =>
                                        <PortalIn portalOutId="portalOut">
                                            <DebugDay dayRef={dayRef} />
                                        </PortalIn>
                                    }
                                </WrappedWeekAndDayControls>

                                <div id="portalOut">
                                </div>
                            </>
                        }
                    </RootRefFeeder_connected>
                </PlantOnionGarden>
            </AppStateProvider>
        </ThemeProvider>
    );
}

interface WeekControllable {
    children: (
        weekRef: Ref | null,
        onWeekChange: (w: Ref) => void,
    ) => ReactElement;
}
const ControlWeekFromState: React.FC<WeekControllable> = ({ children }) => {
    const onion = useOnion();
    const rootRef = useTypedSelector(s => s.getRootRef());
    const dispatch = useDispatch();
    
    const onWeekChange = (newWeekRef: Ref) => {
        dispatch(replaceIngredient(newWeekRef, onion.withRootRefLayer(newWeekRef)));
    };

    return (
        <RootRefLayerProvider food={rootRef}>
            {children(rootRef, onWeekChange)}
        </RootRefLayerProvider>
    );
};

const WrappedWeekAndDayControls: React.FC<{
    weekRef: Ref | null,
    // onWeekChanged: (w: Ref) => void,
    children: (dayRef: Ref) => ReactElement,
}> = ({ weekRef, children }) => {
    const dispatch = useDispatch();
    const onion = useOnion();

                // Now, that I have the 'onWeekChanged' callback
                // I could save it in local state and ditch:
                // - Root Ref Feeder
                // - root ref in state

    return (
        <WeekAndDayControls
            weekRef={weekRef}
            onWeekChanged={(newWeekRef) => {
                dispatch(replaceIngredient(newWeekRef, onion));
            }}
        >
            {children}
        </WeekAndDayControls>
    );
};

const PortalIn: React.FC<{ portalOutId: string, children?: React.ReactNode }> = ({ portalOutId, children}) => {
    const portalOutElement = document.getElementById(portalOutId);
    if (portalOutElement === null) {
        throw new Error(`Could not find the out portal's node; the id was '${portalOutId}'`);
    }
    return ReactDOM.createPortal(children, portalOutElement);
};

const DebugDay: React.FC<{ dayRef: Ref | null }> = ({ dayRef }) => {
    const onion = useOnion();
    const dispatch = useDispatch();

    const style = {
        width: "12em",
        display: "inline",
    };

    return (
        <Box margin="3em">
            Debug Day
            <Box>{`day ref: ${dayRef ? formatRef(dayRef) : dayRef}`}</Box>
            <PrintOnion onion={onion} />
            {dayRef !== null &&
                <Button
                    onClick={() => {
                        console.log(`DebugDay: dispatching food name change action; with onion:`, onion);
                        dispatch(changeFoodName("abc", onion.withFoodLayer(dayRef)));
                    }}
                >
                    Fire action
                </Button>
            }
        </Box>
    );
};

const PrintOnion: React.FC<{ onion: Onion }> = ({ onion }) => {
    const onionInBits = ((onion as any).layers as Layer[])
        .map(layer => {
            switch (layer.kind) {
                case LayerKind.ROOT_REF: return { type: layer.kind, text: formatRef(layer.ref) };
                case LayerKind.REF: return { type: layer.kind, text: formatRef(layer.ref) };
                case LayerKind.POS: return { type: layer.kind, text: layer.pos };
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

// this component is re-rendered on every state change
// would be nice if it re-rendered its children only when root ref changes
        // maybe just change the param from 'state' to 'rootRef'? will 'connect' do the trick?
const RootRefFeeder: React.FC<{state: State, children: ((ref: Ref | null) => ReactElement)}> = ({ state, children }) => {
    // const state = useAppState();

    // probably I need to connect instead of using useAppState


    console.log(`Root Ref Feeder: state:`, state);
    const rootRef = state.getRootRef();

    return (
        <RootRefLayerProvider food={rootRef}>
            {children(rootRef)}
        </RootRefLayerProvider>
    );
};

const RootRefFeeder_connected = connect((state: State) => ({
    state: state,
}))(RootRefFeeder);


function createDay(id: number, meals: Food[], title: string) {
    let day = createMeal(id, -14, meals, title);
    day.type = FoodType.Day;  // items of this type are used at most once
                // 'usedBy' will have one element at most
    return day;
}

/*
// eslint-disable-next-line
function DisplayAllMeals() {
    // meal to test on
    const temporaryMeal1 = createMeal(12345, 1,
        [initialData[9], initialData[774], initialData[85]], "Lunch");
    const temporaryMeal2 = createMeal(6789, 1,
        [initialData[39], initialData[227], initialData[597]], "Obiad");
    // IMPORTANT
    // normally we should update the 'usedBy' field of each used ingredient

    // prepare store
    const store = createEmptyStore();
    store.dispatch(importData(initialData));
    store.dispatch(importData([temporaryMeal1]));
    store.dispatch(importData([temporaryMeal2]));

    // store.dispatch(changeIngredientQuantity(12345, 1, 0, 400));  // this doesn't work since some changes were made

    const mapStateToProps = (state: State) => ({
        meals: getAllMeals(store.getState()),
    });
    const GoGoMealListWidget = connect(mapStateToProps)(MealListWidget);

    return (
        <Provider store={store}>
            <TestingFrame>
                {/* <GoGoMealListWidget />  // this doesn't work since some changes were made * /}
            </TestingFrame>
        </Provider>
    );
}
*/

// eslint-disable-next-line
function DisplayMeal() {
    // meal to test on
    const mealIngredients = [
        initialData[9],
        initialData[774],
        initialData[85],
    ];
    const mealId = 12345;
    const mealVersion = 1;
    const temporaryMeal = createMeal(mealId, mealVersion, mealIngredients);
    // IMPORTANT
    // normally we should update the 'usedBy' field of each used ingredient

    // prepare store
    const store = createEmptyStore();
    store.dispatch(importData(initialData));
    store.dispatch(importData([temporaryMeal]));

    // render
    const style = {
        border: "solid 1px grey",
        margin: "70px 100px",
        padding: "2px 6px",
        width: "700px",
    };
    return (
        <Provider store={store}>
            <div style={style}>
                <Meal mealRef={{id: 14, ver: 1}} />
            </div>
        </Provider>
    );
}

function TestingFrame({children}: any) {
    const style = {
        border: "solid 1px grey",
        margin: "70px 100px",
        padding: "2px 6px",
        width: "700px",
    };
    return (
        <div style={style}>
            {children}
        </div>
    );
}

// use this just for dev
const createMeal = (
    mealId: number,
    mealVersion: number,
    mealIngredients: Food[],
    title = "Test Meal"
): Food => {
    const food = new Food(
        {
            id: mealId,
            ver: mealVersion,
        },
        title,
        FoodType.Meal,
        {  // 30g of each product
            fat: mealIngredients.reduce((acc, x) => acc + x.macros.fat * 30/100, 0),
            protein: mealIngredients.reduce((acc, x) => acc + x.macros.protein * 30/100, 0),
            carbs: mealIngredients.reduce((acc, x) => acc + x.macros.carbs * 30/100, 0),
        },
        "g",
        mealIngredients.length * 30,
        1,
    );
    food.ingredientsRefs = mealIngredients.map((ingredient, i) => new Ingredient(
        new Ref(
            ingredient.ref.id,
            ingredient.ref.ver,
        ),
        i,  // position of food within meal
        30,  // quantity, measured in the food's portions (which is 1g for simple foods)
        null,  // some additional text to display
    ));
    return food;
};

/*
// eslint-disable-next-line
function FoodSelection() {
    const store = createEmptyStore();
    store.dispatch(importData(initialData));

    const mapStateToProps = (state: State) => ({
        data: state.foodData.map(x => ({
            id: x.ref.id,
            name: x.name,
        })),
    });
    const mapDispatchToProps = {
        onFoodSelected: (id: number) => {
            const matchingFood = store.getState().foodData.filter(x => x.ref.id === id);
            console.log(`>> food selected: ${id} - ${JSON.stringify(matchingFood)}`);
            return {
                type: "user typed a letter",
            };
        },
    };
    const ConnectedFoodSelector = connect(mapStateToProps, mapDispatchToProps)(FoodSelector);

    const style = {
        border: "solid 1px grey",
        margin: "40px 100px",
        padding: "2px 6px",
        width: "400px",
    };
    return (
        <Provider store={store}>
            <div style={style}>
                <ConnectedFoodSelector context={Onion.create()} />
            </div>
        </Provider>
    );
}
*/

/*
// eslint-disable-next-line
function DisplayDataFromStore() {
    const initialState = {
        foodData: initialData,
        history: null,
    };
    const store = createStore(storeReducer, initialState);

    const mapStateToProps = (state: State) => ({
        populatedIngredients: state.foodData.slice(0,20).map(x => ({
            id: x.ref.id,
            version: x.ref.ver,
            name: x.name,
            quantity: 0,
            macros: x.macros,
        })),
    });
    const ConnectedIngredientsDisplay =
        connect(mapStateToProps)(IngredientsDisplay);

    const style = {
        border: "solid 1px grey",
        margin: "40px 100px",
        padding: "2px 6px",
        width: "800px",
    };
    return (
        <Provider store={store}>
            <div style={style}>
                <ConnectedIngredientsDisplay data={[]} onQuantityChange={()=>{}} />
            </div>
        </Provider>
    );
}
*/

/*
// eslint-disable-next-line
function FigureOutReduxAndCreatingMeals() {
    // some data
    const data1 = new TableDisplayEntry(1001, "prod A", 30, new Macros(23, 23, 40), false);
    const data2 = new TableDisplayEntry(1002, "prod B", 15, new Macros(14, 24, 44), false);
    const initialState = {onScreenFood: [data1, data2]};

    // prepare store
    const store = createStore(Reducer, initialState);

    // prettify output
    const style = {
        border: "solid 1px grey",
        margin: "40px 100px",
        padding: "2px 6px",
        width: "700px",
    };

    const mapStateToProps = (state) => ({
        data: state.onScreenFood,
    });
    const mapDispatchToProps = {
        onSelectionToggle: toggleSelection,
    };
    const ConnectedTableDisplay =
        connect(mapStateToProps, mapDispatchToProps)(TableDisplay);

    return (
        <Provider store={store}>
            <div style={style}>
                <ConnectedTableDisplay />
            </div>
        </Provider>
    );
}
*/

/* 
// eslint-disable-next-line
function ShowOfTableDisplay() {
    const data1 = new TableDisplayEntry(1001, "prod A", 30, new Macros(33, 23, 10), false);
    const data2 = new TableDisplayEntry(1002, "prod B", 15, new Macros(54, 14, 44), false);

    const initialState = [data1, data2];

    const [currentData, setData] = useState(initialState);

    let style = {
        border: "solid 1px grey",
        margin: "40px 100px",
        padding: "2px 6px",
        width: "700px",
    };

    const tableEntrySelectionToggled = (id) => {
        const newData = currentData.map(x => {
            if (x.id !== id) return x;
            return x.withIsSelected(!x.isSelected);
        })

        setData(newData);
    };

    return (
        <div style={style}>
            <TableDisplay data={currentData} onSelectionToggle={tableEntrySelectionToggled} />
        </div>
    );
}
*/

// eslint-disable-next-line
function showOfMacrosInfo() {
    let data = {
        fat: 34,
        protein: 12,
        carbs: 3,
    };

    let style1 = {
        border: "solid 2px grey",
        padding: "5px",
        marginLeft: "240px",
        marginTop: "50px",
        width: "200px",
    };

    return (
        <>
            <div style={style1}>
                <MacrosInfo macros={data} />
            </div>
        </>
    );
}

// eslint-disable-next-line
function showOfMacrosBar() {
    let style1 = {
        border: "solid 2px grey",
        padding: "5px",
        marginLeft: "240px",
        marginTop: "50px",
        width: "200px",
    };

    let style2 = {
        ...style1,
        width: "40px",
    };

    let style3 = {
        ...style1,
        height: "50px",
    };

    let style4 = {
        ...style1,
        width: "6px",
    };

    let style5 = {
        ...style1,
        height: "5px",
    };

    let style6 = {
        ...style1,
        height: "10px",
        border: "solid 1px grey",
        padding: "1px",
    };

    let style7 = {
        ...style1,
        height: "10px",
        border: "solid 2px lightgrey",
        padding: "1px",
    };

    let style8 = {
        marginLeft: "200px",
        marginTop: "50px",
        width: "100px",
        height: "12px",
    };

    let data = {
        fat: 34,
        protein: 12,
        carbs: 3,
    };

    return (
        <>
            <div style={style1}>
                <MacrosBar macros={data} />
            </div>
            <div style={style2}>
                <MacrosBar macros={data} />
            </div>
            <div style={style3}>
                <MacrosBar macros={data} />
            </div>
            <div style={style4}>
                <MacrosBar macros={data} />
            </div>
            <div style={style5}>
                <MacrosBar macros={data} />
            </div>
            <div style={style6}>
                <MacrosBar macros={data} />
            </div>
            <div style={style7}>
                <MacrosBar macros={data} />
            </div>
            <div style={style8}>
                <MacrosBar macros={data} />
            </div>
        </>
    );
}

/* eslint-enable */
