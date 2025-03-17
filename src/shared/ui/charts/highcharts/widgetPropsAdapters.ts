import { IWidgetList, IWidgetPropsAdapters } from './types';

export const widgetPropsAdapters: IWidgetPropsAdapters = ({ widgetKey, /* widgetProps */ }) => {
    // console.log('widgetKey', widgetKey)
    // console.log('widgetProps', widgetProps)
    const adaptedOptions: Record<IWidgetList, () => Highcharts.Options> = {
        WIDGET_DENIS_TEST: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_STATUS_CHART: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_DATA_TABLE: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SYSTEM_FILTERS: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SUBJECTS_TREE: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SUBJECTS_SERVICE: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SUBJECTS_CHART: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_MAP: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_DEVICE_SCHEME: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SERVICE_CHART: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SERVICES_ALL_CHART: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_ATTR_SUBJECT: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SERVICE_SUBJECT: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_EVENTS: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_SUBJECTS_REACTIONS_TABLE: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_STATUS_HISTORY: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        SUBJECT_COUNT_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_BAND_STAT: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        BAND_COUNT_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        UTILISATION_STATS_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        BAND_UTIL_STATS_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        SUBJECT_TYPES_PIE_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        DEVICE_FOR_MONITORING_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        TICKETS_WITH_GROUPING_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        TICKET_TABLE_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        AGGR_METRIC_RESULTS_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        METRIC_CHARTS_FOR_CHILDS: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        SUBJECT_PARENTS_CHILDES_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        SUBJECTS_GRID_WITH_ATTRS_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        METRIC_CHART_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_HEADER_PANEL: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        VALUES_HISTORY_AGGREGATION_WIDGET: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        SUBJECT_SCHEME: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
        WIDGET_VIDEO_IP_CAMERA: () => {
            return {
                title: {
                    text: ''
                }
            }
        },
    }

    return adaptedOptions[widgetKey]()
}