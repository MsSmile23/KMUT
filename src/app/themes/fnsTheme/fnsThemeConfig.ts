import { IObjectAdvancedTableWidget } from '@containers/objects/ObjectAdvancedTableWidget/ObjectAdvancedTableWidget';
import { IObjectAttributesWidget } from '@containers/objects/ObjectAttributesWidget/ObjectAttributesWidget';
import { IObjectCountContainer } from '@containers/objects/ObjectCountContainer/ObjectCountContainer';
import { IObjectsCountByAttribute } from '@containers/objects/ObjectsCountByAttribute/ObjectsCountByAttribute';
import { IBandUtilStatsWidgetProps } from '@containers/stats/BandUtilStatsWidget/BandUtilStatsWidget';
import { IObjectCableTable } from '@entities/objects/ObjectCableTable/ObjectCableTable';
import { IObjectsStatusLabelsProps } from '@entities/objects/ObjectsStatusLabels/ObjectsStatusLabels';
import { IAggregationMeasurementsResultsWidgetProps } from '@entities/stats/AggregationMeasurementsResults/AggregationMeasurementsResultsWidget';
import { IObjectsOverImageProps } from '@entities/stats/ObjectsOverImage/ObjectsOverImage';
import { 
    IValuesHistoryAggregationProps 
} from '@entities/stats/ValuesHistoryAggregationWidget/ValuesHistoryAggregationWidget2';
import { IStatusProps } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares';
import { getSumObjectAttributes } from '@shared/api/Stats/Models/getSumObjectAttributes';

const fnsDeviceClsIds = [10074, 10088, 10084, 40, 42, 10107, 10108]
const fnsDevicePathIds = [10058, 10082, 40, 10084, 10088, 10063, 10065, 39]
// eslint-disable-next-line max-len
const fnsPortDeviceRelIds = [10052, 20037, 20040, 20041, 20042, 20036, 20039, 20038, 20029, 20035, 20034, 20033, 20032, 20031, 20030]

interface IFnsThemeConfig {
    objectsByTypes?: IObjectsCountByAttribute
    main: {
        torm: IObjectCountContainer
        inspection: IObjectCountContainer
        equipment: IObjectCountContainer
        bandCommon: IObjectCountContainer
        speedometer: IBandUtilStatsWidgetProps
        cylinder: IBandUtilStatsWidgetProps
        objectsByTypes: IObjectsCountByAttribute
        operationSystems: IObjectsCountByAttribute
        equipmentStatus: IStatusProps
        traffic: IValuesHistoryAggregationProps
        topDuration: IAggregationMeasurementsResultsWidgetProps & { title: string }
        topResources: IAggregationMeasurementsResultsWidgetProps & { title: string }
    }
    torm?: {
        attributes: Omit<IObjectAttributesWidget, 'objectId'>
        linkedEquipmentTable: IObjectAdvancedTableWidget
        pieStatus: IStatusProps
        historyArm: IStatusProps
        historyZond: IStatusProps
        subjectScheme:  Omit<IObjectsOverImageProps, 'parentObjectId'>
        channelStatuses: Omit<IObjectsStatusLabelsProps, 'object_id'>
        childObjectsStatuses: Omit<IObjectsStatusLabelsProps, 'object_id'>
    }
    inspection?: {
        attributes: Omit<IObjectAttributesWidget, 'objectId'>
        pieStatus: IStatusProps
        historyArm: IStatusProps
        historyZond: IStatusProps
        subjectScheme:  Omit<IObjectsOverImageProps, 'parentObjectId'>
        cableTable: IObjectCableTable
        objectEquipment: IObjectAdvancedTableWidget
    }
    props?: any
}

export const fnsThemeConfig: IFnsThemeConfig = {
    main: {
        torm: {
            filters: { mnemo: 'class_id' as const, value: [10103] },
            title: 'Общее количество объектов ТОРМ',
            color: '#007BFF',
            image: {
                src: '/torm.png',
                width: 40,
            },
            textSize: '12',
        },
        inspection: {
            filters: { mnemo: 'class_id' as const, value: [10104] },
            title: 'Общее количество инспекций и управлений',
            color: '#007BFF',
            icon: 'ZoomInOutlined' as const,
            textSize: '12',
        },
        equipment: {
            filters: { mnemo: 'class_id' as const, value: [40, 10084, 10088, 10107, 10108, 42, 10074] },
            title: 'Общее количество оборудования',
            color: '#007BFF',
            icon: 'LaptopOutlined' as const,
            textSize: '12',
        },
        speedometer: {
            dataWidget: {
                id: 9000,
                mnemo: {
                    chartLoading: false,
                    limits: [
                        {
                            id: 13,
                            colors: '#428bca',
                            description: 'На складе',
                        },
                        {
                            id: 2,
                            colors: '#5cb85c',
                            description: 'В норме',
                        },
                        {
                            id: 3,
                            colors: '#ffcc33',
                            description: 'Отклонение',
                        },
                        {
                            id: 4,
                            colors: '#990000',
                            description: 'Недоступно',
                        },
                        {
                            id: 14,
                            colors: '#ffa500',
                            description: 'В ремонте',
                        },
                    ],
                    settings: {
                        title: 'Пропускная способность каналов связи',
                        values: {
                            '2': {
                                end: 100,
                                start: 25,
                            },
                            '3': {
                                end: 25,
                                start: 1,
                            },
                            '4': {
                                end: 0,
                                start: 0,
                            },
                            '13': {
                                end: 102,
                                start: 102,
                            },
                            '14': {
                                end: 101,
                                start: 101,
                            },
                        },
                        updating: true,
                        data_source: 1,
                        service_type: 2,
                        subject_type: 1,
                        updatingInterval: 10, // минуты
                        visual_representation: 3, // 1 - бочка, 2 - спидометр, 3 - дуга
                    },
                },
            }
        },
        cylinder: {
            dataWidget: {
                id: 9001,
                mnemo: {
                    chartLoading: false,
                    limits: [
                        {
                            id: 2,
                            colors: '#5cb85c',
                            description: 'В норме',
                        },
                        {
                            id: 3,
                            colors: '#ffcc33',
                            description: 'С отклонениями',
                        },
                        {
                            id: 4,
                            colors: '#990000',
                            description: 'Недоступно',
                        },
                        {
                            id: 14,
                            colors: '#ffa500',
                            description: 'В ремонте',
                        },
                    ],
                    settings: {
                        title: 'Загрузка каналов связи',
                        values: {
                            '2': {
                                end: 25,
                                start: 0,
                            },
                            '3': {
                                end: 50,
                                start: 25,
                            },
                            '4': {
                                end: 75,
                                start: 50,
                            },
                            '14': {
                                end: 100,
                                start: 75,
                            },
                        },
                        updating: true,
                        data_source: 2,
                        service_type: 2,
                        subject_type: 1,
                        updatingInterval: 10,
                        visual_representation: 1,
                    },
                },
            }
        },
        objectsByTypes: {
            viewType: 'progressBar',
            filters: { mnemo: 'class_id', value: [10074, 10088, 10084, 40, 42, 10107, 10108] },
            criteria: { mnemo: 'class', value: [] },
            sort: { sort: 'count', order: 'desc' },
            height: '385',
        },
        operationSystems: {
            viewType: 'pieChart',
            filters: { mnemo: 'class_id', value: 42 },
            criteria: { mnemo: 'attribute' as const, value: 10001 },
            sort: { sort: 'count', order: 'desc' },
            height: '300',
        },
        // todo: разделить на объекты, когда появятся данные для ObjectLinkedShares
        equipmentStatus: {
            representationType: 'pieChart' as const,
            classesIds: fnsDeviceClsIds,
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            height: 150,
        },
        traffic: {
            source: 'class',
            sourceClassId: 10104,
            targetClassId: 42,
            relationIds: [20058],
            attributeId: { rcv: 246, trn: 248 },
            regexp: {
                // eslint-disable-next-line max-len
                values: '%23((?:[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}|(?:[^\\.?/]+\\.|)[^\\.?/]+\\.[^\\.?/]+?))(?:[/\\?].*|)$',
            },
            groupBy: 'day',
            dataSource: 'checkNetChart',
            chart: {
                name: 'История изменения объёма трафика, МБ',
                type: 'all', 
                view: 'column',
                autoUpdated: true
            },
            legend: { valuesType: 'absolute' }
        },
        topDuration: {
            title: 'Длительность использования приложений (ч)',
            dataSource: 'getProcessTop' as const,
            source: 'class' as const,
            sourceClassId: 10104,
            targetClassId: 43,
            relationIds: [20058, 109],
            attributeId: 256,
            height: '600',
            regexp: {
                // eslint-disable-next-line max-len
                values: '((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$',
            },
        },
        topResources: {
            title: 'Топ посещаемых интернет-ресурсов',
            dataSource: 'getBrowserHistoryTop' as const,
            source: 'class' as const,
            sourceClassId: 10104,
            targetClassId: 43,
            height: '600',
            relationIds: [20058, 109],
            attributeId: 251,
            regexp: {
                // eslint-disable-next-line max-len
                values: '((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$',
            },
        },
        bandCommon: {
            filters: { mnemo: 'class_id' as const, value: [] },
            title: 'Общая пропускная способность',
            color: '#007BFF',
            image: { src: '/band.png', width: 40 },
            apiValue: {
                func: getSumObjectAttributes,
                payload: { class_id: 41, attribute_id: 194 },
                key: 'sum',
            },
            textSize: '12',
        },
    },
    torm: {
        attributes: {
            showLinks: true,
            height: 250,
        },
        pieStatus: {
            classesIds: fnsDeviceClsIds,
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            representationType: 'pieChart' as const,
        },
        historyArm: {
            classesIds: [42],
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            representationType: 'pieChart' as const,
        },
        historyZond: {
            classesIds: [40],
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            representationType: 'pieChart' as const,
        },
        // Таблица связанного оборудования
        linkedEquipmentTable: {
            classesIds: fnsDeviceClsIds,
            childClsIds: fnsDevicePathIds,
            columns: ['object__name', 9, 207, 208, 10002, 10021, 10024, 10046],
            relationIds: [161, 185],
            height: 500,
        },
        subjectScheme: {
            
            linkedObjectsSearchProps: {
                targetClasses: fnsDeviceClsIds,
                linkingClasses: fnsDevicePathIds,
            },
            // relationIds: [105],
            // attributeIds: [295, 296],
            attributesBindProps: {
                schemeAttributeId: 294,
                coordinateXAttributeId: 295,
                coordinateYAttributeId: 296
            }
        },
        channelStatuses: {
            classes_id: [41],
            childClsIds: [41],
            labelWidth: '45%',
        },
        childObjectsStatuses: {
            classes_id: [41],
            childClsIds: [41],
            labelWidth: '45%',
        }
    },
    inspection: {
        attributes: {
            showLinks: true,
            height: 250,
        },
        pieStatus: {
            classesIds: fnsDeviceClsIds,
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            representationType: 'pieChart' as const,
        },
        historyArm: {
            classesIds: [42],
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            representationType: 'pieChart' as const,
        },
        historyZond: {
            classesIds: [40],
            childClsIds: fnsDevicePathIds,
            isSingle: true,
            representationType: 'pieChart' as const,
        },
        cableTable: {
            cableClasses: [10066, 10064],
            relationsCablePort: [10013, 10017],
            relationsPortDevice: fnsPortDeviceRelIds,
            childClsIds: fnsDevicePathIds,
            targetClsIds: fnsDeviceClsIds,
            height: 400,
        },
        objectEquipment: {
            classesIds: fnsDeviceClsIds,
            childClsIds: fnsDevicePathIds,
            columns: ['object__name', 9, 207, 208, 10002, 10021, 10024, 10046],
            relationIds: [161, 185],
            height: 400,
        },
        subjectScheme: {
            linkedObjectsSearchProps: {
                targetClasses: fnsDeviceClsIds,
                linkingClasses: fnsDevicePathIds,
            },
            // relationIds: [105],
            // attributeIds: [295, 296],
            attributesBindProps: {
                schemeAttributeId: 294,
                coordinateXAttributeId: 295,
                coordinateYAttributeId: 296
            }
        },
    },

    props: {
        fnsDeviceClsIds,
        fnsDevicePathIds,
        fnsPortDeviceRelIds,
    },
}