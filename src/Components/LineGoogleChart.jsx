
import React from "react";
import { Chart } from "react-google-charts";



const LineGoogleChart = ({data, name}) =>{

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
        legend: { position: "bottom" },
        chartArea: {
            width: '90%',
            height: 300,
        }

    };
    return (
        <Chart
            className="dark:text-white w-full"
            chartType="LineChart"
            width="100%"
            height="400px"
            data={chartdata}
            options={options}
        />
    );
}


export default LineGoogleChart