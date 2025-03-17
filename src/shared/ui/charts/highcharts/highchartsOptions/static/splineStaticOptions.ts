import Highcharts from 'highcharts'
import { defaultStaticOptions } from './defaultStaticOptions'

export const tempSplineStaticOptions: Highcharts.Options = {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Line chart'
    },
    series: [{
        type: 'spline',
        name: '',
        data: []
    }]

}

export const splineStaticOptions: Highcharts.Options = Highcharts.merge(
    defaultStaticOptions, 
    tempSplineStaticOptions
)