import { /* addDoubleRing, addTotalToDonutCenter,  */
    customLabels, helpers, renderLegendParams } from '@shared/ui/charts/highcharts/utils'
import { IChartTypeProps } from '../types'
// import { widgetPropsAdapters } from '../widgetPropsAdapters';


export const createPropsBasedOptions: ((params: IChartTypeProps) => Highcharts.Options) = ({ 
    chartType, settings/* , theme */ 
}) => {

    // const dataWidgetPropsBasedOptions = settings?.widgetFormSettings && 
    // widgetPropsAdapters(settings.widgetFormSettings)
    const chartFormSettings = settings?.charts
    // const userInterfaceSettings = settings?.userInterfaceSettings

    // const range = theme?.chartStyles?.range
    // const area = theme?.chartStyles?.area
    // const barColumn = theme?.chartStyles?.barColumn
    // const chartNavigator = theme?.chartStyles?.chartNavigator
    // const line = theme?.chartStyles?.line
    // const pie = theme?.charts?.pie
    // const pie = theme?.chartStyles?.pie
    // const progressBar = theme?.chartStyles?.progressBar
    // const general = theme?.chartStyles?.general



    const fullLabelCondition =
        chartFormSettings?.legend?.legendUnits &&
        chartFormSettings?.legend?.legendUnits.length > 0 &&
        chartFormSettings?.legend?.legendTypeValues === 'both' &&
        chartFormSettings?.legend?.activeLabelLegend &&
        chartFormSettings?.legend?.orientationLegend === 'callout'

    /* const doubleRingSettings = {
        outer: {
            name: 'outerRing',
            // radCoef: pie?.doubleRing.outerBorder.radiusCoef ?? 0,
            // background: pie?.doubleRing.outerBorder.background ?? '',
            // color: pie?.doubleRing.outerBorder.color ?? '',
            // borderWidth: pie?.doubleRing.outerBorder.width ?? 0,
        },
        inner: {
            name: 'innerRing',
            // radCoef: pie?.doubleRing.innerBorder.radiusCoef ?? 0,
            // background: pie?.doubleRing.innerBorder.background ?? '',
            // color: pie?.doubleRing.innerBorder.color ?? '',
            // borderWidth: pie?.doubleRing.innerBorder.width ?? 0,
        }
    } */
    
    const chartsOpts: Record<string, Highcharts.Options> = {
        variablepie: {
            chart: {
                events: {
                    render: function(this: { series }) {
                        // console.log('TEST new pie', this)
                        
                        // if (pie?.donutType.enabled || chartFormSettings?.pie?.donutType) {
                        // addTotalToDonutCenter(this)
                        // addDoubleRing(this, doubleRingSettings)
                        // }
                    },
                },
                plotBackgroundColor: undefined,
                plotBorderWidth: undefined,
                plotShadow: false,
            },
            plotOptions: {
                variablepie: {
                    dataLabels: {
                        enabled: chartFormSettings?.legend?.activeLegend &&
                        chartFormSettings?.legend.orientationLegend === 'callout',
                        formatter: function(this: { point }) {
                            return customLabels(
                                this.point,
                                chartFormSettings?.legend?.legendUnits,
                                chartFormSettings?.legend?.legendTypeValues,
                                chartFormSettings?.legend?.activeLabelLegend
                            )
                        },
                        // connectorPadding: fullLabelCondition ? 0 : pie?.connectors.padding,
                        // connectorColor: pie?.connectors.color,
                        // connectorWidth: pie?.connectors.width,
                    },
                    size: fullLabelCondition ? '50%' : '70%',
                    // size: fullLabelCondition ? '35%' : '70%',
                    // innerSize: pie?.donutType.enabled ? pie?.donutType.innerSize : 0,
                    // minPointSize: pie?.donutType.thickness,
                },
            },
            legend: {
                ...renderLegendParams(chartFormSettings?.legend?.locationLegend ?? 'left'),
                enabled: chartFormSettings?.legend?.activeLegend && 
                chartFormSettings?.legend.orientationLegend !== 'callout',
                layout: chartFormSettings?.legend?.orientationLegend !== 'callout' 
                    ? chartFormSettings?.legend?.orientationLegend 
                    : 'horizontal',
                labelFormatter: function(this) {
                    return customLabels(
                        this,
                        chartFormSettings?.legend?.legendUnits,
                        chartFormSettings?.legend?.legendTypeValues,
                        chartFormSettings?.legend?.activeLabelLegend
                    )
                },
                margin: 0,
                reversed: false,
                width: chartFormSettings?.legend?.legendWidth ?? 'auto',
                
            },
            tooltip: {
                formatter: function(this: { percentage, point }) {
                    return `${this?.point.name}<br/>
                    Количество: <b>${helpers.roundToFirstDecimal(this?.percentage)}%</b>`
                },
            },
        }
    }

    return chartsOpts[chartType]
}