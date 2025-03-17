export const defaultStaticOptions: Highcharts.Options = {
    accessibility: {
        enabled: false
    },
    chart: {
        displayErrors: true,
        events: {},
        borderWidth: 0,
        borderRadius: 10,
        margin: 20
    },
    credits: {
        enabled: false
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
    // responsive: {
    //     rules: [{
    //         condition: {
    //             maxWidth: 500,
    //             maxHeight: 200
    //         },
    //         chartOptions: {
    //             legend: {
    //                 layout: 'horizontal',
    //                 align: 'center',
    //                 verticalAlign: 'bottom'
    //             }
    //         }
    //     }]
    // },
    scrollbar: {
        enabled: false
    },
}

/* 
const highchartsDefaultOpts = {
    'colors': [
        '#6929c4',
        '#1192e8',
        '#005d5d',
        '#9f1853',
        '#fa4d56',
        '#570408',
        '#198038',
        '#002d9c',
        '#ee538b',
        '#b28600',
        '#009d9a',
        '#012749',
        '#8a3800',
        '#a56eff'
    ],
    'symbols': [
        'circle',
        'diamond',
        'square',
        'triangle',
        'triangle-down'
    ],
    'lang': {
        'loading': 'Загрузка...',
        'months': [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ],
        'shortMonths': [
            'Янв.',
            'Фев.',
            'Мар.',
            'Апр.',
            'Май',
            'Июн.',
            'Июл.',
            'Авг.',
            'Сен.',
            'Окт.',
            'Ноя.',
            'Дек.'
        ],
        'weekdays': [
            'ВС',
            'ПН',
            'ВТ',
            'СР',
            'ЧТ',
            'ПТ',
            'СБ'
        ],
        'decimalPoint': '.',
        'numericSymbols': [
            'k',
            'M',
            'G',
            'T',
            'P',
            'E'
        ],
        'resetZoom': 'Отменить масштабирование',
        'resetZoomTitle': 'вернуться к масштабу 1:1',
        'thousandsSep': ' ',
        'rangeSelectorZoom': 'Период',
        'rangeSelectorFrom': 'Период c',
        'rangeSelectorTo': '&nbsp;         &nbsp;       по'
    },
    'global': {},
    'time': {
        'timezoneOffset': -180,
        'useUTC': true
    },
    'chart': {
        'alignThresholds': false,
        'panning': {
            'enabled': false,
            'type': 'x'
        },
        'styledMode': false,
        'borderRadius': 0,
        'colorCount': 10,
        'allowMutatingData': true,
        'ignoreHiddenSeries': true,
        'spacing': [
            10,
            10,
            15,
            10
        ],
        'resetZoomButton': {
            'theme': {
                'zIndex': 6
            },
            'position': {
                'align': 'right',
                'x': -10,
                'y': 10
            }
        },
        'reflow': true,
        'type': 'line',
        'zoomBySingleTouch': false,
        'zooming': {
            'singleTouch': false,
            'resetButton': {
                'theme': {
                    'zIndex': 6
                },
                'position': {
                    'align': 'right',
                    'x': -10,
                    'y': 10
                }
            }
        },
        'width': null,
        'height': null,
        'borderColor': '#334eff',
        'backgroundColor': '#ffffff',
        'plotBorderColor': '#cccccc'
    },
    'title': {
        'text': 'Chart title',
        'align': 'center',
        'margin': 15,
        'widthAdjust': -44
    },
    'subtitle': {
        'text': '',
        'align': 'center',
        'widthAdjust': -44
    },
    'caption': {
        'margin': 15,
        'text': '',
        'align': 'left',
        'verticalAlign': 'bottom'
    },
    'plotOptions': {

        'area': {
            'lineWidth': 1,
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': {
                'enabledThreshold': 2,
                'lineColor': '#ffffff',
                'lineWidth': 0,
                'radius': 4,
                'states': {
                    'normal': {
                        'animation': true
                    },
                    'hover': {
                        'animation': {
                            'duration': 150
                        },
                        'enabled': true,
                        'radiusPlus': 2,
                        'lineWidthPlus': 1
                    },
                    'select': {
                        'fillColor': '#cccccc',
                        'lineColor': '#000000',
                        'lineWidth': 2
                    }
                }
            },
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'align': 'center',
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'verticalAlign': 'bottom',
                'x': 0,
                'y': 0
            },
            'cropThreshold': 300,
            'opacity': 1,
            'pointRange': 0,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': {
                        'size': 10,
                        'opacity': 0.25
                    }
                },
                'select': {
                    'animation': {
                        'duration': 0
                    }
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': true,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x',
            'threshold': 0
        },
        'areaspline': {
            'lineWidth': 1,
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': {
                'enabledThreshold': 2,
                'lineColor': '#ffffff',
                'lineWidth': 0,
                'radius': 4,
                'states': {
                    'normal': {
                        'animation': true
                    },
                    'hover': {
                        'animation': {
                            'duration': 150
                        },
                        'enabled': true,
                        'radiusPlus': 2,
                        'lineWidthPlus': 1
                    },
                    'select': {
                        'fillColor': '#cccccc',
                        'lineColor': '#000000',
                        'lineWidth': 2
                    }
                }
            },
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'align': 'center',
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'verticalAlign': 'bottom',
                'x': 0,
                'y': 0
            },
            'cropThreshold': 300,
            'opacity': 1,
            'pointRange': 0,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': {
                        'size': 10,
                        'opacity': 0.25
                    }
                },
                'select': {
                    'animation': {
                        'duration': 0
                    }
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': true,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x',
            'threshold': 0
        },
        'line': {
            'lineWidth': 1,
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': {
                'enabledThreshold': 2,
                'lineColor': '#ffffff',
                'lineWidth': 0,
                'radius': 4,
                'states': {
                    'normal': {
                        'animation': true
                    },
                    'hover': {
                        'animation': {
                            'duration': 150
                        },
                        'enabled': true,
                        'radiusPlus': 2,
                        'lineWidthPlus': 1
                    },
                    'select': {
                        'fillColor': '#cccccc',
                        'lineColor': '#000000',
                        'lineWidth': 2
                    }
                }
            },
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'align': 'center',
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'verticalAlign': 'bottom',
                'x': 0,
                'y': 0
            },
            'cropThreshold': 300,
            'opacity': 1,
            'pointRange': 0,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': {
                        'size': 10,
                        'opacity': 0.25
                    }
                },
                'select': {
                    'animation': {
                        'duration': 0
                    }
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': true,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x'
        },
        'spline': {
            'lineWidth': 1,
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': {
                'enabledThreshold': 2,
                'lineColor': '#ffffff',
                'lineWidth': 0,
                'radius': 4,
                'states': {
                    'normal': {
                        'animation': true
                    },
                    'hover': {
                        'animation': {
                            'duration': 150
                        },
                        'enabled': true,
                        'radiusPlus': 2,
                        'lineWidthPlus': 1
                    },
                    'select': {
                        'fillColor': '#cccccc',
                        'lineColor': '#000000',
                        'lineWidth': 2
                    }
                }
            },
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'align': 'center',
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'verticalAlign': 'bottom',
                'x': 0,
                'y': 0
            },
            'cropThreshold': 300,
            'opacity': 1,
            'pointRange': 0,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': {
                        'size': 10,
                        'opacity': 0.25
                    }
                },
                'select': {
                    'animation': {
                        'duration': 0
                    }
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': true,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x'
        },
        'column': {
            'lineWidth': 1,
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': null,
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'x': 0
            },
            'cropThreshold': 50,
            'opacity': 1,
            'pointRange': null,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': false,
                    'brightness': 0.1
                },
                'select': {
                    'animation': {
                        'duration': 0
                    },
                    'color': '#cccccc',
                    'borderColor': '#000000'
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': false,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x',
            'borderRadius': 3,
            'centerInCategory': false,
            'groupPadding': 0.2,
            'pointPadding': 0.1,
            'minPointLength': 0,
            'startFromThreshold': true,
            'tooltip': {
                'distance': 6
            },
            'threshold': 0,
            'borderColor': '#ffffff'
        },
        'bar': {
            'lineWidth': 1,
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': null,
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'x': 0
            },
            'cropThreshold': 50,
            'opacity': 1,
            'pointRange': null,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': false,
                    'brightness': 0.1
                },
                'select': {
                    'animation': {
                        'duration': 0
                    },
                    'color': '#cccccc',
                    'borderColor': '#000000'
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': false,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x',
            'borderRadius': 3,
            'centerInCategory': false,
            'groupPadding': 0.2,
            'pointPadding': 0.1,
            'minPointLength': 0,
            'startFromThreshold': true,
            'tooltip': {
                'distance': 6
            },
            'threshold': 0,
            'borderColor': '#ffffff'
        },
        'pie': {
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': null,
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'align': 'center',
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'verticalAlign': 'bottom',
                'x': 0,
                'y': 0,
                'allowOverlap': true,
                'connectorPadding': 5,
                'connectorShape': 'crookedLine',
                'distance': 30,
                'enabled': true,
                'softConnector': true
            },
            'cropThreshold': 300,
            'opacity': 1,
            'pointRange': 0,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': {
                        'size': 10,
                        'opacity': 0.25
                    },
                    'brightness': 0.1
                },
                'select': {
                    'animation': {
                        'duration': 0
                    }
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': false,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x',
            'borderRadius': 3,
            'center': [
                null,
                null
            ],
            'clip': false,
            'colorByPoint': true,
            'ignoreHiddenPoint': true,
            'inactiveOtherPoints': true,
            'legendType': 'point',
            'size': null,
            'showInLegend': false,
            'slicedOffset': 10,
            'tooltip': {
                'followPointer': true
            },
            'borderColor': '#ffffff',
            'borderWidth': 1
        },
        'variablepie': {
            'allowPointSelect': false,
            'crisp': true,
            'showCheckbox': false,
            'animation': {
                'duration': 1000
            },
            'events': {},
            'marker': null,
            'point': {
                'events': {}
            },
            'dataLabels': {
                'animation': {},
                'align': 'center',
                'borderWidth': 0,
                'defer': true,
                'padding': 5,
                'style': {
                    'fontSize': '0.7em',
                    'fontWeight': 'bold',
                    'color': 'contrast',
                    'textOutline': '1px contrast'
                },
                'verticalAlign': 'bottom',
                'x': 0,
                'y': 0,
                'allowOverlap': true,
                'connectorPadding': 5,
                'connectorShape': 'crookedLine',
                'distance': 30,
                'enabled': true,
                'softConnector': true
            },
            'cropThreshold': 300,
            'opacity': 1,
            'pointRange': 0,
            'softThreshold': true,
            'states': {
                'normal': {
                    'animation': true
                },
                'hover': {
                    'animation': {
                        'duration': 150
                    },
                    'lineWidthPlus': 1,
                    'marker': {},
                    'halo': {
                        'size': 10,
                        'opacity': 0.25
                    },
                    'brightness': 0.1
                },
                'select': {
                    'animation': {
                        'duration': 0
                    }
                },
                'inactive': {
                    'animation': {
                        'duration': 150
                    },
                    'opacity': 0.2
                }
            },
            'stickyTracking': false,
            'turboThreshold': 1000,
            'findNearestPointBy': 'x',
            'borderRadius': 3,
            'center': [
                null,
                null
            ],
            'clip': false,
            'colorByPoint': true,
            'ignoreHiddenPoint': true,
            'inactiveOtherPoints': true,
            'legendType': 'point',
            'size': null,
            'showInLegend': false,
            'slicedOffset': 10,
            'tooltip': {
                'followPointer': true,
                'pointFormat': '<span style=\'color:{point.color}\'>●</span> 
                {series.name}<br/>Value: {point.y}<br/>Size: {point.z}<br/>'
            },
            'borderColor': '#ffffff',
            'borderWidth': 1,
            'minPointSize': '10%',
            'maxPointSize': '100%',
            'sizeBy': 'area'
        }
    },
    'legend': {
        'enabled': true,
        'align': 'center',
        'alignColumns': true,
        'className': 'highcharts-no-tooltip',
        'layout': 'horizontal',
        'itemMarginBottom': 2,
        'itemMarginTop': 2,
        'borderColor': '#999999',
        'borderRadius': 0,
        'navigation': {
            'style': {
                'fontSize': '0.8em'
            },
            'activeColor': '#0022ff',
            'inactiveColor': '#cccccc'
        },
        'itemStyle': {
            'color': '#333333',
            'cursor': 'pointer',
            'fontSize': '0.8em',
            'textDecoration': 'none',
            'textOverflow': 'ellipsis'
        },
        'itemHoverStyle': {
            'color': '#000000'
        },
        'itemHiddenStyle': {
            'color': '#666666',
            'textDecoration': 'line-through'
        },
        'shadow': false,
        'itemCheckboxStyle': {
            'position': 'absolute',
            'width': '13px',
            'height': '13px'
        },
        'squareSymbol': true,
        'symbolPadding': 5,
        'verticalAlign': 'bottom',
        'x': 0,
        'y': 0,
        'title': {
            'style': {
                'fontSize': '0.8em',
                'fontWeight': 'bold'
            }
        }
    },
    'loading': {
        'labelStyle': {
            'fontWeight': 'bold',
            'position': 'relative',
            'top': '45%'
        },
        'style': {
            'position': 'absolute',
            'backgroundColor': '#ffffff',
            'opacity': 0.5,
            'textAlign': 'center'
        }
    },
    'tooltip': {
        'enabled': true,
        'animation': true,
        'borderRadius': 3,
        'dateTimeLabelFormats': {
            'millisecond': '%A, %e %b, %H:%M:%S.%L',
            'second': '%A, %e %b, %H:%M:%S',
            'minute': '%A, %e %b, %H:%M',
            'hour': '%A, %e %b, %H:%M',
            'day': '%A, %e %b %Y',
            'week': 'Week from %A, %e %b %Y',
            'month': '%B %Y',
            'year': '%Y'
        },
        'footerFormat': '',
        'headerShape': 'callout',
        'hideDelay': 500,
        'padding': 8,
        'shape': 'callout',
        'shared': false,
        'snap': 10,
        'headerFormat': '<span style=\'font-size: 0.8em\'>{point.key}</span><br/>',
        'pointFormat': '<span style=\'color:{point.color}\'>●</span> {series.name}: <b>{point.y}</b><br/>',
        'backgroundColor': '#ffffff',
        'shadow': true,
        'stickOnContact': false,
        'style': {
            'color': '#333333',
            'cursor': 'default',
            'fontSize': '0.8em'
        },
        'useHTML': false
    },
    'credits': {
        'enabled': true,
        'href': 'https://www.highcharts.com?credits',
        'position': {
            'align': 'right',
            'x': -10,
            'verticalAlign': 'bottom',
            'y': -5
        },
        'style': {
            'cursor': 'pointer',
            'color': '#999999',
            'fontSize': '0.6em'
        },
        'text': 'Highcharts.com'
    },
    'scrollbar': {
        'height': 10,
        'barBorderRadius': 5,
        'buttonBorderRadius': 0,
        'buttonsEnabled': false,
        'minWidth': 6,
        'opposite': true,
        'step': 0.2,
        'zIndex': 3,
        'barBackgroundColor': '#cccccc',
        'barBorderWidth': 0,
        'barBorderColor': '#cccccc',
        'buttonArrowColor': '#333333',
        'buttonBackgroundColor': '#e6e6e6',
        'buttonBorderColor': '#cccccc',
        'buttonBorderWidth': 1,
        'rifleColor': 'none',
        'trackBackgroundColor': 'none',
        'trackBorderColor': '#cccccc',
        'trackBorderRadius': 5,
        'trackBorderWidth': 1
    },
    'navigator': {
        'height': 40,
        'margin': 25,
        'maskInside': true,
        'handles': {
            'width': 7,
            'height': 15,
            'symbols': [
                'navigator-handle',
                'navigator-handle'
            ],
            'enabled': true,
            'lineWidth': 1,
            'backgroundColor': '#f2f2f2',
            'borderColor': '#999999'
        },
        'maskFill': 'rgba(102,122,255,0.3)',
        'outlineColor': '#999999',
        'outlineWidth': 1,
        'series': {
            'type': 'areaspline',
            'fillOpacity': 0.05,
            'lineWidth': 1,
            'compare': null,
            'sonification': {
                'enabled': false
            },
            'dataGrouping': {
                'approximation': 'average',
                'enabled': true,
                'groupPixelWidth': 2,
                'firstAnchor': 'firstPoint',
                'anchor': 'middle',
                'lastAnchor': 'lastPoint',
                'units': [
                    [
                        'millisecond',
                        [
                            1,
                            2,
                            5,
                            10,
                            20,
                            25,
                            50,
                            100,
                            200,
                            500
                        ]
                    ],
                    [
                        'second',
                        [
                            1,
                            2,
                            5,
                            10,
                            15,
                            30
                        ]
                    ],
                    [
                        'minute',
                        [
                            1,
                            2,
                            5,
                            10,
                            15,
                            30
                        ]
                    ],
                    [
                        'hour',
                        [
                            1,
                            2,
                            3,
                            4,
                            6,
                            8,
                            12
                        ]
                    ],
                    [
                        'day',
                        [
                            1,
                            2,
                            3,
                            4
                        ]
                    ],
                    [
                        'week',
                        [
                            1,
                            2,
                            3
                        ]
                    ],
                    [
                        'month',
                        [
                            1,
                            3,
                            6
                        ]
                    ],
                    [
                        'year',
                        null
                    ]
                ]
            },
            'dataLabels': {
                'enabled': false,
                'zIndex': 2
            },
            'id': 'highcharts-navigator-series',
            'className': 'highcharts-navigator-series',
            'lineColor': null,
            'marker': {
                'enabled': false
            },
            'threshold': null
        },
        'xAxis': {
            'overscroll': 0,
            'className': 'highcharts-navigator-xaxis',
            'tickLength': 0,
            'lineWidth': 0,
            'gridLineColor': '#e6e6e6',
            'gridLineWidth': 1,
            'tickPixelInterval': 200,
            'labels': {
                'align': 'left',
                'style': {
                    'color': '#000000',
                    'fontSize': '0.7em',
                    'opacity': 0.6,
                    'textOutline': '2px contrast'
                },
                'x': 3,
                'y': -4
            },
            'crosshair': false
        },
        'yAxis': {
            'className': 'highcharts-navigator-yaxis',
            'gridLineWidth': 0,
            'startOnTick': false,
            'endOnTick': false,
            'minPadding': 0.1,
            'maxPadding': 0.1,
            'labels': {
                'enabled': false
            },
            'crosshair': false,
            'title': {
                'text': null
            },
            'tickLength': 0,
            'tickWidth': 0
        }
    },
    'rangeSelector': {
        'allButtonsEnabled': false,
        'buttonSpacing': 5,
        'dropdown': 'responsive',
        'verticalAlign': 'top',
        'buttonTheme': {
            'width': 28,
            'height': 18,
            'padding': 2,
            'zIndex': 7
        },
        'floating': false,
        'x': 0,
        'y': 0,
        'inputBoxBorderColor': 'none',
        'inputBoxHeight': 17,
        'inputDateFormat': '%e %b %Y',
        'inputEditDateFormat': '%Y-%m-%d',
        'inputEnabled': true,
        'inputPosition': {
            'align': 'right',
            'x': 0,
            'y': 0
        },
        'inputSpacing': 5,
        'buttonPosition': {
            'align': 'left',
            'x': 0,
            'y': 0
        },
        'inputStyle': {
            'color': '#334eff',
            'cursor': 'pointer',
            'fontSize': '0.8em'
        },
        'labelStyle': {
            'color': '#666666',
            'fontSize': '0.8em'
        }
    },
} 
*/