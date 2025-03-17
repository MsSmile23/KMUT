/* eslint-disable */

import Highcharts from "highcharts";

export const renderStatus = (item, widg) => {
    let tmp;
    widg?.map((status) => {
        if (item.data >= status.from && item.data <= status.to) {
            tmp = {
                name: status.description,
                color: status.colors
            }
        }
    })

    return {
        ...item,
        ['statusData']: widg,
        ['statusColor']: {
            ...tmp
        }
    }
}

export const generateSeriesGauge1 = (data) => {
    return {
        name: data?.name,
        data: [data?.data],
        tooltip: {
            enabled: false
            // valueSuffix: ' %'
        },
        dataLabels: {
            formatter: function () {
                const color = data?.statusColor?.color
                const name = data?.statusColor?.name
                let output = `<div class="gauge-data">`;
                //@ts-ignore
                output += `<span class="gauge-value1" style="color:${color}; font-size: 13px; font-weight: bold"> ${Math.floor(this.y)} %</span>`;
                output += `<span class="gauge-text1" style="color: ${color}; font-size: 13px; font-weight: bold">${name?.toUpperCase()}</span>`;
                output += `</div>`;
                return output;
            },
            useHTML: true,
            borderWidth: 0,
            color: (
                Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
            ) || '#333333',
            style: {
                top: 0,
                fontSize: '18px'
            }
        },
        dial: {
            radius: '100%',
            backgroundColor: '#333',
            baseWidth: 12,
            baseLength: '80%',
            rearLength: '-77%'
        },
        pivot: {
            backgroundColor: '#333',
            radius: 0
        }
    }
}


export const generateSeriesGauge = (limit, value) => {
    return {
        name: 'speedometer',
        data: [Math.floor(value)],
        tooltip: {
            enabled: false
            // valueSuffix: ' %'
        },
        dataLabels: {
            formatter: function () {
                const color = limit.colors
                const name = limit?.description
                let output = `<div class="gauge-data">`;
                //@ts-ignore
                output += `<span class="gauge-value" style="color:${color}"> ${Math.floor(this.y)} %</span>`;
                output += `<span class="gauge-text" style="color: ${color}">${name?.toUpperCase()}</span>`;
                output += `</div>`;
                return output;
            },
            useHTML: true,
            borderWidth: 0,
            color: (
                Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
            ) || '#333333',
            style: {
                top: 0,
                fontSize: '18px'
            }
        },
        dial: {
            radius: '100%',
            backgroundColor: '#333',
            baseWidth: 12,
            baseLength: '80%',
            rearLength: '-77%'
        },
        pivot: {
            backgroundColor: '#333',
            radius: 0
        }
    }
}

export const generatePlotBands1 = (data) => {
    const arr: any[] = []
    // let tmp = ''
    data?.map((item) => {
        arr.push({
            from: item.from,
            to: item.to,
            color: item.colors, //Красный
            thickness: 20
        })
    })
    return arr
}


export const dataRender: { [x: string]: string | number }[] = [
    {
        id: 2,
        title: 'Норма',
        key: 'success'
    },
    {
        id: 3,
        title: 'Отклонение',
        key: 'deviation'
    },
    {
        id: 18,
        title: 'Недоступность',
        key: 'unavailability'
    }
];


export const generatePlotBands = (values, limit) => {
    const arr: any[] = []
    // let tmp = ''
    Object.entries<any>(values).map(([_key, value]) => {
        const color = limit.find((item) => item.id == _key)?.colors
        arr.push({
            from: value.start,
            to: value.end,
            color: color, //Красный
            thickness: 20
        })
    }, [])
    // data?.map((item) => {
    //     arr.push({
    //         from: item.from,
    //         to: item.to,
    //         color: item.colors, //Красный
    //         thickness: 20
    //     })
    // })

 return arr
    // data.map((item, index) => {
    //     console.log(index)
    //     if (index === 0) {
    //         arr.push({
    //             from: item.from,
    //             to: item.to,
    //             color: item.colors, //Красный
    //             thickness: 20
    //         })
    //         tmp = item.colors
    //     } else if (index !== 0) {
    //         arr.push({
    //             from: item.from,
    //             to: item.to,
    //             color: {
    //                 linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    //                 stops: [
    //                     [0, item.colors],
    //                     [1, tmp]
    //                 ]
    //             },
    //             thickness: 20
    //         })
    //         tmp = item.colors
    //     }
    // })
    //
    // return arr
    // [{
    //     from: 0,
    //     to: 20,
    //     color: '#DF5353', //Красный
    //     thickness: 20
    // },
    //     {
    //         from: 20,
    //         to: 60,
    //         // color: '#DDDF0D', // yellow
    //         color: {
    //             linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    //             stops: [
    //                 [0, '#f3f49a'], //желтый
    //                 [1, '#DF5353'] //красный
    //             ]
    //         },
    //         thickness: 20
    //     },
    //     {
    //         from: 60,
    //         to: 80,
    //         // color: '#55BF3B', // red
    //         color: {
    //             linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    //             stops: [
    //                 [0, '#e5e675'], //желтый
    //                 [1, '#55BF3B'] //зеленый
    //             ]
    //         },
    //         thickness: 20
    //     },
    //     {
    //         from: 80,
    //         to: 100,
    //         // color: '#55BF3B', // red
    //         color: '#55BF3B',//зеленый
    //         thickness: 20
    //     }]
}