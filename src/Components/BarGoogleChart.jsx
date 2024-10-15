
import React from "react";
import { Chart } from "react-google-charts";



const BarGoogleChart = ({data, names}) =>{

    const chartdata = [
        ["City", ...names],
        ...data?.map(itm => ([itm.label, ...itm.values]))
    ];
    console.log(chartdata)
    // const chartdata = [
    //     ["Year", "Sales", "Expenses"],
    //     ["2004", 1000, 400],
    //     ["2005", 1170, 460],
    //     ["2006", 660, 1120],
    //     ["2007", 1030, 540],
    // ];
  
    const options = {
        title: "Population of Largest Cities",
        // curveType: "function",
        legend: { position: "right", width: '100%', height: '100%' },
        // pieHole: 0.4,
        is3D : false,
        chartArea: { width: "75%", height : 300 },
        hAxis: {
            title: "Total Population",
            minValue: 0,
        },
        vAxis: {
            title: "City",
        },
        // slices: {
        //     4: { offset: 0.2 },
        //     1: { offset: 0.1 },
        //     6: { offset: 0.4 },
        //     15: { offset: 0.5 },
        // },

    };
    return (
        <Chart
            className="dark:text-white w-full"
            chartType="BarChart"
            width="100%"
            height="400px"
            data={chartdata}
            options={options}
            
        />
    );
}


export default BarGoogleChart