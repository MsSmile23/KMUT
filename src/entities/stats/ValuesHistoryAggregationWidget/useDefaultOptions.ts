import { useEffect, useState } from 'react';
import { SVGAttributes } from 'highcharts';
import { ILineChart } from './lineChartProps';

const rangeSelectorButtons: any[] = [
    {
        type: 'hour',
        count: 1,
        text: '1ч',
    },
    {
        type: 'day',
        count: 1,
        text: '1д',
    },
    {
        type: 'month',
        count: 1,
        text: '1мес',
    },
    {
        type: 'year',
        count: 1,
        text: '1г',
    },
    {
        type: 'all',
        text: 'все',
    },
];

/**
 * Форумирует базовые options для графика
 * @param props - аналог options для Highcharts с кастомными полями
 * @returns options
 */
export const useDefaultChartOptions = (props: ILineChart) => {
    const [ localOptions, setLocalOptions ] = useState<ILineChart>({
        series: []
    })

    //const theme = useContext(PreloadTheme)
    //const { range } = theme.chartStyles
    
    const { 
        active = undefined, 
        notActive = undefined 
    } = {
        active: undefined, 
        notActive: undefined 
    }
    
    function addRangeIcons(chart) {
        if (chart.rangeSelector.iconFrom) {
            chart.rangeSelector.iconFrom.destroy();
            chart.rangeSelector.iconFrom = undefined;
        }
        // if (chart.rangeSelector.iconTo) {
        //     chart.rangeSelector.iconTo.destroy();
        //     chart.rangeSelector.iconTo = undefined;
        // }

        const inputGroupSizes = chart.rangeSelector.inputGroup.getBBox()
        const minLabelSizes = chart.rangeSelector.minLabel.getBBox()
        const minDateBoxSizes = chart.rangeSelector.minDateBox.getBBox()

        // добавить иконку по координатам maxLabel
        chart.rangeSelector.iconFrom = chart.renderer
            .path(''/* rangeIcon.path.split(' ') */)
            .attr({
                fill: undefined, //rangeIcon.fill,
                zIndex: 30,
            })
            .add(chart?.rangeSelector?.inputGroup)

        const iconFromSizes = chart.rangeSelector.iconFrom.getBBox()

        // сместить иконку от maxLabel и отцентрировать по высоте
        chart.rangeSelector.iconFrom.attr({
            transform: `translate(
                    ${minLabelSizes.width + minDateBoxSizes.width + 0 /* range.inputs.gutter * 2 */},
                    ${(inputGroupSizes.height - iconFromSizes.height) / 2}
                )`
        })

        // добавить иконку по конечным координатам inputGroup
        chart.rangeSelector.iconTo = chart.renderer
            .path('' /* rangeIcon.path.split(' ') */)
            .attr({
                fill: '', //rangeIcon.fill,
                zIndex: 30
            })
            .add(chart.rangeSelector.inputGroup)

        const iconToSizes = chart.rangeSelector.iconFrom.getBBox()

        // сместить иконку от inputGroup и отцентрировать по высоте
        chart.rangeSelector.iconTo.attr({
            transform: `translate(
                ${inputGroupSizes.width /* + range.buttons.gutter */},
                ${(inputGroupSizes.height - iconToSizes.height) / 2}
            )`,
        })
    }

    function rangeInputsOptions(chart) {
        addRangeIcons(chart)

        const inputsRects = chart.rangeSelector.inputGroup.element.querySelectorAll('.highcharts-range-input > rect')

        // "from range input" attributes
        const fromAtrrs = {
            rx: 0/* range.inputs.style.inputDateFrom.borderRadius */
        }

        // "to range input" attributes
        const toAtrrs = {
            rx: 0 /* range.inputs.style.inputDateTo.borderRadius */
        }

        function addAttrsToSVG(element: SVGElement, attrs: SVGAttributes,) {
            Object.entries(attrs).map(([key, value]) => {
                element.setAttribute(key, value)
            })

            return element;
        }

        addAttrsToSVG(inputsRects[0], fromAtrrs)
        addAttrsToSVG(inputsRects[1], toAtrrs)
    }
    useEffect(() => {
        const tooltip = props.tooltip
        const labels = props.yAxis?.labels
        const navigator = props.navigator
        const rangeSelector = props.rangeSelector

        setLocalOptions({
            exporting: { enabled: props.exporting?.enabled ?? false },
            chart: {
                type: props.chart?.type ?? 'line',
                events: {
                    redraw: function(this: any) {                        
                        // console.clear()
                        // console.log('redraw this', this)
                        // console.log('redraw this points', this.series)
                    },
                    render: function(this: {options, rangeSelector}) {
                        if (this.options.rangeSelector.enabled) {rangeInputsOptions(this)}

                        // скрытие группы инпутов при маленьком размере
                        if (
                            this.options.rangeSelector.enabled 
                            && this.rangeSelector.buttonGroup && this.rangeSelector.inputGroup
                        ) {
                            const RSwidth = this.rangeSelector.group.getBBox().width
                            const BGwidth = this.rangeSelector.buttonGroup.getBBox().width
                            const IGwidth = this.rangeSelector.inputGroup.getBBox().width
                            const freeSpace = RSwidth - BGwidth - IGwidth

                            freeSpace < 100 
                                ? this.rangeSelector.inputGroup.hide()
                                : this.rangeSelector.inputGroup.show()
                        }
                    }
                },
            },
            plotOptions: {
                area: {
                    colors: [], //ThemeSettings.chartColors,
                    fillColor: {
                        linearGradient: props.navigator?.maskFill?.linearGradient || {
                            x1: 0,
                            x2: 0,
                            y1: 0,
                            y2: 1
                        }, // 180 degrees
                        stops: [
                            [0, '' /* ThemeSettings.chartColors[0] */],
                            [1, 'rgba(255, 255, 255, 0.5)'] 
                        ]
                    }
                },
                series: {
                    minPointLength: props.plotOptions?.series?.minPointLength,
                    maxPointWidth: props.plotOptions?.series?.maxPointWidth,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                shared: tooltip?.shared ?? true,
                useHTML: tooltip?.useHTML ?? true,
                formatter: tooltip?.formatter || function(this: any) {
                    const dt = new Date(this.x).toLocaleString('ru', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                    // заменяем запятую после даты
                    }).replace(',', ' ')

                    return this.points.reduce((html: string, point: any) => {
                        return html + (point.y === 0 ? '' : `
                            <div style="display:flex;gap:5px;marginTop:5px;">
                                <div style="backgroundColor: ${point.color.stops[0][1]};height:10px;width:10px"></div>
                                <div>${point.y}</div>
                            </div>
                        `)

                    }, `<b>${dt}</b><br />`)
                }
            },
            legend: {
                enabled: props.legend?.enabled ?? true,
                title: {
                    text: props.legend?.title?.text
                }
            },
            scrollbar: {
                enabled: props.scrollbar?.enabled ?? false
            },
            xAxis: {
                showLastLabel: props.xAxis?.showLastLabel ?? true,
            },
            yAxis: {
                labels: {
                    formatter: labels?.formatter || function({ value }) {
                        return labels?.custom?.[value] || value
                    },
                },
                opposite: props.yAxis?.opposite || false,
                showLastLabel: props.yAxis?.showLastLabel ?? true,
                /**
                 * допускаем, что у всех графиков одинаковые названия меток по оси Y
                 * ограничиваем максимальные значения для графика,
                 * чтобы максимальное значение было рядом с навбаром графика
                 */
                max: props?.yAxis?.max,
                min: props?.yAxis?.min,
                tickInterval: props?.yAxis?.tickInterval,
                endOnTick: props?.yAxis?.endOnTick ?? false
            },
            series: props.series,
            rangeSelector: {
                buttons: props.rangeSelector?.buttons || rangeSelectorButtons,
                buttonTheme: {
                    fill: active?.fill,
                    stroke: active?.stroke,
                    'stroke-width': active?.strokeWidth,
                    rx: active?.rx,
                    style: {
                        color: active?.color,
                        fontFamily: active?.fontFamily,
                        fontWeight: active?.fontWeight,
                        fontSize: active?.fontSize,
                        fontStyle: active?.fontStyle,
                    },
                    states: {
                        hover: {
                            fill: active?.fill,
                            stroke: active?.stroke,
                            strokeWidth: active?.strokeWidth || '2px',
                            style: {
                                color: active?.color,
                                fontWeight: active?.fontWeight || 'bold',
                                
                            }
                        },
                        select: {
                            fill: active?.fill,
                            style: {
                                color: active?.color
                            }
                        },
                        disabled: { 
                            fill: notActive?.fill,
                            style: {
                                color: notActive?.color,
                                fontWeight: notActive?.fontWeight
                            }
                        }
                    }
                },
                selected: rangeSelector?.selected || 4,
                inputDateFormat: rangeSelector?.inputDateFormat || '%Y-%m-%d',
                inputEditDateFormat: rangeSelector?.inputEditDateFormat || '%Y-%m-%d',
                inputEnabled: rangeSelector?.inputEnabled ?? true,
                inputStyle: rangeSelector?.inputStyle || {
                    color: '#000000',
                    fontWeight: 'normal'
                },
                dropdown: rangeSelector?.dropdown || 'always'
            },
            navigator: {
                borderRadius: navigator?.height || '10px',
                height: navigator?.height || 17,
                enabled: navigator?.enabled ?? true,
                outlineColor: navigator?.outlineColor || '#000000',
                outlineWidth: navigator?.outlineWidth || 0,
                handles: {
                    backgroundColor: navigator?.handles?.backgroundColor || '#D9D9D9',
                    borderColor: navigator?.handles?.borderColor || '#000000',
                    height: navigator?.handles?.height || 11,
                    lineWidth: navigator?.handles?.lineWidth || 0.5,
                    width: navigator?.handles?.width || 7
                },
                maskFill: {
                    linearGradient: props.navigator?.maskFill?.linearGradient || {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1
                    },
                    stops: props.navigator?.maskFill?.stops || [
                        [0, 'rgba(28, 145, 255, 0.5)'],
                        [1, 'rgba(255, 255, 255, 0.5)'] 
                    ]
                },
            },
        })
    }, [])

    return [ localOptions, setLocalOptions ] as const
}