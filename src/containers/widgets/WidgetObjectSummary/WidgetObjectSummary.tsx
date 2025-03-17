import { FC, useLayoutEffect, useRef, useState } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { IWidgetObjectSummaryFormProps } from './WidgetObjectSummaryForm'
import ObjectAttributesAndChildStates, { IObjectAttributesAndChildStates } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'

const WidgetObjectSummary: FC<TWidgetFormSettings<IWidgetObjectSummaryFormProps>> = (props) => {

    const { settings } = props
    const { widget, vtemplate } = settings
    const { baseForm, objectLinkedShares, heightOAttrs, objectOAttrs,  objectOAStates  } = widget
    const { /* objectId,  */sectionsToShow, allObjects, width, height,
        titleStateDevice, labelsCount, labelsContainerHeight } = baseForm || {}

    const {
        dividingCriteria, dividingCriteriaProps, parentObjectId, ids, viewProps,
    } = objectLinkedShares || {}
    const { chartRatio, legendRatio, chartTitle, legendEnabled, showNames, showObjectsTable } = viewProps || {}
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [sizes, setSizes] = useState({
        w: 0,
        h: 0
    })

    useLayoutEffect(() => {
        setSizes(state => {
            return {
                ...state,
                w: wrapperRef.current?.clientWidth,
                h: wrapperRef.current?.clientHeight,
            }
        })
    }, [
        wrapperRef.current?.clientWidth,
        wrapperRef.current?.clientHeight
    ])
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const childClsIds = [
        ...forumThemeConfig.main.statuses.chart.childClsIds, 
        ...forumThemeConfig.classesGroups.services
    ]
    const currentObjectId = parentObjectId ?? vtemplate?.objectId
    // const currentObjectId = objectId ?? vtemplate?.objectId
    const chartProps = {
        dividingCriteriaProps,
        representationType: 'pieChart' as const,
        isWidget: true,
        isSingle: true,
        parentObject: getObjectByIndex('id', currentObjectId),
        height: objectLinkedShares?.viewProps?.height ?? sizes.h,
        legendSettings: {
            ...forumThemeConfig.main.deviceStatuses.chart.legendSettings,
            chart: {
                ...forumThemeConfig.main.deviceStatuses.chart.legendSettings.chart,
                height: objectLinkedShares?.viewProps?.height ?? sizes.h
            },
            width: sizes.w - 20,
            chartRatio: chartRatio, 
            legendRatio: legendRatio,
            isEnabled: legendEnabled,
            showNames: showNames ?? false,
         
        },
        width: width,
        dividingCriteria,
        classesIds: ids && ids.target.length > 0
            ? ids.target
            : classesGroups.devices,
        childClsIds: ids && ids.linking.length > 0
            ? ids.linking
            : [...childClsIds, ...classesGroups.services],
        showObjectsTable: showObjectsTable ?? false
    }


    const object = getObjectByIndex('id', (currentObjectId))
    const sections = {
        objectAttributesWidgetProps: {
            oaAtrrWidgetProps: {
                // attributesIds: forumThemeConfig.main.deviceStatuses.attributes.attributeIds,
                objectId: currentObjectId,
                // height: heightOAttrs,
                ...objectOAttrs,
            },
        },
        objectStatusLabelsProps: {
            statusLabelsProps: {
                //!Временно стоят жесткие классы, чтобы ничего не сломалось
                classes_id:
                    objectOAStates?.serviceClasses ?? forumThemeConfig.build.deviceStatuses.stateLabels.classes_id,
                object_id: currentObjectId,
                ...objectOAStates,
            },
        },
        statusChartProps: {
            chartProps: chartProps,
            title: chartTitle,
        },
    } as IObjectAttributesAndChildStates['sections']

    return currentObjectId 
        ? (
            <div 
                ref={wrapperRef}
                style={{ 
                    height: '100%', 
                    width: '100%' 
                }}
            >
                <ObjectAttributesAndChildStates
                    maxWidth={widget.maxWidth} 
                    object={allObjects ? undefined : object} 
                    sectionsToShow={sectionsToShow}
                    sections={sections}
                    mainObject={allObjects}
                    titleStateDevice={titleStateDevice}
                    labelsContainerHeight={labelsContainerHeight}
                    labelsCount={labelsCount}
                />
            </div>
        ) : (
            <div 
                style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%', 
                    width: '100%' 
                }}
            >
                Выберите объект
            </div>
        )
}

export default WidgetObjectSummary