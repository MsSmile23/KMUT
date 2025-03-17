/* eslint-disable react-hooks/exhaustive-deps */

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { IChartWrapperProps, IChartRefWrapper, IBaseChartProps } from './types';
import { highchartsAdapters, optionsGenerator } from './generateOptions';
import moment from 'moment-timezone';

// import { useTheme } from '@shared/hooks/useTheme';


// Базовые глобальные опции Highcharts для всех типов графиков - устанавливаются один раз при инициализации
Highcharts.setOptions({
    lang: {
        loading: 'Загрузка...',
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        weekdays: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        shortMonths: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.',
            'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
        rangeSelectorZoom: 'Период',
        rangeSelectorFrom: 'Период с',
        rangeSelectorTo: 'по',
    },
    time: {
        getTimezoneOffset: function(timestamp) {
            const zone = moment.tz.guess(true)
            const timezoneOffset = -moment.tz(timestamp, zone).utcOffset()

            return timezoneOffset;
        },
        useUTC: true,
    },
    rangeSelector: {
        buttons: [
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
        ]
    },
    colors: [
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
        '#a56eff',
    ],
})

export const ChartContext = createContext<{ chart?: Highcharts.Chart } | undefined>(
    undefined
);

// Создание инстанса Highcharts и прокидывание его рефом через контекст
const ChartRefWrapper: React.FC<IChartRefWrapper> = ({ children, staticOptions }) => {
    const [, setState] = useState<unknown>();

    const chartRef = useRef<HighchartsReact.RefObject | null>(null);

    useEffect(() => {
        setState(chartRef.current?.chart);
    }, [chartRef.current?.chart]);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <ChartContext.Provider value={{ chart: chartRef.current?.chart }}>
            {children} {/* as <DynamicOptions options={dynamicOptions} /> */}
            <HighchartsReact
                ref={chartRef}
                constructorType="stockChart"
                highcharts={Highcharts}
                options={staticOptions}
            />
        </ChartContext.Provider>
    );
}

// Обёртка для проброса динамических опций при помощи компонента DynamicOptions и 
// навешивание статических опций, не зависящих от пропсов
const ChartWrapper: React.FC<IChartWrapperProps> = ({ staticOptions, dynamicOptions, children }) => {
    return (
        <ChartRefWrapper staticOptions={staticOptions}>
            <DynamicOptions
                dynamicOptions={dynamicOptions}
            />
            {children}
        </ChartRefWrapper>
    );
}

// Динамические опции графиков
export const DynamicOptions: React.FC<{ dynamicOptions: Highcharts.Options }> = ({
    dynamicOptions = {},
}) => {
    const ctx = useContext(ChartContext);

    // console.log('DynamicOptions', dynamicOptions)
    useEffect(() => {
        ctx?.chart?.update?.(dynamicOptions);
    }, [ctx?.chart, dynamicOptions]);

    return null;
};

// Базовый компонент графика 
export const BaseChart: React.FC<IBaseChartProps> = ({
    chartType,
    seriesData,
    customOptions,
    settings
}) => {

    // const theme = useTheme()

    const staticOpts = highchartsAdapters.prepareStaticOptions(chartType)
    const dynamicOpts = optionsGenerator({ chartType, seriesData, customOptions, settings, })

    return (
        <ChartWrapper
            staticOptions={staticOpts}
            dynamicOptions={dynamicOpts}
        >
            {/* <DynamicOptions
                dynamicOptions={optionsGenerator({ chartType, seriesData, customOptions, settings, theme })}
            /> */}
        </ChartWrapper>
    )
}

export const BaseChartFull: React.FC<IBaseChartProps> = ({
    chartType,
    seriesData,
    customOptions,
    settings
}) => {

    // const theme = useTheme()

    const chartRef = useRef<HighchartsReact.RefObject>(null);

    const staticOptions = highchartsAdapters.prepareStaticOptions(chartType)
    const dynamicOptions = optionsGenerator({ chartType, seriesData, customOptions, settings, })

    
    const newStatic: Highcharts.Options = Highcharts.merge(staticOptions, dynamicOptions, {
    // const newStatic: Highcharts.Options = merge(staticOptions, dynamicOptions, {
        series: seriesData,
    })

    // console.log('staticOptions', staticOptions)
    // console.log('newStatic', newStatic)

    // useEffect(() => {
    //     if (chartRef.current) {
    //         chartRef.current?.chart?.update(dynamicOptions)
    //         console.log('seriesData', seriesData)

    //         if (Array.isArray(seriesData)) {
    //             seriesData?.map((serie, idx) => {
    //                 chartRef?.current?.chart?.series[idx].setData(serie.data)
    //             })
    //         }
    // chartRef.current?.chart.series.(dynamicOptions)
    // chartRef.current.chart.update({
    //     ...dynamicOptions,
    //     //@ts-ignore
    //     series: seriesData
    // })
    //     }
    // }, [
    //     chartType,
    //     seriesData,
    //     customOptions,
    //     settings
    // ]);


    return (
        <HighchartsReact
            ref={chartRef}
            constructorType="stockChart"
            highcharts={Highcharts}
            options={newStatic}
            style={{ width: '100%', height: 'auto' }}
        />
    );
}