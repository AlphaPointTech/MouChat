
import React from "react";
import { Chart } from "react-google-charts";



const PieGoogleChart = ({data, name}) =>{

    const chartdata = [
        ["City", name],
        ...data?.map(itm => ([itm.label, +itm.value]))
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
        title: name ? name : "Incident rate",
        // curveType: "function",
        legend: { position: "right", width: '100%', height: '100%' },
        // pieHole: 0.4,
        is3D : false,
        chartArea: {
            width: '90%',
            height: 400,
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
            chartType="PieChart"
            width="100%"
            height="400px"
            data={chartdata}
            options={options}
            
        />
    );
}


export default PieGoogleChart