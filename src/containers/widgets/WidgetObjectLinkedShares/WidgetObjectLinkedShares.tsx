import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IWidgetObjectLinkedSharesFormProps } from './WidgetObjectLinkedSharesForm'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { generateNewViewProps } from './utils'
import { Spin } from 'antd'


const WidgetObjectLinkedShares: FC<TWidgetFormSettings<
IWidgetObjectLinkedSharesFormProps
>> = (props) => {
    const { settings } = props

    const { widget, vtemplate } = settings
    const { dividingCriteria, parentObjectId, ids, groupingType,
        entityType, objectAttributeIds, countInRow, groupingClass, 
        representationType = 'pieChart', viewProps, dividingCriteriaProps, 
        linkedObjects, linkedObjectsClasses, showFilters
    } = widget

    const wrapperRef = useRef<HTMLDivElement>(null)
    const [sizes, setSizes] = useState({
        w: 0,
        h: 0
    })
    const [loading, setLoading] = useState(true)
    const newViewProps = viewProps || generateNewViewProps(widget) 
    
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 200)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    // const id = parentObjectId ?? vtemplate?.objectId

    const childClsIds = [
        ...forumThemeConfig.main.statuses.chart.childClsIds, 
        ...forumThemeConfig.classesGroups.services
    ]
    
    const defaultProps = {
        groupingType,
        groupingClass,
        entityType,
        objectAttributeIds,
        countInRow,
        representationType: representationType,
        isSingle: !groupingType,
        parentObject: getObjectByIndex('id', parentObjectId ?? vtemplate?.objectId),
        height: newViewProps?.height || sizes.h,
        width: newViewProps?.width,
        dividingCriteria,
        dividingCriteriaProps,
        classesIds: ids && ids.target.length > 0
            ? ids.target
            : classesGroups.devices,
        childClsIds: ids && ids.linking.length > 0
            ? ids.linking
            : [...childClsIds, ...classesGroups.services],
        linkedObjects: linkedObjects,
        linkedObjectsClasses: linkedObjectsClasses,
        showFilters
    }

    const chartProps = {
        roundDigits: viewProps?.roundDigits,
        legendSettings: {
            ...forumThemeConfig.main.deviceStatuses.chart.legendSettings,
            chart: {
                ...forumThemeConfig.main.deviceStatuses.chart.legendSettings.chart,
                height: newViewProps?.height || sizes.h
            },
            width: sizes.w - 20,
            chartRatio: newViewProps?.chartRatio, 
            legendRatio: newViewProps?.legendRatio,
            isEnabled: newViewProps?.legendEnabled,
            showNames: newViewProps?.showNames,
            showShortName: newViewProps?.showShortName,
            showCategoryTitle: newViewProps?.showCategoryTitle,
            orientation: newViewProps?.orientation
        }
    }

    const viewPropsForObjectLinkedShares = { ...defaultProps, ...chartProps, ...newViewProps }

    return (
        <div 
            ref={wrapperRef}
            style={{ 
                height: '100%',
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {loading ? <Spin size="large" /> : 
                <ObjectLinkedShares  
                    {...viewPropsForObjectLinkedShares} 
                    title={newViewProps?.chartTitle || ''}
                    isWidget
                    width={sizes.w}
                />}
        </div>
    )
}

export default WidgetObjectLinkedShares