import Highcharts from 'highcharts'
import { defaultStaticOptions } from './defaultStaticOptions'

export const tempAreaStaticOptions: Highcharts.Options = {
    chart: {
        type: 'area',
        zooming: {
            mouseWheel: {
                enabled: false
            }
        },
    },
    // plotOptions: {
    //     area: {
    //         color: Highcharts.getOptions().colors[0],
    //         fillColor: {
    //             linearGradient: {
    //                 x1: 0,
    //                 x2: 0,
    //                 y1: 0,
    //                 y2: 1
    //             }, // 180 degrees
    //             stops: [
    //                 [0, `${Highcharts.getOptions().colors[0]}`],
    //                 [1, 'rgba(255, 255, 255, 0.5)'] 
    //             ]
    //         }
    //     }
    // },
    title: {
        text: ''
    },
    series: [{
        type: 'area',
        name: '',
        data: []
    }],
    rangeSelector: {
        enabled: false
    },
    navigator: {
        enabled: false
    }
}

export const areaStaticOptions: Highcharts.Options = Highcharts.merge(
    defaultStaticOptions, 
    tempAreaStaticOptions
)