import Highcharts from 'highcharts'

export const tempLineStaticOptions: Highcharts.Options = {
    accessibility: {
        enabled: false
    },
    chart: {
        events: {
            render: function() {
                // console.log('this linechart', this)
            }
        },
        animation: false,
        alignTicks: false,
        zooming: {
            type: 'x',
            mouseWheel: {
                enabled: false
            }
        },
        displayErrors: true,
        borderWidth: 0,
        // borderRadius: 10,
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: true
    },
    navigator: {
        height: 20,
        enabled: true,
        handles: {
            backgroundColor: '#D9D9D9',
            borderColor: '#000000',
            enabled: true,
            height: 11,
            lineWidth: 0.5,
            width: 7
        },
        maskFill: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, `${Highcharts.getOptions().colors[0]}`],
                [1, 'rgba(255, 255, 255, 0.5)']
            ]
        },
    },
    plotOptions: {
        line: {
            dataGrouping: {
                enabled: false,
            }
        },
        spline: {
            dataGrouping: {
                enabled: false,
            }
        },
        areaspline: {
            dataGrouping: {
                enabled: false,
            }
        },
    },
    rangeSelector: {
        enabled: false
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 450,
            },
            chartOptions: {
                chart: {
                    marginTop: 30,
                },
                rangeSelector: {
                    enabled: false
                }
            }
        }]
    },  
    scrollbar: {
        enabled: false
    },
    series: [{
        type: 'line',
        name: '',
        data: []
    }],
    title: {
        text: ''
    },
    tooltip: {
        shared: true,
    },
    yAxis: [{
        labels: {
            distance: 10,
            align: 'left',
            style: {
                color: 'inherit'
            }
        },
        lineWidth: 1,
        lineColor: '#000000',
        opposite: true,
        showLastLabel: true,
    }],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b \'%y gg',
            year: '%Y gg'
        },
        ordinal: true
    },
}

export const lineStaticOptions: Highcharts.Options = Highcharts.merge(
    // defaultStaticOptions,
    tempLineStaticOptions
)