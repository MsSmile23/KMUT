
import { BaseChart, BaseChartFull } from './BaseChart'
import { CommonChart } from './CommonChart'
// import { CommonHighChart } from './CommonHighChart'
import { /* IChartSettings,  */IChartTypes, ICustomChartProps, 
    IMultiSeriesChartProps, /* ISeriesData ,*/ ISeriesOptions } from './types'

// const chartSettings: IChartSettings = {
//     labels: {
//         isVisible: false
//     },
//     legend: {
//         activeLegend: false,
//         orientationLegend: 'vertical',
//         legendUnits: '',
//         legendTypeValues: 'absolute',
//         activeLabelLegend: false,
//         legendWidth: 'auto',
//         locationLegend: 'left'
//     },
//     navigator: {
//         isEnabled: true
//     },
//     pie: {
//         donutType: true
//     },
//     rangeSelector: {
//         isEnabledButtons: true,
//         isEnabledInput: true
//     },
//     xAxis: {
//         isVisible: true,
//         tickAmount: 5,
//         title: ''
//     },
//     yAxis: {
//         isVisible: true,
//         tickAmount: 5,
//         title: ''
//     },

// }

// const widgetSettings = {}
// const userSettings = {}
// const customOptions = {}
// const settings = {
//     widgetFormSettings: widgetSettings, // настройки формы виджета
//     chartFormSettings: chartSettings, // настройки формы представления
//     userInterfaceSettings: userSettings // какие-то пользовательские настройки
// }

//-----------------------------------------////



// interface ICommonChart extends ICustomChartProps<ISeriesOptions[IChartTypes]> {
//     chartType: IChartTypes
// }
// export const CommonChart: React.FC<ICommonChart> = ({
//     chartType, seriesData, children, customOptions, settings
// }) =>{

//     return (
//         <BaseChart
//             chartType={chartType}
//             seriesData={seriesData}
//             customOptions={customOptions}
//             settings={settings}
//         >
//             {children}
//         </BaseChart>
//     )
// }

export const MultiseriesChart: React.FC<IMultiSeriesChartProps<ISeriesOptions[IChartTypes]>>  = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.LINE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

export const MultiLineChart: React.FC<ICustomChartProps<Highcharts.SeriesLineOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.LINE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

// export const LineChart: React.FC<ICustomChartProps<Highcharts.SeriesLineOptions>> = ({
//     seriesData, children, customOptions, settings
// }) => {
export const LineChart: React.FC<ICustomChartProps<Highcharts.SeriesLineOptions>> = ({
    seriesData, customOptions, defaultSettings, commonSettings
}) => {

    return (
        <CommonChart
            chartType={IChartTypes.LINE}
            seriesData={seriesData}
            customOptions={customOptions}
            defaultSettings={defaultSettings}
            commonSettings={commonSettings}
        />
    )
}

export const SplineChart: React.FC<ICustomChartProps<Highcharts.SeriesSplineOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.SPLINE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

export const AreaChart: React.FC<ICustomChartProps<Highcharts.SeriesAreaOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.AREA}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

export const AreaSplineChart: React.FC<ICustomChartProps<Highcharts.SeriesAreasplineOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.AREASPLINE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

export const VariablePieChart: React.FC<ICustomChartProps<Highcharts.SeriesVariablepieOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.VARIABLEPIE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

export const PieChart: React.FC<ICustomChartProps<Highcharts.SeriesPieOptions>> = ({
    seriesData, customOptions, settings
}) => {
    return (
        // <CommonHighChart
        <CommonChart
            chartType={IChartTypes.PIE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        />
    )
}

export const TreeMapChart: React.FC<ICustomChartProps<Highcharts.SeriesTreemapOptions>> = ({
    seriesData, customOptions, settings
}) => (
    <CommonChart
        chartType={IChartTypes.TREEMAP}
        seriesData={seriesData}
        customOptions={customOptions}
        settings={settings}
    />
)

export const ColumnChart: React.FC<ICustomChartProps<Highcharts.SeriesColumnOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChart
            chartType={IChartTypes.COLUMN}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChart>
    )
}

export const VariablePieChartNew: React.FC<ICustomChartProps<Highcharts.SeriesVariablepieOptions>> = ({
    seriesData, children, customOptions, settings
}) => {

    return (
        <BaseChartFull
            chartType={IChartTypes.VARIABLEPIE}
            seriesData={seriesData}
            customOptions={customOptions}
            settings={settings}
        >
            {children}
        </BaseChartFull>
    )
}