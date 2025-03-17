import Highcharts from 'highcharts'
import { defaultStaticOptions } from './defaultStaticOptions'

export const tempColumnStaticOptions: Highcharts.Options = {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Column chart'
    },
    series: [{
        type: 'column',
        name: '',
        data: []
    }]
}

export const columnStaticOptions: Highcharts.Options = Highcharts.merge(
    defaultStaticOptions, 
    tempColumnStaticOptions
)