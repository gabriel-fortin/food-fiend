import React, { /* useState */ } from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { ThemeProvider } from '@chakra-ui/core';

import { State, storeReducer, importData, changeIngredientQuantity, setCurrentDay, AppStateProvider, changeFoodName } from 'Store'
import OldFoodType from '../data/FoodType';
import initialData from '../data/initialData';

import { MacrosBar, MacrosInfo } from 'Widget';
// import { IngredientsListWidget as IngredientsDisplay } from 'Widget';
import { FoodSelector } from 'Widget';
import { Meal } from 'Widget';
import { MealList } from 'Widget';
import { Onion, PlantOnionGarden } from 'Onion';
import { Ingredient, Food, FoodType, Ref } from 'Model';
import { AllOfType } from "Screen";


function createEmptyStore() {
    // return createStore<State, Action, any, any>(storeReducer, new State());
    return createStore(storeReducer, State.create());
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
    const tempDay = createDay(666, [lunch, obiad], "test day");
    // IMPORTANT
    // normally we should update the 'usedBy' field of each used ingredient


    // prepare store
    const store = createEmptyStore();
    store.dispatch(importData(initialData));
    store.dispatch(importData([lunch]));
    store.dispatch(importData([obiad]));
    store.dispatch(importData([tempDay]));
    store.dispatch(setCurrentDay(new Ref(666, -14)));
    store.dispatch(changeFoodName("I am changed", Onion.create().withFoodLayer(tempDay.ref).withPositionLayer(1).withFoodLayer(obiad.ref)));

    const mapState = (state: State) => ({
        dayRef: state.getCurrentDay() as Ref,  // TODO: this will fail when day is null
    });
    const DoubleConnectedMealListWidget = connect(mapState)(MealList);

    return (
        <ThemeProvider>
            <AppStateProvider _debug__injectStore={store}>
                <PlantOnionGarden>
                    <TestingFrame>
                        <DoubleConnectedMealListWidget />
                        {/* <AllOfType /> */}
                    </TestingFrame>
                </PlantOnionGarden>
            </AppStateProvider>
        </ThemeProvider>
    );
}

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
