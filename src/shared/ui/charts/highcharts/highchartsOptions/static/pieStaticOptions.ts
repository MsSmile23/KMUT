import Highcharts from 'highcharts'
import { defaultStaticOptions } from './defaultStaticOptions'

export const tempPieStaticOptions: Highcharts.Options = {
    chart: {
        type: 'pie',
        plotBackgroundColor: undefined,
        plotBorderWidth: undefined,
        plotShadow: false,
        zooming: {
            type: 'x',
            mouseWheel: {
                enabled: false
            }
        },
    },
    legend: {
        reversed: false,
        margin: 0,
    },
    navigator: {
        enabled: false,
        outlineWidth: 0,
    },
    plotOptions: {
        variablepie: {
            allowPointSelect: true,
            borderRadius: 0,
            borderWidth: 0,
            cursor: 'pointer',
            animation: false,
            events: {
                click: function(event) {
                    event.preventDefault()
                }
            },
            dataLabels: {
                alignTo: 'plotEdges',
                crop: false,
                overflow: 'allow',
                distance: 25,
                position: 'right',
                connectorShape: 'crookedLine',
                crookDistance: undefined,
                softConnector: false,
                zIndex: -2,
                verticalAlign: 'top'
            },
            showInLegend: true,
            states: {
                hover: {
                    enabled: true,
                    animation: {
                        duration: 0
                    }
                },
                inactive: {
                    enabled: false
                },
            }
        },
    },
    rangeSelector: {
        enabled: false
    },
    scrollbar: {
        enabled: false
    },
    series: [{
        type: 'pie',
        name: '',
        data: []
    }],
    // title: {
    //     text: 'Pie chart',
    //     style: {
    //         display: 'none',
    //         fontSize: '12',
    //         textAlign: 'center',
    //         fontWeight: 'bold'
    //     }
    // },
    xAxis: {
        gridLineWidth: 0
    },
}

export const pieStaticOptions: Highcharts.Options = Highcharts.merge(
    defaultStaticOptions, 
    tempPieStaticOptions
)