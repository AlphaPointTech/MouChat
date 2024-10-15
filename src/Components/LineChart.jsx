

import * as React from 'react';
import {
    LineChart,
    lineElementClasses,
    markElementClasses,
  } from '@mui/x-charts/LineChart';
  
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];
  

const LineChartComponent = ({data}) =>{
    console.log(data?.name)
    return (
        <>
           <LineChart
                height={300}
                className='dark:text-white'
                series={[
                    { data: data?.map((d) => d.value) || [], label: data?.name, id: 'pvId' },
                ]}
                xAxis={[{ scaleType: 'point', data: data?.map((d) => d.label) || [] }]}
                sx={{
                    [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                    strokeWidth: 1,
                    },
                    '.MuiLineElement-series-pvId': {
                    strokeDasharray: '5 5',
                    },
                    '.MuiLineElement-series-uvId': {
                    strokeDasharray: '3 4 5 2',
                    },
                    [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
                    fill: '#fff',
                    },
                    [`& .${markElementClasses.highlighted}`]: {
                    stroke: 'none',
                    },
                }}
            />
        </>
    )
}

export default LineChartComponent