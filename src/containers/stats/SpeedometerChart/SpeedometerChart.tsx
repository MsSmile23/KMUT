/* eslint-disable */

import React, { FC, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './speedometr.scss'
import { SERVICES_STATS } from '@shared/api/Stats'
import { generatePlotBands, generateSeriesGauge } from './service'

//require('highcharts/highcharts-more')(Highcharts)
//require('highcharts/modules/exporting')(Highcharts)

import more from 'highcharts/highcharts-more'
import exporting from 'highcharts/modules/exporting'

more(Highcharts)
exporting(Highcharts)

const SpeedometerChart: FC<{
    value: any
    title: string
    values: Record<number, { start: number; end: number }>
    limits: {
        id: number
        description: string
        colors: string
    }[]

    // eslint-disable-next-line react/display-name
}> = ({ value, title, values, limits }) => {
    //ререндер графика
    useEffect(() => {
        setTimeout(() => {
            for (let i = 0; i < Highcharts.charts.length; i++) {
                if (Highcharts.charts[i] !== undefined) {
                    Highcharts.charts[i]?.reflow()
                }
            }
        }, 500)
        // window.dispatchEvent(new Event('resize'));
    }, [])

    const limit = SERVICES_STATS.Services.getStatus(value, values, limits)

    const options = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            // height: '80%',
        },
        title: {
            align: 'center',
            text: title,
            y: 20,
            style: {
                fontSize: '15px',
                fontWeight: 'bold',
            },
        },
        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: null,
            center: ['50%', '75%'],
            size: '130%',
        },
        tooltip: {
            enabled: false,
        },
        yAxis: {
            min: 0,
            max: 100,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            //@ts-ignore
            tickColor: '#333',
            tickLength: 25,
            tickWidth: 1,
            minorTickInterval: null,
            labels: {
                distance: -32,
                style: {
                    fontSize: '10px',
                    color: '#333',
                },
            },
            plotBands: generatePlotBands(values, limits),
        },
        exporting: { enabled: false },
        series: [generateSeriesGauge(limit, value.value)],
    }

    return (
        <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ className: 'container-speed' }} />
    )
}

export default SpeedometerChart
