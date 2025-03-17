const defaultData = [
    [
        1710987322000,
        1
    ],
    [
        1710987502000,
        1
    ],
    [
        1710987860000,
        1
    ],
    [
        1710989000000,
        1
    ],
    [
        1710989182000,
        1
    ],
    [
        1710989361000,
        1
    ],
    [
        1710990502000,
        1
    ],
    [
        1710991341000,
        1
    ],
    [
        1710991701000,
        1
    ],
    [
        1710991916000,
        1
    ],
    [
        1710992061000,
        1
    ],
    [
        1710992421000,
        1
    ],
    [
        1710992782000,
        1
    ],
    [
        1710993141000,
        1
    ],
    [
        1710995000000,
        1
    ],
    [
        1710995782000,
        1
    ],
    [
        1710995961000,
        1
    ],
    [
        1710996681000,
        1
    ],
    [
        1710996860000,
        1
    ],
    [
        1710997340000,
        1
    ],
    [
        1710997701000,
        1
    ],
    [
        1710998242000,
        1
    ],
]

const dataGenerator = () => {
    return defaultData.map(point => {
        const random = Math.random()
        const value = random < 0.3 
            ? 0 
            : random < 0.6
                ? 1
                : 2
        
        return [point[0], value]
    })
}

export const multipleChartMockData: Highcharts.SeriesLineOptions[] = [
    {
        type: 'line',
        name: 'Доступность оборудования',
        data: dataGenerator(),
        connectNulls: true,
        custom: {
            params: {
                view: {
                    type: 'chart',
                    value_converter: [
                        {
                            source: 0,
                            converted: 'Неизвестно'
                        },
                        {
                            source: 1,
                            converted: 'Недоступно'
                        },
                        {
                            source: 2,
                            converted: 'Доступно'
                        }
                    ]
                },
                unit: '',
                id: 323825,
                serName: 'Доступность оборудования'
            }
        },
        yAxis: 0,
    },
    {
        type: 'line',
        name: 'Рандом2',
        data: defaultData.map(point => ([point[0], Math.random()])),
        connectNulls: true,
        custom: {
            params: {
                view: {},
                unit: 'ч',
                id: 117698,
                serName: 'Рандом2'
            }
        },
    },
    {
        type: 'line',
        name: 'Качество оборудования',
        data: dataGenerator(),
        connectNulls: true,
        custom: {
            params: {
                view: {
                    type: 'chart',
                    value_converter: [
                        {
                            source: 0,
                            converted: 'Плохое'
                        },
                        {
                            source: 1,
                            converted: 'Посредственное'
                        },
                        {
                            source: 2,
                            converted: 'Отличное'
                        }
                    ]
                },
                unit: '',
                id: 321057,
                serName: 'Качество оборудования'
            }
        },
    },
    {
        type: 'line',
        name: 'Дороговизна оборудования',
        data: dataGenerator(),
        connectNulls: true,
        custom: {
            params: {
                view: {
                    type: 'chart',
                    value_converter: [
                        {
                            source: 0,
                            converted: 'Дорого'
                        },
                        {
                            source: 1,
                            converted: 'Нормально'
                        },
                        {
                            source: 2,
                            converted: 'Дешёво'
                        }
                    ]
                },
                unit: '',
                id: 327611,
                serName: 'Дороговизна оборудования'
            }
        },
    },
    {
        type: 'line',
        name: 'Рандом',
        data: defaultData.map(point => ([point[0], Math.random()])),
        connectNulls: true,
        custom: {
            params: {
                view: {},
                unit: 'мс',
                id: 115488,
                serName: 'Рандом'
            }
        },
    },
    
]