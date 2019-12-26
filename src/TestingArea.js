import React, { /* useState */ } from 'react';
import { MacrosBar, MacrosInfo, Macros } from './MacrosDisplay/MacrosDisplay';
import { IngredientsDisplay, IngredientsDisplayEntry } from './IngredientsDisplay/IngredientsDisplay';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import Reducer from './ReduxyStuff/Reducers.js'
import { importData } from './ReduxyStuff/ActionCreators.js'
import initialData from './data/initialData';
import FoodSelector from './FoodSelector/FoodSelector'
import { createEmptyStore, getAllMeals } from './Store/Store';
import FoodType from './data/FoodType';
import ConnectedMealWidget from './MealWidget';
import { MealListWidget } from './MealListWidget/MealListWidget';

export default function TestingArea() {
    // return showOfMacrosBar();
    // return showOfMacrosInfo();
    // return ShowOfTableDisplay();
    // return FigureOutReduxAndCreatingMeals();
    // return DisplayDataFromStore();
    // return FoodSelection();
    // return DisplayMeal();
    return DisplayAllMeals();
}

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
    store.dispatch(importData(temporaryMeal1));
    store.dispatch(importData(temporaryMeal2));

    return (
        <Provider store={store}>
            <TestingFrame>
                <MealListWidget meals={getAllMeals(store.getState())} />
            </TestingFrame>
        </Provider>
    );
}

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
    store.dispatch(importData(temporaryMeal));

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
                <ConnectedMealWidget mealId={mealId} mealVersion={mealVersion} />
            </div>
        </Provider>
    );
}

function TestingFrame({children}) {
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
const createMeal = (mealId, mealVersion, mealIngredients, title = "Test Meal") => ({
    version: mealVersion,

    id: mealId,
    name: title,
    macros: {  // 30g of each product
        fat: mealIngredients.reduce((acc, x) => acc + x.macros.fat * 30/100, 0),
        protein: mealIngredients.reduce((acc, x) => acc + x.macros.protein * 30/100, 0),
        carbs: mealIngredients.reduce((acc, x) => acc + x.macros.carbs * 30/100, 0),
    },
    extra: {},

    type: FoodType.Compound,
    unit: "g",  // for quantity display only
    portionSize: mealIngredients.length * 30,  // grams per portion
    portions: 1,
    components: mealIngredients.map(ingredient => ({
        id: ingredient.id,
        version: ingredient.version,
        quantity: 30,  // measured in the food's portions (which is 1g for simple foods)
        notes: null,  // some additional text to display
    })),
    usedBy: [],  // list of <id, version> of depending meals
    //uncertainty: false,  // we ignore this now (normally, we should compute it)
});

// eslint-disable-next-line
function FoodSelection() {
    const store = createEmptyStore();
    store.dispatch(importData(initialData));

    const mapStateToProps = (state) => ({
        data: state.current.foodData.map(x => ({
            id: x.id,
            name: x.name,
        })),
    });
    const mapDispatchToProps = {
        onFoodSelected: id => {
            const matchingFood = store.getState().current.foodData.filter(x => x.id === id);
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
                <ConnectedFoodSelector />
            </div>
        </Provider>
    );
}

// eslint-disable-next-line
function DisplayDataFromStore() {
    const initialState = {
        current: {
            foodData: initialData,
        },
        history: null,
    };
    const store = createStore(Reducer, initialState);

    const mapStateToProps = (state) => ({
        data: state.current.foodData.slice(0,20).map(x => new IngredientsDisplayEntry(
            x.id,
            x.name,
            0,
            new Macros(x.macros.fat, x.macros.protein, x.macros.carbs),
            false,
        )),
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
                <ConnectedIngredientsDisplay />
            </div>
        </Provider>
    );
}

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