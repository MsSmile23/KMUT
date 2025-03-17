/* eslint-disable max-len */
import { parseJSON } from '@shared/utils/common'
import { TWidget, TWidgetGroup } from './widget-types'
import React from 'react'
import ProjectsMapRegions from './Projects/ProjectsMapRegions/ProjectsMapRegions'
import ProjectsMapRegionsForm from './Projects/ProjectsMapRegionsForm/ProjectsMapRegionsForm'
import ProjectNetUtilization from './Projects/ProjectNetUtilization/ProjectNetUtilization'
import ProjectNetUtilizationForm from './Projects/ProjectNetUtilizationForm/ProjectNetUtilizationForm'


const WidgetAIsaev = React.lazy(() => import('./WidgetAIsaev/WidgetAIsaev'))
const WidgetAIsaevForm = React.lazy(() => import('./WidgetAIsaev/WidgetAIsaevForm'))

const SimpleReports = React.lazy(() => import('./Projects/SimpleReports/SimpleReports'))
const SimpleReportsForm = React.lazy(() => import('./Projects/SimpleReports/SimpleReportsForm'))

const WidgetReports2 = React.lazy(() => import('./WidgetReports2/WidgetReports2'))
const WidgetReportsForm2 = React.lazy(() => import('./WidgetReports2/WidgetReportsForm2'))

const WidgetNetflowTable = React.lazy(() => import('./WidgetNetflowTable/WidgetNetflowTable'))
const WidgetNetflowTableForm = React.lazy(() => import('./WidgetNetflowTable/WidgetNetflowTableForm'))

const WidgetActivePortsFromAttribute = React.lazy(() => import('./WidgetActivePortsFromAttribute/WidgetActivePortsFromAttribute'))
const WidgetActivePortsFromAttributeForm = React.lazy(() => import('./WidgetActivePortsFromAttribute/WidgetActivePortsFromAttributeForm'))

const WidgetObjectToolbar = React.lazy(() => import('./WidgetObjectToolbar/WidgetObjectToolbar'))
const WidgetObjectToolbarForm = React.lazy(() => import('./WidgetObjectToolbar/WidgetObjectToolbarForm'))

const WidgetStatusMain = React.lazy(() => import('./WidgetStatusMain/WidgetStatusMain'))
const WidgetStatusMainForm = React.lazy(() => import('./WidgetStatusMain/WidgetStatusMainForm'))

const WidgetObjectCables = React.lazy(() => import ('./WidgetObjectCables/WidgetObjectCables'))
const WidgetObjectCablesForm = React.lazy(() => import ('./WidgetObjectCables/WidgetObjectCablesForm'))

const WidgetObjectAttributesAndChildStates = React.lazy(() => import('./WidgetObjectAttributesAndChildStates/WidgetObjectAttributesAndChildStates'))
const WidgetObjectAttributesAndChildStatesFrom = React.lazy(() => import('./WidgetObjectAttributesAndChildStates/WidgetObjectAttributesAndChildStatesForm'))

const WidgetObjectAttributes = React.lazy(() => import('./WidgetObjectAttributes/WidgetObjectAttributes'))
const WidgetObjectAttributesForm = React.lazy(() => import('./WidgetObjectAttributes/WidgetObjectAttributesForm'))

const WidgetStateHistory = React.lazy(() => import('./WidgetStateHistory/WidgetStateHistory'))
const WidgetStateHistoryForm = React.lazy(() => import('./WidgetStateHistory/WidgetStateHistoryForm'))

// Удалить дубль
// const WidgetObjectStateContainer = React.lazy(() => import('./WidgetObjectStateContainer/WidgetObjectStateContainer'))
// const WidgetObjectStateContainerForm = React.lazy(() => import('./WidgetObjectStateContainer/WidgetObjectStateContainerForm'))

const WidgetObjectAdvancedLinkedClassesTable = React.lazy(() => import('./WidgetObjectAdvancedLinkedClassesTable/WidgetObjectAdvancedLinkedClassesTable'))
const WidgetObjectAdvancedLinkedClassesTableForm = React.lazy(() => import('./WidgetObjectAdvancedLinkedClassesTable/WidgetObjectAdvancedLinkedClassesTableForm'))

// Удалить дубль [
// const WidgetOATableWithAggregation = React.lazy(() => import('./WidgetOATableWithAggregation/WidgetOATableWithAggregation'))
// const WidgetOATableWithAggregationForm = React.lazy(() => import('./WidgetOATableWithAggregation/WidgetOATableWithAggregationForm'))
// ]

const WidgetAttributesWithHistoryView = React.lazy(() => import('./WidgetAttributesWithHistoryView/WidgetAttributesWithHistoryView'))
const WidgetAttributesWithHistoryViewForm = React.lazy(() => import('./WidgetAttributesWithHistoryView/WidgetAttributesWithHistoryViewForm'))

const WidgetObjectOAttrsForm = React.lazy(() => import('./WidgetObjectOAttrs/WidgetObjectOAttrsForm'))
const WidgetObjectOAttrs = React.lazy(() => import('./WidgetObjectOAttrs/WidgetObjectOAttrs'))

const WidgetObjectLinkedObjectsRackViewForm = React.lazy(() => import('./WidgetObjectLinkedObjectsRackView/WidgetObjectLinkedObjectsRackViewForm'))
const WidgetObjectLinkedObjectsRackView = React.lazy(() => import('./WidgetObjectLinkedObjectsRackView/WidgetObjectLinkedObjectsRackView'))

const WidgetObjectOAttrsWithHistory = React.lazy(() => import('./WidgetObjectOAttrsWithHistory/WidgetObjectOAttrsWithHistory'))
const WidgetObjectOAttrsWithHistoryForm = React.lazy(() => import('./WidgetObjectOAttrsWithHistory/WidgetObjectOAttrsWithHistoryForm'))

const WidgetObjectLinkedShares = React.lazy(() => import('./WidgetObjectLinkedShares/WidgetObjectLinkedShares'))
const WidgetObjectLinkedSharesForm = React.lazy(() => import('./WidgetObjectLinkedShares/WidgetObjectLinkedSharesForm'))

const WidgetObjectsInOutHistory = React.lazy(() => import('./WidgetObjectsInOutHistory/WidgetObjectsInOutHistory'))
const WidgetObjectsInOutHistoryForm = React.lazy(() => import('./WidgetObjectsInOutHistory/WidgetObjectsInOutHistoryForm'))

const WidgetObjectOAttrsWithAggregationTable = React.lazy(() => import('./WidgetObjectOAttrsWithAggregationTable/WidgetObjectOAttrsWithAggregationTable'))
const WidgetObjectOAttrsWithAggregationTableForm = React.lazy(() => import('./WidgetObjectOAttrsWithAggregationTable/WidgetObjectOAttrsWithAggregationTableForm'))

const WidgetObjectSummary = React.lazy(() => import('./WidgetObjectSummary/WidgetObjectSummary'))
const WidgetObjectSummaryForm = React.lazy(() => import('./WidgetObjectSummary/WidgetObjectSummaryForm'))

const WidgetObjectStateHistory = React.lazy(() => import('./WidgetObjectStateHistory/WidgetObjectStateHistory'))
const WidgetObjectStateHistoryForm = React.lazy(() => import('./WidgetObjectStateHistory/WidgetObjectStateHistoryForm'))

const WidgetObjectLinkedGroupedStates = React.lazy(() => import('./WidgetObjectLinkedGroupedStates/WidgetObjectLinkedGroupedStates'))
const WidgetObjectLinkedGroupedStatesForm = React.lazy(() => import('./WidgetObjectLinkedGroupedStates/WidgetObjectLinkedGroupedStatesForm'))

const WidgetObjectСableTable = React.lazy(() => import('./ObjectСableTableWidget/ObjectСableTableWidget'))
const WidgetObjectСableTableForm = React.lazy(() => import('./ObjectСableTableWidget/ObjectСableTableWidgetForm'))

const WidgetObjectCableMap = React.lazy(() => import('./WidgetObjectCableMap/WidgetObjectCableMap'))
const WidgetObjectCableMapForm = React.lazy(() => import('./WidgetObjectCableMap/WidgetObjectCableMapForm'))


const WidgetObjectsLinkedTable = React.lazy(() => import('./WidgetObjectsLinkedTable/WidgetObjectsLinkedTable'))
const WidgetObjectsLinkedTableForm = React.lazy(() => import('./WidgetObjectsLinkedTable/WidgetObjectsLinkedTableForm'))

const WidgetObjectsMap = React.lazy(() => import('./WidgetObjectsMap/WidgetObjectsMap'))
const WidgetObjectsMapForm = React.lazy(() => import('./WidgetObjectsMap/WidgetObjectsMapForm'))

const WidgetObjectOAttrStateWithAggregation = React.lazy(() => import('./WidgetObjectOAttrStateWithAggregation/WidgetObjectOAttrStateWithAggregation'))
const WidgetObjectOAttrStateWithAggregationForm = React.lazy(() => import('./WidgetObjectOAttrStateWithAggregation/WidgetObjectOAttrStateWithAggregationForm'))

const WidgetObjectOAttrState = React.lazy(() => import('./WidgetObjectOAttrState/WidgetObjectOAttrState'))
const WidgetObjectOAttrStateForm = React.lazy(() => import('./WidgetObjectOAttrState/WidgetObjectOAttrStateForm'))

const WidgetObjectsWithOAStates = React.lazy(() => import('./WidgetObjectsWithOAStates/WidgetObjectsWithOAStates'))  
const WidgetObjectsWithOAStatesForm =   React.lazy(() => import('./WidgetObjectsWithOAStates/WidgetObjectsWithOAStatesForm'))

const WidgetPageHeader = React.lazy(() => import('./WidgetPageHeader/WidgetPageHeader'))
const WidgetPageHeaderForm = React.lazy(() => import('./WidgetPageHeader/WidgetPageHeaderForm'))

const WidgetReports = React.lazy(() => import('./WidgetReports/WidgetReports'))
const WidgetReportsForm = React.lazy(() => import('./WidgetReports/WidgetReportsForm'))

const WidgetMultipleChart = React.lazy(() => import('./WidgetMultipleChart/WidgetMultipleChart'))
const WidgetMultipleChartForm = React.lazy(() => import('./WidgetMultipleChart/WidgetMultipleChartForm'))

const WidgetObjectsCount = React.lazy(() => import('./WidgetObjectsCount/WidgetObjectsCount'))
const WidgetObjectsCountForm = React.lazy(() => import('./WidgetObjectsCount/WidgetObjectsCountForm'))

const WidgetIpCamera = React.lazy(() => import ('./WidgetIpCamera/WidgetIpCamera'))
const WidgetIpCameraForm = React.lazy(() => import ('./WidgetIpCamera/WidgetIpCameraForm'))

const WidgetObjectsOverImage = React.lazy(() => import('./WidgetObjectsOverImage/WidgetObjectsOverImage'))
const WidgetObjectsOverImageForm = React.lazy(() => import('./WidgetObjectsOverImage/WidgetObjectsOverImageForm'))

const WidgetTopTickets = React.lazy(() => import('./WidgetTopTickets/WidgetTopTickets'))
const WidgetTopTicketsForm = React.lazy(() => import('./WidgetTopTickets/WidgetTopTicketsForm'))

const WidgetInterfacesTable = React.lazy(() => import('./WidgetInterfacesTable/WidgetInterfacesTable'))
const WidgetInterfacesTableForm = React.lazy(() => import('./WidgetInterfacesTable/WidgetInterfacesTableForm'))

// const WidgetMeasuredAttributes = React.lazy(() => import('./WidgetMeasuredAttributes/WidgetMeasuredAttributes'))
// const WidgetMeasuredAttributesForm = React.lazy(() => import('./WidgetMeasuredAttributes/WidgetMeasuredAttributesForm'))

const WidgetCenterAnalysisMetrics = React.lazy(() => import('./WidgetCenterAnalysisMetrics/WidgetCenterAnalysisMetrics'))
const WidgetCenterAnalysisMetricsForm = React.lazy(() => import('./WidgetCenterAnalysisMetrics/WidgetCenterAnalysisMetricsForm'))

// const WidgetObjectTree = React.lazy(() => import('./WidgetObjectTree/WidgetObjectTree'))
// const WidgetObjectTreeForm = React.lazy(() => import('./WidgetObjectTree/WidgetObjectTreeForm'))

const WidgetDiscoveryTable = React.lazy(() => import('./WidgetDiscoveryTable/WidgetDiscoveryTable'))
const WidgetDiscoveryTableForm = React.lazy(() => import('./WidgetDiscoveryTable/WidgetDiscoveryTableForm'))

const WidgetIncidentsListForm = React.lazy(() => import('./WidgetIncidentsList/WidgetIncidentsListForm'))
const WidgetIncidentsList = React.lazy(() => import('./WidgetIncidentsList/WidgetIncidentsList'))

const WidgetStaticTable = React.lazy(() => import('./WidgetStaticTable/WidgetStaticTable'))
const WidgetStaticTableForm = React.lazy(() => import('./WidgetStaticTable/WidgetStaticTableForm'))

const WidgetHeaderMobile = React.lazy(() => import('./WidgetHeaderMobile/WidgetHeaderMobile'))
const WidgetHeaderMobileForm = React.lazy(() => import('./WidgetHeaderMobile/WidgetHeaderMobileForm'))

const WidgetAttributeValue = React.lazy(() => import('./WidgetAttributeValue/WidgetAttributeValue'))
const WidgetAttributeValueForm = React.lazy(() => import('./WidgetAttributeValue/WidgetAttributeValueForm'))

const WidgetObjectStatesWithHierarchy = React.lazy(() => import('./WidgetObjectStatesWithHierarchy/WidgetObjectStatesWithHierarchy'))
const WidgetObjectStatesWithHierarchyForm = React.lazy(() => import('./WidgetObjectStatesWithHierarchy/WidgetObjectStatesWithHierarchyForm'))

const WidgetMiniHeader = React.lazy(() => import('./WidgetMiniHeader/WidgetMiniHeader'))
const WidgetMiniHeaderForm = React.lazy(() => import('./WidgetMiniHeader/WidgetMiniHeaderForm'))

const WidgetTestMarkoDev = React.lazy(() => import('./WidgetTestMarko/WidgetTestMarkoDev'))
const WidgetTestMarkoDevForm = React.lazy(() => import('./WidgetTestMarko/WidgetTestMarkoDevForm'))

const WidgetProjectMain = React.lazy(() => import('./Projects/ProjectMain/ProjectMain'))
const WidgetProjectMainForm = React.lazy(() => import('./Projects/ProjectMainForm/ProjectMainForm'))

const WidgetProjectsMapRegions = React.lazy(() => import('./Projects/ProjectsMapRegions/ProjectsMapRegions'))
const WidgetProjectsMapRegionsForm = React.lazy(() => import('./Projects/ProjectsMapRegionsForm/ProjectsMapRegionsForm'))


const WidgetUserActivity = React.lazy(() => import('./WidgetUserActivity/WidgetUserActivity'))
const WidgetUserActivityForm = React.lazy(() => import('./WidgetUserActivity/WidgetUserActivityForm'))

const WidgetProjectNetUtilization = React.lazy(() => import('./Projects/ProjectNetUtilization/ProjectNetUtilization'))
const WidgetProjectNetUtilizationForm = React.lazy(() => import('./Projects/ProjectNetUtilizationForm/ProjectNetUtilizationForm'))

const WidgetProjectHome = React.lazy(() => import('./Projects/ProjectHome/ProjectHome'))
const WidgetProjectHomeForm = React.lazy(() => import('./Projects/ProjectHome/ProjectHomeForm'))


export enum WIDGET_TYPES {
    WIDGET_TYPE_SHOW = 'widgetShow',
    WIDGET_TYPE_FORM = 'widgetForm',
    WIDGET_TYPE_PREVIEW = 'widgetPreview'
}

export const WIDGET_GROUP: TWidgetGroup[] = [{
    id: 1, //уникальный номер группы
    name: '', //название
    order: 1, //Порядок отображения группы
}] /* as const */

const themeName = parseJSON(localStorage.getItem('themeStore'))?.state?.themeName

export const WIDGETS: TWidget[] = [
    {
        mnemo: 'main.deviceStatuses', 
        name: 'Статусы оборудования на главной', 
        preview: WidgetStatusMain, 
        groupIds: [ WIDGET_GROUP[0].id], 
        components: {
            widget: WidgetStatusMain,
            form: WidgetStatusMainForm, 
        },
        purposeMaket: [3, 4]
    },
    // {
    //     mnemo: 'object.ObjectCables', 
    //     name: 'Кабельный журнал Объекта', 
    //     preview: WidgetObjectCables, 
    //     groupIds: [ WIDGET_GROUP[0].id], 
    //     components: {
    //         widget: WidgetObjectCables,
    //         form: WidgetObjectCablesForm, 
    //     }
    // },
    // {
    //     mnemo: 'object.ObjectAttributesAndChildStates', 
    //     name: 'Виджет здания (атрибуты, услуги, оборудование)', 
    //     preview: WidgetObjectAttributesAndChildStates, 
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetObjectAttributesAndChildStates,
    //         form: WidgetObjectAttributesAndChildStatesFrom, 
    //     }
    // },
    // {
    //     mnemo: 'object.ObjectAttributesWidget', 
    //     name: 'Виджет Атрибутов Объекта', 
    //     preview: WidgetObjectAttributes, 
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetObjectAttributes,
    //         form: WidgetObjectAttributesForm, 
    //     }
    // },
    // {
    //     mnemo: 'states.StateHistory', 
    //     name: 'Виджет История статусов', 
    //     preview: WidgetStateHistory, 
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetStateHistory,
    //         form: WidgetStateHistoryForm,
    //     }
    // },
    // {
    //     mnemo: 'object.ObjectsLinkedTable', 
    //     name: 'Виджет Таблицы связанные объекты', 
    //     preview: WidgetObjectAdvancedLinkedClassesTable, 
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetObjectAdvancedLinkedClassesTable,
    //         form: WidgetObjectAdvancedLinkedClassesTableForm, 
    //     }
    // },
    // Удалить дубль [
    // {
    //     mnemo: 'object.OATableWithAggregation', 
    //     name: 'Виджет Таблица метрик', 
    //     preview: WidgetOATableWithAggregation, 
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetOATableWithAggregation,
    //         form: WidgetOATableWithAggregationForm, 
    //     }
    // },
    // ]
    // {
    //     mnemo: 'attributes.AttributesWithHistoryView', 
    //     name: 'Виджет Графики измерений', 
    //     preview: WidgetAttributesWithHistoryView, 
    //     groupIds: [ WIDGET_GROUP[0].id ],
    //     components: {
    //         widget: WidgetAttributesWithHistoryView,
    //         form: WidgetAttributesWithHistoryViewForm, 
    //     }
    // },
    {
        mnemo: 'object.ObjectOAttrsWidget', 
        name: 'Свойства объекта', 
        preview: WidgetObjectOAttrs, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectOAttrs,
            form: WidgetObjectOAttrsForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'object.ObjectLinkedObjectsRackView', 
        name: 'Телекоммуникационные стойки/стойка', 
        preview: WidgetObjectLinkedObjectsRackView, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectLinkedObjectsRackView,
            form: WidgetObjectLinkedObjectsRackViewForm, 
        }
    },
    {
        mnemo: 'object.ObjectsInOutHistory', 
        name: 'Динамика инцидентов', 
        preview: WidgetObjectsInOutHistory, 
        groupIds: [ WIDGET_GROUP[0].id ],
        components: {
            widget: WidgetObjectsInOutHistory,
            form: WidgetObjectsInOutHistoryForm, 
        }
    },
    {
        mnemo: 'object.ObjectOAttrsWithHistory', 
        name: 'Измеряемые атрибуты', 
        preview: WidgetObjectOAttrsWithHistory, 
        groupIds: [ WIDGET_GROUP[0].id ],
        components: {
            widget: WidgetObjectOAttrsWithHistory,
            form: WidgetObjectOAttrsWithHistoryForm, 
        },
        purposeMaket: [3, 4]
    },
    // {
    //     mnemo: 'object.MeasuredAttributes', 
    //     name: 'Измеряемые атрибуты тестовый', 
    //     preview: WidgetMeasuredAttributes, 
    //     groupIds: [ WIDGET_GROUP[0].id ],
    //     components: {
    //         widget: WidgetMeasuredAttributes,
    //         form: WidgetMeasuredAttributesForm, 
    //     }
    // },
    {
        mnemo: 'object.ObjectOAttrsWithAggregationTable', 
        name: 'Таблица метрик', 
        preview: WidgetObjectOAttrsWithAggregationTable, 
        groupIds: [ WIDGET_GROUP[0].id ],
        components: {
            widget: WidgetObjectOAttrsWithAggregationTable,
            form: WidgetObjectOAttrsWithAggregationTableForm, 
        }
    },
    {
        mnemo: 'object.WidgetObjectStateHistory', 
        name: 'История статусов', 
        preview: WidgetObjectStateHistory, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectStateHistory,
            form: WidgetObjectStateHistoryForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'object.ObjectLinkedShares', 
        name: 'Доли связанных объектов', 
        preview: WidgetObjectLinkedShares, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectLinkedShares,
            form: WidgetObjectLinkedSharesForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'object.ObjectSummary', 
        name: 'Информация и статусы объекта', 
        preview: WidgetObjectSummary, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectSummary,
            form: WidgetObjectSummaryForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'object.ObjectLinkedGroupedStates', 
        name: 'Статусы дочерних объектов с группировкой', 
        preview: WidgetObjectLinkedGroupedStates, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectLinkedGroupedStates,
            form: WidgetObjectLinkedGroupedStatesForm, 
        }
    },
    {
        mnemo: 'object.WidgetObjectСableTable', 
        name: 'Кабельный журнал', 
        preview: WidgetObjectСableTable, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectСableTable,
            form: WidgetObjectСableTableForm, 
        }
    },
    {
        mnemo: 'object.WidgetObjectCableMap', 
        name: 'Карта сети', 
        preview: WidgetObjectCableMap, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectCableMap,
            form: WidgetObjectCableMapForm, 
        }
    },
    {

        mnemo: 'object.WidgetObjectsLinkedTable', 
        name: 'Таблица связанных объектов', 
        preview: WidgetObjectsLinkedTable, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectsLinkedTable,
            form: WidgetObjectsLinkedTableForm, 
        }
    },
    {
        mnemo: 'object.ObjectsMap2', 
        name: 'Карта объектов', 
        preview: WidgetObjectsMap, 
        groupIds: [ WIDGET_GROUP[0].id], 
        components: {
            widget: WidgetObjectsMap,
            form: WidgetObjectsMapForm,
        },
        purposeMaket: [3, 4] 
    },
    {
        mnemo: 'object.ObjectOAttrStateWithAggregation', 
        name: 'Атрибуты истории с агрегацией', 
        preview: WidgetObjectOAttrStateWithAggregation, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectOAttrStateWithAggregation,
            form: WidgetObjectOAttrStateWithAggregationForm, 
        }
    },
    {
        mnemo: 'object.ObjectOAttrState', 
        name: 'Объекты со статусами', 
        preview: WidgetObjectOAttrState, 
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectOAttrState,
            form: WidgetObjectOAttrStateForm, 
        }
    }, 
    {
        mnemo: 'object.ObjectOAStates', 
        name: 'Таблица объектов с измерениями', 
        preview: WidgetObjectsWithOAStates,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectsWithOAStates,
            form: WidgetObjectsWithOAStatesForm, 
        }
    },
    {
        mnemo: 'pageHeader', 
        name: 'Шапка страницы', 
        preview: WidgetPageHeader,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetPageHeader,
            form: WidgetPageHeaderForm, 
        }
    },
    {
        mnemo: 'reports', 
        name: 'Таблица отчётов', 
        preview: WidgetReports,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetReports,
            form: WidgetReportsForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'object.ObjectsOverImage', 
        name: 'Объекты на схеме', 
        preview: WidgetObjectsOverImage,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectsOverImage,
            form: WidgetObjectsOverImageForm, 
        }
    },
    {
        mnemo: 'object.ObjectsCount', 
        name: 'Количество объектов', 
        preview: WidgetObjectsCount,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectsCount,
            form: WidgetObjectsCountForm, 
        }
    },
    {
        mnemo: 'ipCamera', 
        name: 'Айпи камера', 
        preview: WidgetIpCamera,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetIpCamera,
            form: WidgetIpCameraForm, 
        }
    },
    {
        mnemo: 'multipleChart', 
        name: 'Мультиграфик', 
        preview: WidgetMultipleChart,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetMultipleChart,
            form: WidgetMultipleChartForm, 
        }
    },
    {
        mnemo: 'topTickets', 
        name: 'Виджет Агрегированных измерений', 
        preview: WidgetTopTickets,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetTopTickets,
            form: WidgetTopTicketsForm, 
        }
    },
    {
        mnemo: 'InterfacesTable', 
        name: 'Таблица интерфейсов', 
        preview: WidgetInterfacesTable,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetInterfacesTable,
            form: WidgetInterfacesTableForm, 
        }
    },
    {
        mnemo: 'ObjectToolbar', 
        name: 'Тулбар объектов', 
        preview: WidgetObjectToolbar,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectToolbar,
            form: WidgetObjectToolbarForm, 
        }
    },
    {
        mnemo: 'CenterAnalysisMetrics', 
        name: 'Центр анализа метрик', 
        preview: WidgetCenterAnalysisMetrics,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetCenterAnalysisMetrics,
            form: WidgetCenterAnalysisMetricsForm, 
        }
    },
    // {
    //     mnemo: 'ObjectTree', 
    //     name: 'Дерево объектов', 
    //     preview: WidgetObjectTree,
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetObjectTree,
    //         form: WidgetObjectTreeForm, 
    //     }
    // },
    {
        mnemo: 'ActivePortsFromAttribute', 
        name: 'Активные порты', 
        preview: WidgetActivePortsFromAttribute,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetActivePortsFromAttribute,
            form: WidgetActivePortsFromAttributeForm,
        }
    },
    {
        mnemo: 'discoveryTable', 
        name: 'Таблица обнаруженных устройств', 
        preview: WidgetDiscoveryTable,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetDiscoveryTable,
            form: WidgetDiscoveryTableForm, 
        }
    },
    {
        mnemo: 'servi', 
        name: 'Таблица обнаруженных устройств', 
        preview: WidgetDiscoveryTable,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetDiscoveryTable,
            form: WidgetDiscoveryTableForm, 
        }
    },
    {
        mnemo: 'staticTable', 
        name: 'Статичная таблица', 
        preview: WidgetStaticTable,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetStaticTable,
            form: WidgetStaticTableForm, 
        }
    },
    {
        mnemo: 'headerMobile', 
        name: 'Шапка страницы МП', 
        preview: WidgetHeaderMobile,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetHeaderMobile,
            form: WidgetHeaderMobileForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'incidents.List', 
        name: 'Таблица инцидентов', 
        preview: WidgetIncidentsList,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetIncidentsList,
            form: WidgetIncidentsListForm, 
        },
        purposeMaket: [3, 4]
    },
    //* Моковый виджет для настройки дерева объектов на мобилке
    {
        mnemo: 'objects.ObjectsList', 
        name: 'Дерево объектов', 
        preview: WidgetIncidentsList,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetIncidentsList,
            form: WidgetIncidentsListForm, 
        },
        purposeMaket: [3, 4]
    },

    {
        mnemo: 'attributeValue', 
        name: 'Значение атрибута', 
        preview: WidgetAttributeValue,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetAttributeValue,
            form: WidgetAttributeValueForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'ObjectStatesWithHierarchy', 
        name: 'Статусы объектов с иерархией', 
        preview: WidgetObjectStatesWithHierarchy,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetObjectStatesWithHierarchy,
            form: WidgetObjectStatesWithHierarchyForm, 
        },
        purposeMaket: [3, 4]
    },
    {
        mnemo: 'miniHeader', 
        name: 'Мини шапка', 
        preview: WidgetMiniHeader,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetMiniHeader,
            form: WidgetMiniHeaderForm, 
        }
    },
    {
        mnemo: 'netflowTable', 
        name: 'Анализ трафика', 
        preview: WidgetNetflowTable,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetNetflowTable,
            form: WidgetNetflowTableForm,
        }
    },
    {
        mnemo: 'reports2', 
        name: 'Отчёты', 
        preview: WidgetReports2,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetReports2,
            form: WidgetReportsForm2,
        }
    },
    {

        mnemo: 'projectMain', 
        name: `Проект ${themeName ?? ''}:Главная`, 
        preview: WidgetReports2,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetProjectMain,
            form: WidgetProjectMainForm,

        }
    },
    {
        mnemo: 'projectMapRegions',
        name: `Проект ${themeName ?? ''}:Визуализация регионов`,
        preview: WidgetProjectsMapRegions,
        groupIds: [ WIDGET_GROUP[0].id ],
        components: {
            widget: WidgetProjectsMapRegions,
            form: WidgetProjectsMapRegionsForm,
        }
    },
    {
        mnemo: 'netUtilization',
        name: `Проект ${themeName ?? ''}:Утилизация сети`,
        preview: WidgetReports2,
        groupIds: [ WIDGET_GROUP[0].id ],
        components: {
            widget: WidgetProjectNetUtilization,
            form: WidgetProjectNetUtilizationForm,
        }
    },
    {
        mnemo: 'reports.SimpleReports', 
        name: 'Отчёты с типами-кнопками', 
        preview: SimpleReports,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: SimpleReports,
            form: SimpleReportsForm,
        }
    },
    {
        mnemo: 'projectHome', 
        name: 'Домашняя страница', 
        preview: WidgetProjectHome,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetProjectHome,
            form: WidgetProjectHomeForm,
        }
    },
    {
        mnemo: 'activityUsersTable', 
        name: 'Активность пользователей', 
        preview: SimpleReports,
        groupIds: [ WIDGET_GROUP[0].id ], 
        components: {
            widget: WidgetUserActivity,
            form: WidgetUserActivityForm,
        }
    }
    // {
    //     mnemo: 'aisaevForm',
    //     name: 'Тестовый виджет',
    //     preview: WidgetAIsaev,
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetAIsaev,
    //         form: WidgetAIsaevForm,
    //     }
    // },
    // {
    //     mnemo: 'testWidgetMarkoDev', 
    //     name: 'Тестовый Виджет Марко', 
    //     preview: WidgetTestMarkoDev,
    //     groupIds: [ WIDGET_GROUP[0].id ], 
    //     components: {
    //         widget: WidgetTestMarkoDev,
    //         form: WidgetTestMarkoDevForm,
    //     }
    // },
] /* as const */