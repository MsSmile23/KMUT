import { IProjectSettings } from '@app/themes/types'
import React from 'react'

export enum IChartTypes {
    LINE = 'line',
    SPLINE = 'spline',
    AREA = 'area',
    AREASPLINE = 'areaspline',
    VARIABLEPIE = 'variablepie',
    PIE = 'pie',
    COLUMN = 'column',
    PLATESCOLUMN = 'platesColumn',
    NETWORKGRAPH = 'networkgraph',
    TREEMAP = 'treemap',
    WORDCLOUD = 'wordcloud',
    SANKEY = 'sankey',
    SCATTER_PLOT = 'scatterPlot',
}

export type IOptionsList = Record<IChartTypes, Highcharts.Options>

export type IBaseChartOptions = Record<IChartTypes, Highcharts.Options>

export interface ISeriesOptions {
    line: Highcharts.SeriesLineOptions | Highcharts.SeriesLineOptions[]
    spline: Highcharts.SeriesSplineOptions
    area: Highcharts.SeriesAreaOptions
    areaspline: Highcharts.SeriesAreasplineOptions
    pie: Highcharts.SeriesPieOptions
    variablepie: Highcharts.SeriesVariablepieOptions
    column: Highcharts.SeriesColumnOptions
    platesColumn: Highcharts.SeriesColumnOptions['data']
    treemap: Highcharts.SeriesTreemapOptions
    networkgraph: Highcharts.SeriesNetworkgraphOptions
    wordcloud: Highcharts.SeriesWordcloudOptions
    sankey: Highcharts.SeriesSankeyOptions,
    scatterPlot: Highcharts.SeriesScatterOptions
}

export interface IChartRefWrapper {
    staticOptions: Highcharts.Options
    children: React.ReactNode | React.ReactNode[];
}

export interface IChartWrapperProps {
    staticOptions: Highcharts.Options
    dynamicOptions: Highcharts.Options
    children?: React.ReactNode | React.ReactNode[]
}

export type IOptionsGenerator = (params: IBaseChartProps) => Highcharts.Options

export interface IBaseChartProps extends ICustomChartProps<ISeriesOptions[IChartTypes]> {
    chartType: IChartTypes,
    theme?: IProjectSettings
}

export interface IChartTypeProps extends IChangingChartProps {
    chartType: IChartTypes,
    theme?: IProjectSettings
}
export interface IChangingChartProps {
    settings?: IProjectSettings
    // settings?: ICustomSettings
}
export type ISeriesData<T> = T | T[]

export interface IMultiSeriesChartProps<T> extends ICustomChartProps<T> {
    chartType: IChartTypes[]
}
export interface ICustomChartProps<T> extends IChangingChartProps {
    seriesData: ISeriesData<T>
    children?: React.ReactNode | React.ReactNode[]
    // customTooltip, customLabels, customDataLabels, spline Type, variablepie<->pie (minPointSize ...)
    customOptions?: Highcharts.Options,
    defaultSettings?: {
        periodMnemo: string //Мнемоника периода по умолчанию
    }
    commonSettings?: {
        height?: number
        width?: number
    }
}

export interface ICustomSettings {
    widgetFormSettings: any /* IWidgetFormSettings */, // настройки формы виджета
    chartFormSettings: IChartSettings, // настройки формы представления
    userInterfaceSettings?: any, // какие-то пользовательские настройки, которые будут настраиваться на самом графике
}
export interface IHighchartAdapters {
    prepareSeries: (seriesData: ISeriesData<ISeriesOptions[IChartTypes]>) => Highcharts.Options
    prepareStaticOptions: (chartType: IChartTypes) => Highcharts.Options
    prepareDynamicOptions: (chartType: IChartTypes) => Highcharts.Options
}

// --------------------------------- END ---------------------------------- //
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// ----------------------- CHART WIDGET FORM SETTINGS ------------------------ //
export interface IChartSettings extends IChartSettingsDenis {
    pie?: {
        donutType: boolean
    }
}

export interface IChartSettingsDenis {
    rangeSelector?: {
        isEnabledButtons: boolean
        isEnabledInput: boolean
    },
    labels?: {
        isVisible: boolean
    },
    navigator?: {
        isEnabled: boolean
    },
    xAxis?: {
        isVisible: boolean
        tickAmount: number
        title: string
    },
    yAxis?: {
        isVisible: boolean
        tickAmount: number
        title: string
    },
    legend?: {
        activeLegend: boolean
        orientationLegend: 'horizontal' | 'vertical' | 'callout'
        legendUnits: string
        legendTypeValues: 'absolute' | 'percentage' | 'both'
        activeLabelLegend: boolean
        legendWidth: string
        locationLegend: 'left' | 'right' | 'top' | 'bottom' | undefined
    }

}
// --------------------------------- END ---------------------------------- //
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// ---------------------- CUSTOM INTERFACE SETTINGS ----------------------- //

export interface IUserInterfaceSettings { }

// --------------------------------- END ---------------------------------- //
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// ----------------------- DATA WIDGET FORM TYPES ------------------------ //

// export interface IWidgetFormSettings {
//     widgetProps: IWidgetPropsList[IWidgetList]
//     widgetKey: IWidgetList
// }

// export type IWidgetPropsAdapters = (props: IWidgetFormSettings) => Highcharts.Options

// export type IWidgetList = keyof typeof WIDGETS

// export interface IWidgetPropsList {
//     WIDGET_DENIS_TEST: IWidgetDenisTest
//     WIDGET_STATUS_CHART: IWidgetStatusChart
//     WIDGET_DATA_TABLE: IWidgetDataTable
//     WIDGET_SYSTEM_FILTERS: IWidgetSystemFilters
//     WIDGET_SUBJECTS_TREE: IWidgetSubjectsTree
//     WIDGET_SUBJECTS_SERVICE: IWidgetSubjectsService
//     WIDGET_SUBJECTS_CHART: IWidgetSubjectsChart
//     WIDGET_MAP: IWidgetMap
//     WIDGET_DEVICE_SCHEME: IWidgetDeviceScheme
//     WIDGET_SERVICE_CHART: IWidgetServiceChart
//     WIDGET_SERVICES_ALL_CHART: IWidgetServicesAllChart
//     WIDGET_ATTR_SUBJECT: IWidgetAttrSubject
//     WIDGET_SERVICE_SUBJECT: IWidgetServiceSubject
//     WIDGET_EVENTS: IWidgetEvents
//     WIDGET_SUBJECTS_REACTIONS_TABLE: IWidgetSubjectsReactionsTable
//     WIDGET_STATUS_HISTORY: IWidgetStatusHistory
//     SUBJECT_COUNT_WIDGET: IWubjecCountWidget
//     WIDGET_BAND_STAT: IWidgetBandStat
//     BAND_COUNT_WIDGET: IBandCountWidget
//     UTILISATION_STATS_WIDGET: IUtilisTionStatsWidget
//     BAND_UTIL_STATS_WIDGET: IBandUtilStatsWidget
//     SUBJECT_TYPES_PIE_WIDGET: ISubjecTypesPieWidget
//     DEVICE_FOR_MONITORING_WIDGET: IWeviceForMonitoringWidget
//     TICKETS_WITH_GROUPING_WIDGET: IWicketWithGroupingWidget
//     TICKET_TABLE_WIDGET: IWicketTable_widget
//     AGGR_METRIC_RESULTS_WIDGET: IAggrMetricResultsWidget
//     METRIC_CHARTS_FOR_CHILDS: IMetricChartsForChilds
//     SUBJECT_PARENTS_CHILDES_WIDGET: ISubjectParentsChildesWidget
//     SUBJECTS_GRID_WITH_ATTRS_WIDGET: ISubjectsGridWithAttrsWidget
//     METRIC_CHART_WIDGET: IWetricChartWidget
//     WIDGET_HEADER_PANEL: IWidgetHeaderPanel
//     VALUES_HISTORY_AGGREGATION_WIDGET: IWaluesHistoryAggregationWidget
//     SUBJECT_SCHEME: ISubjecScheme
//     WIDGET_VIDEO_IP_CAMERA: IWidgetVideoIpCamera 
// }
// Все формы виджетов из widget-consts
export interface IWidgetStatusChart {
    handleSelectService: 'Субъекты' | 'Услуги' | 'Критерии' | 'Метрики'
    chartsCountInARow: 1 | 2 | 3 | 4 | 5
    handleSelectGroup: 'Без группировки' | 'По услугам' | 'По субъектам' | 'По типам субъектов'
    subjectType: string[]
    subjectTypeCheck: boolean
}

export interface IWidgetDenisTest {

}

export interface IWidgetDataTable {

}

export interface IWidgetSystemFilters {

}

export interface IWidgetSubjectsTree {

}

export interface IWidgetSubjectsService {

}

export interface IWidgetSubjectsChart {

}

export interface IWidgetMap {

}

export interface IWidgetDeviceScheme {

}

export interface IWidgetServiceChart {

}

export interface IWidgetServicesAllChart {

}

export interface IWidgetAttrSubject {

}

export interface IWidgetServiceSubject {

}

export interface IWidgetEvents {

}

export interface IWidgetSubjectsReactionsTable {

}

export interface IWidgetStatusHistory {

}

export interface IWubjecCountWidget {

}

export interface IWidgetBandStat {

}

export interface IBandCountWidget {

}

export interface IUtilisTionStatsWidget {

}

export interface IBandUtilStatsWidget {

}

export interface ISubjecTypesPieWidget {

}

export interface IWeviceForMonitoringWidget {

}

export interface IWicketWithGroupingWidget {

}

export interface IWicketTable_widget {

}

export interface IAggrMetricResultsWidget {

}

export interface IMetricChartsForChilds {

}

export interface ISubjectParentsChildesWidget {

}

export interface ISubjectsGridWithAttrsWidget {

}

export interface IWetricChartWidget {

}

export interface IWidgetHeaderPanel {

}

export interface IWaluesHistoryAggregationWidget {

}

export interface ISubjecScheme {

}

export interface IWidgetVideoIpCamera {

}

// --------------------------------- END ---------------------------------- //