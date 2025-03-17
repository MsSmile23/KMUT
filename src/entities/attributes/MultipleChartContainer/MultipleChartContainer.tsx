/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */
import { IMultipleChartFormPart } from '@containers/widgets/WidgetMultipleChart/MultipleChartForm'
// import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory'
import { IObjectAttribute } from '@shared/types/objects'
import { ECMultipleChart } from '@shared/ui/ECUIKit/charts/ECMultipleChart/ECMultipleChart'
// import { multipleChartMockData } from '@shared/ui/ECUIKit/charts/ECMultipleChart/mockData'
import { setLegendPosition } from '@shared/ui/ECUIKit/charts/utils'
import { FC, memo, PropsWithChildren, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { getOAseries } from './utils'
import { ECLoader } from '@shared/ui/loadings'
import { IWidgetObjectOAttrsWithHistoryFormProps } from '@containers/widgets/WidgetObjectOAttrsWithHistory/ObjectOAttrsWithHistoryForm'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { useInterval } from '@shared/hooks/useInterval'
import { ITargetObjectsAndOAttrsForm } from '@containers/widgets/WidgetObjectOAttrsWithHistory/TargetObjectsAndOAttrsForm'
import _ from 'lodash'
import { OpUnitType } from 'dayjs'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export interface IMultipleChartContainerProps {
    legend?: {
        position?: 'top' | 'bottom' | 'left' | 'right'
        layout?: Highcharts.LegendOptions['layout']
    }
    axisProps?: IMultipleChartFormPart[]
    attrBlockProps?: IWidgetObjectOAttrsWithHistoryFormProps
    currentObjectId?: number
    autoUpdate?: {
        enabled: boolean
        time: number
    }
    // objectAttributes: IObjectAttribute[]
    height?: number
    commonSettings?: {
        limit?: number
        dateIntervals?: [string, string]
        legendWidth?: number | string
        defaultPeriod?: OpUnitType | string
    }
    OAttrs?: IExtendedObjectAttribute[]
    background?: string
    color?: string
}
type TLoadingStatus = 'idle' | 'loading' | 'finished'

export interface IExtendedObjectAttribute extends IObjectAttribute {
    showAttrValue?: ITargetObjectsAndOAttrsForm['showAttrValue']
    forceShow?: ITargetObjectsAndOAttrsForm['forceShow']
}

export const MultipleChartContainerComponent: FC<IMultipleChartContainerProps> = ({
    legend,
    axisProps,
    attrBlockProps,
    currentObjectId,
    autoUpdate = {
        enabled: true,
        time: 600_000,
    },
    // objectAttributes,
    height = 400,
    commonSettings,
    OAttrs,
    background,
    color,
}) => {
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const currentObject = getObjectByIndex('id', currentObjectId)

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = useMemo(() => {
        return isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    }, [theme?.widget?.textColor, theme?.colors, themeMode])
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const getAttrsFromBaseForm = (): IExtendedObjectAttribute[] => {
        const attrs = OAttrs
            ? OAttrs
            : Object.keys(attrBlockProps ?? {}).reduce((acc, key) => {
                if (attrBlockProps && ['own', 'linked', 'other'].includes(key)) {
                    if (attrBlockProps[key]?.enabled) {
                        attrBlockProps[key]?.OASettings.forEach((props) => {
                            const index = attrBlockProps.items.findIndex((item) => item.mnemo === key)

                            // Если есть targetClassIds, то нужно пройтись по дочерним объектами и добавить их
                            if (attrBlockProps.items[index]?.formProps?.showForm?.includes('targetClassIds')) {
                                if (props?.targetClassIds?.length > 0) {
                                    // при указании целевых классов, если выбран объект, то показываем его
                                    // console.log('props', props)

                                    // if (props?.objectId) {
                                    //     const currentObject = getObjectByIndex('id', props?.objectId)

                                    //     currentObject?.object_attributes?.forEach(oa => {
                                    //         if ((oa.attribute.history_to_cache || oa.attribute.history_to_db)
                                    //         && (oa.attribute?.view_type?.type === 'chart' || !oa.attribute?.view_type)) {
                                    //             const idx = acc.findIndex(a => a.id === oa.id)

                                    //             if (idx < 0) {
                                    //                 acc.push(oa)
                                    //             }
                                    //         }
                                    //     })
                                    // // если не выбран ни один, то показываем атрибуты всех связанных объектов
                                    // } else {

                                    const children = findChildObjectsWithPaths({
                                        currentObj: currentObject,
                                        targetClassIds: props?.targetClassIds,
                                        childClassIds: props?.linkedClassIds,
                                    }).objectsWithPath

                                    children.forEach((child) => {
                                        const currentObject = getObjectByIndex('id', child?.id)

                                        currentObject?.object_attributes?.forEach((oa) => {
                                            if (
                                                (oa.attribute.history_to_cache || oa.attribute.history_to_db) &&
                                                  (oa.attribute?.view_type?.type === 'chart' ||
                                                      !oa.attribute?.view_type)
                                            ) {
                                                const idx = acc.findIndex((a) => a.id === oa.id)

                                                if (idx < 0) {
                                                    acc.push({
                                                        ...oa,
                                                        showAttrValue: props?.showAttrValue,
                                                        forceShow: props?.forceShow,
                                                    })
                                                }
                                            }
                                        })
                                    })
                                    // }
                                }
                                // иначе добавляем сам объект
                            } else {
                                if (['own', 'linked'].includes(key)) {
                                    // const currentObject = getObjectByIndex('id', vtemplate.objectId)

                                    currentObject?.object_attributes?.forEach((oa) => {
                                        if (
                                            (oa.attribute.history_to_cache || oa.attribute.history_to_db) &&
                                              (oa.attribute?.view_type?.type === 'chart' || !oa.attribute?.view_type)
                                        ) {
                                            const idx = acc.findIndex((a) => a.id === oa.id)

                                            if (idx < 0) {
                                                acc.push({
                                                    ...oa,
                                                    showAttrValue: props?.showAttrValue,
                                                    forceShow: props?.forceShow,
                                                })
                                            }
                                        }
                                    })
                                } else {
                                    // Если выбран один объект, смотрим его атрибуты,
                                    // если только класс, то атрибуты всех объектов класса
                                    const objects = props?.objectId
                                        ? [getObjectByIndex('id', props?.objectId)]
                                        : props?.classId
                                            ? getObjectByIndex('class_id', props?.classId)
                                            : []

                                    objects.forEach((currentObject) => {
                                        currentObject?.object_attributes?.forEach((oa) => {
                                            if (
                                                (oa.attribute.history_to_cache || oa.attribute.history_to_db) &&
                                                  (oa.attribute?.view_type?.type === 'chart' ||
                                                      !oa.attribute?.view_type)
                                            ) {
                                                const idx = acc.findIndex((a) => a.id === oa.id)

                                                if (idx < 0) {
                                                    acc.push({
                                                        ...oa,
                                                        showAttrValue: props?.showAttrValue,
                                                        forceShow: props?.forceShow,
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                        })
                    }
                }

                return acc
            }, [] as IExtendedObjectAttribute[])

        // console.log('attrs', attrs)

        return attrs
    }
    // console.log('commonSettings', commonSettings)
    const handleSHaxis = function(/* this: Highcharts.Series, event: Event */) {
        const oneOfSeriesIsVisible = this?.yAxis?.series.some((currSerie) => currSerie?.visible)

        if (oneOfSeriesIsVisible !== this.yAxis?.visible) {
            this.yAxis.update({
                visible: oneOfSeriesIsVisible,
            })
        }
    }

    const [compState, setCompState] = useState<{
        seriesData: Highcharts.SeriesLineOptions[]
        options: Highcharts.Options
    }>({
        seriesData: [],
        options: {
            chart: {
                backgroundColor: background || backgroundColor,
                height: height,
                events: {
                    load: function() {
                        this.setSize(undefined, height, false)
                    },
                },
            },
            plotOptions: {
                line: {
                    events: {
                        show: handleSHaxis,
                        hide: handleSHaxis,
                    },
                },
            },
            rangeSelector: {
                dropdown: 'always',
                labelStyle: {
                    color: color || textColor,
                },
            },
            yAxis: {
                labels: { style: { color: color || textColor } },
            },
            legend: {
                margin: 0,
                itemStyle: {
                    color: color || textColor,
                },
            },
            navigator: {
                margin: 0,
                xAxis: {
                    labels: {
                        style: {
                            color: textColor || 'black',
                        },
                    },
                },
            },
        },
    })
    const [status, setStatus] = useState<TLoadingStatus>('idle')

    // const updateCommonChartInstance = useCallback(() => {
    //     return (chart: Highcharts.Chart) => {
    //         chart.setSize(undefined, height)
    //     }
    // }, [
    //     height
    // ])

    useEffect(() => {
        setStatus('loading')
        getOAseries({
            status,
            setStatus: (status) => setStatus(status),
            axisProps,
            OAttrs: getAttrsFromBaseForm() ?? [],
            dateIntervals: commonSettings?.dateIntervals,
            setSeriesAxisState: (props) =>
                setCompState((prev) => ({
                    seriesData: props?.currentSeries,
                    options: {
                        ...prev.options,
                        ...props.options,
                        navigator: {
                            ...prev.options.navigator,
                            xAxis: {
                                labels: {
                                    style: {
                                        color: textColor || 'black',
                                        textOutline: 'none',
                                    },
                                },
                            },
                        },
                    },
                })),
            commonSettings,
            limit: commonSettings?.limit,
            themeColors: { background: backgroundColor, color: color || textColor },
        })
    }, [
        // legend,
        axisProps,
        attrBlockProps,
        commonSettings?.limit,
        commonSettings?.dateIntervals,
        color,
        textColor,
        // objectAttributes
    ])

    useInterval(
        () => {
            setStatus('loading')
            getOAseries({
                status,
                setStatus: (status) => setStatus(status),
                axisProps,
                OAttrs: getAttrsFromBaseForm() ?? [],
                dateIntervals: commonSettings?.dateIntervals,
                setSeriesAxisState: (props) =>
                    setCompState((prev) => ({
                        seriesData: props?.currentSeries,
                        options: {
                            ...prev.options,
                            ...props.options,
                        },
                    })),
                commonSettings,
            })
        },
        autoUpdate && autoUpdate.enabled ? autoUpdate.time : null
    )

    useLayoutEffect(() => {
        setCompState((prev) => {
            return {
                ...prev,
                options: {
                    ...prev.options,
                    chart: {
                        height,
                        backgroundColor: backgroundColor || '#ffffff',
                    },
                    legend: {
                        ...prev.options.legend,
                        itemStyle: {
                            color: color || textColor,
                        },
                    },
                    rangeSelector: {
                        ...prev.options.rangeSelector,
                        labelStyle: {
                            color: color || textColor,
                        },
                    },
                },
            }
        })
    }, [height, backgroundColor, color, textColor])

    useEffect(() => {
        setCompState((prev) => {
            return {
                ...prev,
                options: {
                    ...prev.options,
                    legend: {
                        ...prev.options.legend,
                        ...setLegendPosition(legend.position),
                        // verticalAlign: 'top',
                        layout: legend.layout,
                        maxHeight: height * 0.8,
                        width: commonSettings?.legendWidth ?? 200,
                    },
                },
            }
        })
    }, [
        legend,
        height,
        commonSettings?.legendWidth,
        // axisProps,
    ])

    return (
        <div style={{ height }}>
            <AxisPropsController axisProps={axisProps} height={height} backgroundColor={backgroundColor}>
                <StatusController status={status} height={height} backgroundColor={backgroundColor}>
                    <SeriesController seriesData={compState.seriesData}>
                        <ErrorDataController seriesData={compState.seriesData} backgroundColor={backgroundColor}>
                            <EmptyDataController
                                seriesData={compState.seriesData}
                                height={height}
                                backgroundColor={backgroundColor}
                            >
                                <ECMultipleChart
                                    seriesData={compState.seriesData}
                                    customOptions={compState.options}
                                    height={height}
                                />
                            </EmptyDataController>
                        </ErrorDataController>
                    </SeriesController>
                </StatusController>
            </AxisPropsController>
        </div>
    )
}

// const MultipleChartContainer = memo(MultipleChartContainerComponent)
const MultipleChartContainer = memo(MultipleChartContainerComponent, (prevProps, nextProps) => {
    const equality = _.isEqual(prevProps, nextProps)

    if (!equality) {
        // console.log('prevProps', prevProps)
        // console.log('nextProps', nextProps)
    }

    return equality
    // return prevProps.OAttrs.map(it => `${it.id}`).join('.') === nextProps.OAttrs.map(it => `${it.id}`).join('.') &&
    //     prevProps.commonSettings.dateIntervals.join('.') === nextProps.commonSettings.dateIntervals.join('.') &&
    //     prevProps.commonSettings?.limit === nextProps.commonSettings?.limit
})

export default MultipleChartContainer

//////////////////////////////////////////////////
const CenteringWrapper: FC<
    PropsWithChildren<{
        styles?: React.CSSProperties
        backgroundColor?: string
    }>
> = ({ children, styles, backgroundColor }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: backgroundColor ?? '#ffffff',
                ...styles,
            }}
            className="centering-wrapper"
        >
            {children}
        </div>
    )
}

const StatusController: FC<
    PropsWithChildren<{
        status: TLoadingStatus
        height?: number
        backgroundColor?: string
    }>
> = ({ children, status, height, backgroundColor }) => {
    return (
        <CenteringWrapper styles={{ height: height }} backgroundColor={backgroundColor}>
            {['idle', 'loading'].includes(status) ? (
                <ECLoader
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: `${height}px`,
                        backgroundColor: backgroundColor || '#ffffff',
                    }}
                />
            ) : (
                children
            )}
        </CenteringWrapper>
    )
}

const AxisPropsController: FC<
    PropsWithChildren<{
        axisProps: IMultipleChartContainerProps['axisProps']
        height?: number
        backgroundColor?: string
    }>
> = ({ children, axisProps, height, backgroundColor }) => {
    const length = axisProps?.reduce((acc, axis) => [...acc, ...axis.attributeIds], []).length

    return (
        <CenteringWrapper styles={{ height: height }} backgroundColor={backgroundColor}>
            {length === 0 ? 'Выберите измерение для отображения' : children}
        </CenteringWrapper>
    )
}

const SeriesController: FC<
    PropsWithChildren<{
        seriesData: Highcharts.SeriesLineOptions[]
    }>
> = ({ children, seriesData }) => (
    <CenteringWrapper>{seriesData.length === 0 ? 'Нет измерений' : children}</CenteringWrapper>
)

const ErrorDataController: FC<
    PropsWithChildren<{
        seriesData: Highcharts.SeriesLineOptions[]
        backgroundColor?: string
    }>
> = ({ children, seriesData, backgroundColor }) => {
    const seriesWithErrors = seriesData.filter((serie) => serie.custom?.error) ?? []

    if (seriesWithErrors.length === seriesData.length) {
        return (
            <CenteringWrapper
                backgroundColor={backgroundColor}
                styles={{
                    flexDirection: 'column',
                    gap: 5,
                }}
            >
                <div>При загрузке следующих измерений возникли ошибки. Пожалуйста, перезагрузите страницу</div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                        justifyContent: 'start',
                    }}
                >
                    {seriesData.map((serie, idx) => {
                        if (serie.custom?.error) {
                            return (
                                <div key={serie.custom?.attr.id + '-' + idx}>
                                    {idx + 1}. {serie.custom?.attr.name} [{serie.custom?.attr.id}]
                                </div>
                            )
                        }
                    })}
                </div>
            </CenteringWrapper>
        )
    }

    return <CenteringWrapper>{children}</CenteringWrapper>
}

const EmptyDataController: FC<
    PropsWithChildren<{
        seriesData: Highcharts.SeriesLineOptions[]
        height?: number
        backgroundColor?: string
    }>
> = ({ children, seriesData, height, backgroundColor }) => (
    <CenteringWrapper
        backgroundColor={backgroundColor}
        styles={{
            height: `${height}px`,
        }}
    >
        {seriesData.every((serie) => serie.data?.length === 0) ? 'Нет данных для отображения' : children}
    </CenteringWrapper>
)