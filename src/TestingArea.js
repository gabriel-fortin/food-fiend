import React, { useState } from 'react';
import {MacrosBar, MacrosInfo, Macros} from './MacrosDisplay/MacrosDisplay';
import {TableDisplay, TableDisplayEntry} from './TableDisplay/TableDisplay';

export default function TestingArea() {
    // return showOfMacrosBar();
    // return showOfMacrosInfo();
    return ShowOfTableDisplay();
}

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
