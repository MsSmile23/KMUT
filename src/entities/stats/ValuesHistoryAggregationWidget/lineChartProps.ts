export interface ILineChart {
    exporting?: { enabled: boolean };
    title?: Record<string, any> | null
    chart?: {
        events?: {
            load?: any
            redraw?: any
            render?: any
        },
        type?: 'column' | 'line' | 'area',
        marginLeft?: number,
    },
    plotOptions?: {
        column?: {
            pointWidth?: number,
            dataGrouping?: {
                enabled?: boolean
            }
        },
        area?: {
            colors: string[]
            fillColor: {
                linearGradient: {
                    x1: number,
                    x2: number,
                    y1: number,
                    y2: number
                },
                stops: [number, string][]
            } 
        }
        series?: {
            stacking?: 'normal' | 'percent',
            dataLabels?: {
                enabled?: boolean,
                formatter?: (arg: any) => string,
                useHTML?: boolean,
                shared?: boolean
            },
            minPointLength?: number
            maxPointWidth?: number
            borderRadius?: {
                radius?: number | string
            },
        }
    },
    scrollbar?: {
        enabled?: boolean,
    },
    tooltip?: {
        shared?: boolean;
        useHTML?: boolean;
        formatter?: (arg: any) => string;
    };
    legend?: {
        enabled?: boolean
        title?: {
            text?: string
        }
    },
    xAxis?: {
        categories?: string[]
        gridLineWidth?: number,
        type?: 'datetime',
        tickPositioner?: (args: any) => number[]
        tickLength?: number
        labels?: Partial<{
            x: number
            y: number
            enabled: boolean
        }>
        showLastLabel?: boolean;
        endOnTick?: boolean;
    },
    yAxis?: {
        labels?: {
            // здесь нужно указать числа и их значения
            // { 3: 'Жарко', 1: 'Нормально', 0: 'Холодно' }
            custom?: Record<number, string>;
            unit?: string;
            formatter?: (arg: any) => void;
            align?: 'left' | 'right',
            useHTML?: boolean,
            shared?: boolean
            x?: number
            y?: number
        };
        opposite?: boolean;
        showLastLabel?: boolean;
        // ограничиваем максимальные значения для графика
        maxPadding?: number
        minPadding?: number
        softMax?: number,
        max?: number;
        min?: number;
        tickInterval?: number;
        endOnTick?: boolean,
    };
    series: {
        name: string;
        data: [number, number][] | number[];
        showInNavigator?: boolean;
        dataGrouping?: {
            enabled?: boolean;
        };
        color?: string
        type?: string // todo: typing!
        connectNulls?: boolean
        pointPlacement?: number | 'between'
    }[];
    rangeSelector?: {
        enabled?: boolean
        buttons?: {
            type?: 'hour' | 'day' | 'month' | 'year' | 'all';
            count?: number;
            text?: string;
        }[];
        selected?: number;
        buttonTheme?: Partial<{
            fill: string,
            stroke: string,
            'stroke-width': string | number,
            rx: string,
            style: Partial<{
                color: string,
                fontFamily: string | number,
                fontWeight: string | number,
                fontSize: string | number,
                fontStyle: string,
            }>,
            states: Partial<{
                hover: Partial<{
                    fill: string,
                    stroke: string,
                    strokeWidth: string | number,
                    style: Partial<{
                        color: string,
                        fontWeight: string,
                    }>
                }>,
                select: Partial<{
                    fill: string,
                    style: Partial<{
                        color: string
                    }>
                }>,
                disabled: Partial<{ 
                    fill: string,
                    style: Partial<{
                        color: string,
                        fontWeight: string
                    }>
                }>
            }>
        }>,
        inputDateFormat?: string,
        inputEditDateFormat?: string,
        inputEnabled?: boolean,
        inputStyle?: {
            color: string,
            fontWeight: string
        },
        dropdown?: string
    };
    navigator?: {
        height?: number;
        borderRadius?: string | number;
        enabled?: boolean,
        outlineColor?: string,
        outlineWidth?: number,
        handles?: {
            backgroundColor?: string,
            borderColor?: string,
            enabled?: boolean,
            height?: number,
            lineWidth?: number,
            width?: number
        },
        maskFill?: {
            linearGradient?: Record<'x1' | 'x2' | 'y1' | 'y2', number>,
            stops?: [number, string][]
        },
    };
}