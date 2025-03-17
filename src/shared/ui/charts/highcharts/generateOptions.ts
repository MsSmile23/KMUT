import { /* IBaseChartProps,  */IHighchartAdapters, IOptionsGenerator } from './types'
import Highcharts from 'highcharts';
import { highchartsStaticsOptions } from './highchartsOptions';
import { createPropsBasedOptions } from './highchartsOptions/dynamicOptions';

export const optionsGenerator: IOptionsGenerator = ({
    chartType, seriesData, customOptions, settings, theme
}) => {
    //опции, приходящие с интерфейса графиков
    const settingOptions = {}

    // подготовленный объект данных серии
    const series = highchartsAdapters.prepareSeries(seriesData)

    // общие динамические опции
    const dynamicOptions = highchartsAdapters.prepareDynamicOptions(chartType)

    // опции, зависящие от пропсов
    const propsBasedOptions = createPropsBasedOptions({ chartType, settings, theme })

    // Приоритет применения опций  ака 'Порядок мёрджа опций', чем выше, тем приоритетнее
    // 1 - Общие динамические опции
    // 2 - Подготовленный объект данных серии - series
    // 3 - кастомные опции, которые необходимо прокинуть кодом customOptions
    // 4 - опции, зависящие от пропсов - propsBasedOptions
    // 5 - опции, приходящие с интерфейса графиков - settingOptions
    return Highcharts.merge(dynamicOptions, series, customOptions, propsBasedOptions, settingOptions)
}


export const highchartsAdapters: IHighchartAdapters = {
    prepareSeries: (seriesData) => {
        return Array.isArray(seriesData)
            ? { series: seriesData }
            : { series: [seriesData] }
    },
    prepareStaticOptions: (chartType) => {
        const staticOptions = highchartsStaticsOptions[chartType]
        
        return staticOptions
        // return Highcharts.merge(Highcharts.defaultOptions,staticOptions)
    },
    prepareDynamicOptions: (/* chartType */) => {
        // const dynamicOptions = highchartsStaticsOptions[chartType]
        // return dynamicOptions
        return {}
    },
}