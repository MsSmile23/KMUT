// import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import { IWidgetObjectLinkedSharesFormProps } from './WidgetObjectLinkedSharesForm';
import { TWidgetSettings } from '../widget-types'
import { initialViewPropsValues } from './initialViewProps';

export const objectLinkedSharesFormInitValues: IWidgetObjectLinkedSharesFormProps = {
    parentClass: null,
    parentObjectId: null,
    objectId: undefined,
    entityType: 'objects',
    objectAttributeIds: [],
    groupingType: undefined,
    groupingClass: undefined,
    // groupingType: 'class',
    dividingCriteria: 'states',
    classes: [{
        target: [],
        linking: []
    }],
    ids: {
        target: [],
        linking: []
    },
    countInRow: 2,
    representationType: 'pieChart',
    viewProps: initialViewPropsValues('pieChart'),
    dividingCriteriaProps: {
        attribute_id: undefined
    },
    showFilters: false, 
    linkedObjectsClasses: undefined,
    linkedObjects: undefined
}

const oldWidgetViewPropsKeys = [
    'height', 
    'width', 
    'chartRatio', 
    'legendRatio', 
    'chartTitle', 
    'legendEnabled', 
    'iconColor', 
    'rightFromTitleView', 
    'rightFromProgressBarView', 
    'precentType',
    'directionViewPorts'
]


// eslint-disable-next-line max-len
export const generateNewViewProps = (widgetData: IWidgetObjectLinkedSharesFormProps): IWidgetObjectLinkedSharesFormProps['viewProps'] => {
    if (!widgetData.viewProps) {
        return Object.keys(widgetData).reduce((viewProps, widgetKey) => {

            if (oldWidgetViewPropsKeys.includes(widgetKey)) {
                viewProps[widgetKey] = widgetData[widgetKey];
            }

            return viewProps;
        }, {})
    }
}

// eslint-disable-next-line max-len
export const clearOldViewProps = (widgetData: IWidgetObjectLinkedSharesFormProps): TWidgetSettings['settings']['widget'] => {
    return Object.keys(widgetData).reduce((widget, widgetKey) => {

        if (!oldWidgetViewPropsKeys.includes(widgetKey)) {
            widget[widgetKey] = widgetData[widgetKey];
        }
        

        return widget;
    }, {})
}