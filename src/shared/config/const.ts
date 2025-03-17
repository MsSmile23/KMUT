import { getSumObjectAttributes } from '@shared/api/Stats/Models/getSumObjectAttributes'

export enum VISIBILITY {
    public = 'Открытый',
    protected = 'Защищённый',
    private = 'Закрытый',
    package = 'Пакетный',
}

export const INTERFACE_TYPES = {
    constructor: 'constructor',
    manager: 'manager',
    showcase: 'showcase',
}

// дублируется с src/containers/associations/AssociationTableContainer/relationsTableData.ts
// export enum RELATIONS {
//     association = 'Ассоциация',
//     aggregation = 'Агрегация',
//     composition = 'Композиция',
//     generalisation = 'Генерализация',
//     dependency = 'Зависимость',

// }

const dataWidget1 = {
    'id': 'utilizationStats',
    'mnemo': {
        'limits': [
            {
                'id': 13,
                'colors': '#428bca',
                'description': 'На складе'
            },
            {
                'id': 2,
                'colors': '#5cb85c',
                'description': 'В норме'
            },
            {
                'id': 3,
                'colors': '#ffcc33',
                'description': 'Отклонение'
            },
            {
                'id': 4,
                'colors': '#990000',
                'description': 'Недоступно'
            },
            {
                'id': 14,
                'colors': '#ffa500',
                'description': 'В ремонте'
            }
        ],
        'settings': {
            'title': 'Пропускная способность каналов связи',
            'values': {
                '2': {
                    'end': 100,
                    'start': 25
                },
                '3': {
                    'end': 25,
                    'start': 1
                },
                '4': {
                    'end': 0,
                    'start': 0
                },
                '13': {
                    'end': 102,
                    'start': 102
                },
                '14': {
                    'end': 101,
                    'start': 101
                }
            },
            'updating': true,
            'data_source': 1,
            'service_type': 2,
            'subject_type': 1,
            'updatingInterval': 10, // минуты
            'visual_representation': 3 // 1 - бочка, 2 - спидометр, 3 - дуга
        }
    }
}
const dataWidget2 = {
    'id': 'utilizationStats',
    'mnemo': {
        'limits': [
            {
                'id': 2,
                'colors': '#5cb85c',
                'description': 'В норме'
            },
            {
                'id': 3,
                'colors': '#ffcc33',
                'description': 'С отклонениями'
            },
            {
                'id': 4,
                'colors': '#990000',
                'description': 'Недоступно'
            },
            {
                'id': 14,
                'colors': '#ffa500',
                'description': 'В ремонте'
            }
        ],
        'settings': {
            'title': 'Загрузка каналов связи',
            'values': {
                '2': {
                    'end': 25,
                    'start': 0
                },
                '3': {
                    'end': 50,
                    'start': 25
                },
                '4': {
                    'end': 75,
                    'start': 50
                },
                '14': {
                    'end': 100,
                    'start': 75
                }
            },
            'updating': true,
            'data_source': 2,
            'service_type': 2,
            'subject_type': 1,
            'updatingInterval': 10,
            'visual_representation': 1
        }
    }
}

export const VTSettings = {
    mishk: {
        main: {
            ObjectCountContainer_1: {
                filters: { mnemo: 'class_id', value: [] },
                title: 'Общее количество объектов',
                color: '#007BFF',
                icon: 'HomeOutlined',
                textSize: '12',
            },
            ObjectCountContainer_2: {
                filters: { mnemo: 'class_id', value: [10001] },
                title: 'Заявки',
                color: '#FF4500',
                icon: 'AlertOutlined',
                textSize: '12'
            },
            ObjectCountContainer_3: {
                filters: { mnemo: 'class_id', value: [95] },
                title: 'Школа',
                color: '#5CB85C',
                icon: 'DesktopOutlined',
                textSize: '12',
            },
            ObjectCountContainer_4: {
                filters: { mnemo: 'class_id', value: [38] },
                title: 'Платформа',
                color: '#FB00FF',
                icon: 'UngroupOutlined',
                textSize: '12'
            },
            //Типы операционных систем
            ObjectsCountByAttribute_2: {
                viewType: 'pieChart',
                filters: { mnemo: 'class_id', value: 42 },
                criteria: { mnemo: 'attribute', value: 10001 },
                sort: { sort: 'count', order: 'desc' },
                height: '300'
            },
            //Объекты
            ObjectsCountByAttribute_1: {
                viewType: 'progressBar',
                filters: { mnemo: 'class_id', value: 1 },
                criteria: { mnemo: 'class', value: [] },
                sort: { sort: 'count', order: 'desc' },
                height: '385'
            },
            //Бочка 1
            BandUtilStatsWidget_1: {
                dataWidget: dataWidget1 as any
            },
            //Бочка 2
            BandUtilStatsWidget_2: {
                dataWidget: dataWidget2 as any
            },
            //Длительность использования приложений
            AggregationMeasurementsResultsWidget1: {
                dataSource: 'getProcessTop',
                source: 'class', 
                sourceClassId: 95,
                targetClassId: 43,
                relationIds: [105, 109],
                attributeId: 256,
                height: '600'
            },
            //Топ посещаемых ресурсов
            AggregationMeasurementsResultsWidget2: {
                dataSource: 'getBrowserHistoryTop',
                source: 'class', 
                sourceClassId: 95,
                targetClassId: 43,
                height: '600',
                relationIds: [105, 109],
                attributeId: 251,
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '%23((?:[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%7C(?:[%5E%5C.?/]+%5C.%7C)[%5E%5C.?/]+%5C.[%5E%5C.?/]+?))(?:[/%5C?].*%7C)$%23'
                }
            },
            //Статус заявок
            ObjectsCountByAttribute_3: {
                viewType: 'progressBar',
                filters: { mnemo: 'class_id', value: 10001 },
                criteria: { mnemo: 'relation', value: 10005 },
                sort: { sort: 'count', order: 'desc' },
                height: '410'
            },
            //Статусы услуг по объектам,
            StatusWrapper_1: {
                representationType: 'pieChart',
                countInRow: 2, 
                height: 250,
                pieSize: '60%'
            },
            //Мелкие статусы(3 штуки)
            StatusWrapper_2: {
                representationType: 'pieChart',
                isSingle: true, 
                height: 150,
            },
            //Статусы с другой легендой
            StatusWrapper_3: {
                representationType: 'pieChart',
                isSingle: true,
                height: 200,
                legendSettings: {
                    units: '',
                    typeValues: 'both',
                    isEnabled: true,
                    showNames: true,
                    orientation: 'bottom',
                    type: 'vertical',
                    width: 150,
                },
                pieSize: '50%'
            }


        },
        school: {
            //Информация об объекте 
            ObjectAttributesWidget: {
                showLinks: true,
                height: 250,
            },
            //Приоритет заявок
            ObjectsCountByAttribute_1: {
                viewType: 'pieChart',
                filters: { mnemo: 'class_id', value: 10001 },
                criteria: { mnemo: 'relation', value: 10004 },
                sort: { sort: 'count', order: 'desc' },
                height: '235'
            },
            //Статус заявок
            ObjectsCountByAttribute_2: {
                viewType: 'progressBar',
                filters: { mnemo: 'class_id', value: 10001 },
                criteria: { mnemo: 'relation', value: 10005 },
                sort: { sort: 'count', order: 'desc' },
                height: '560'
            },
            //Оборудование
            ObjectsCountByAttribute_3: {
                viewType: 'progressBar',
                filters: { mnemo: 'class_id', value: 1 },
                criteria: { mnemo: 'class', value: [42] },
                sort: { sort: 'count', order: 'desc' },
                height: '560'
            },
            //Статусы оборудования1 

            StatusWrapper_1: {
                isSingle: true, 
                representationType: 'pieChart'
            },
            //Статусы оборудования2 
            StatusWrapper_2: {
                representationType: 'pieChart'
            },
            //Схема
            SubjectSchemeWidget: {
                linkedObjectsSearchProps: {
                    targetClasses: [42],
                },
                // relationIds: [105], 
                attributesBindProps: {
                    schemeAttributeId: 294,
                    coordinateXAttributeId: 295,
                    coordinateYAttributeId: 296
                }
            },
            //Таблица снизу
            ObjectAdvancedTableWidget: {
                classesIds: [42],
                columns: ['object__name', 191, 238, 243, 249, 191, 246 ], 
                relationIds: [161, 185],
                height: 500 
            }
        },
        arm: {
            //Школа 
            ObjectAttributesWidget_1: {
                objectId: 10041,
                showLinks: true,
                height: 250

            },
            //Оборудование
            ObjectAttributesWidget_2: {
                showLinks: true,
                height: 250
            }, 
            //Таблица пользователей
            ObjectAdvancedTableWidget: {
                classesIds: [43],
                columns: ['object__name', 'id', 222], 
                height: 250,
                actions: true
            },
            //Активносность поьзователей топ
            AggregationMeasurementsResultsWidget_1: {
                height: '350', 
                dataSource: 'getUserActivityTop',
                source: 'object', 
                targetClassId: 43,
                relationIds: [109],
                attributeId: 250
            },
            //Активность пользователей график
            OALinkedObjectsHistoryView: {
                relationIds: [109],
                attributeId: 250,
                title: 'Активность пользователей на АРМ'
            },
            //Топ пользователей по времени
            AggregationMeasurementsResultsWidget_2: {
                dataSource: 'getUserActivityTop',
                source: 'object',
                targetClassId: 43,
                relationIds: [109],
                attributeId: 250,
                height: '350'  
            },
            //Топ приложений
            AggregationMeasurementsResultsWidget_3: {
                dataSource: 'getProcessTop',
                source: 'object',
                targetClassId: 43,
                relationIds: [109],
                attributeId: 256,
                height: '350' 
            },
            //Топ интернет ресурсов
            AggregationMeasurementsResultsWidget_4: {
                dataSource: 'getBrowserHistoryTop',
                source: 'object', 
                height: '400',
                targetClassId: 43,
                relationIds: [109],
                attributeId: 251,
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '%23((?:[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%7C(?:[%5E%5C.?/]+%5C.%7C)[%5E%5C.?/]+%5C.[%5E%5C.?/]+?))(?:[/%5C?].*%7C)$%23'
                }
            }

        },
        userARM: {
            ObjectAttributesWidget_1: {
                objectId: 10041,
                showLinks: true,
                height: 250

            },
            //Оборудование
            ObjectAttributesWidget_2: {
                showLinks: true,
                height: 250
            }, 
            //дневная активность пользователей
            AggregationMeasurementsResultsWidget_1: {
                dataSource: 'getUserActivityTop',
                source: 'none',
                height: '350',
                attributeId: 250
            },

            //Топ приложений
            AggregationMeasurementsResultsWidget_2: {

                dataSource: 'getProcessTop',
                source: 'none', 
                attributeId: 256,
                height: '350',
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '%23((?:[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%7C(?:[%5E%5C.?/]+%5C.%7C)[%5E%5C.?/]+%5C.[%5E%5C.?/]+?))(?:[/%5C?].*%7C)$%23'
                }

            },
            //Топ интернет ресурсов 
            AggregationMeasurementsResultsWidget_3: {

                dataSource: 'getBrowserHistoryTop',
                source: 'none', 
                attributeId: 251,
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '%23((?:[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%5C.[0-9]%7B1,3%7D%7C(?:[%5E%5C.?/]+%5C.%7C)[%5E%5C.?/]+%5C.[%5E%5C.?/]+?))(?:[/%5C?].*%7C)$%23'
                },    
                height: '350'
            }

        }
    },
    fns: {
        main: {
            torm: {
                filters: { mnemo: 'class_id' as const, value: [10103] },
                title: 'Общее количество объектов ТОРМ',
                color: '#007BFF',
                image: {
                    src: '/torm.png',
                    width: 40
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
            speedometer: dataWidget1,
            cylinder: dataWidget2,
            objectsByClasses: {
                viewType: 'progressBar',
                filters: { mnemo: 'class_id', value: [10074, 10088, 10084, 40, 42, 10107, 10108] },
                criteria: { mnemo: 'class', value: [] },
                sort: { sort: 'count', order: 'desc' },
                height: '385'
            },
            operationSystems: {
                viewType: 'pieChart',
                filters: { mnemo: 'class_id', value: 42 },
                criteria: { mnemo: 'attribute' as const, value: 10001 },
                sort: { sort: 'count', order: 'desc' },
                height: '300'
            },
            // todo: разделить на объекты, когда появятся данные для ObjectLinkedShares
            equipmentStatus: {
                representationType: 'pieChart',
                isSingle: true, 
                height: 150,
            },
            traffic: {
                view: 'column',
                depth: [1, 2, 3],
                groupBy: 'day',
                chartName: 'История изменения объёма трафика, МБ',
                chartType: 'all',
                dataSource: 2,
                autoUpdated: true,
                aggregationType: 'sum',
                subjectChildTypes: [4],
            },
            topDuration: {
                dataSource: 'getProcessTop' as const,
                source: 'class' as const, 
                sourceClassId: 10104,
                targetClassId: 43,
                relationIds: [20058, 109],
                attributeId: 256,
                height: '600',
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$'
                }
            },
            topResources: {
                dataSource: 'getBrowserHistoryTop' as const,
                source: 'class' as const, 
                sourceClassId: 10104,
                targetClassId: 43,
                height: '600',
                relationIds: [20058, 109],
                attributeId: 251,
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$'
                }
            },
            bandSystem: {
                filters: { mnemo: 'class_id' as const, value: [] },
                title: 'Пропускная способность системы',
                color: '#007BFF',
                icon: 'HomeOutlined' as const,
                textSize: '12',
            },
            objectsWarning: {
                filters: { mnemo: 'class_id' as const, value: [] },
                title: 'Объектов без нарушений',
                color: '#007BFF',
                icon: 'HomeOutlined' as const,
                textSize: '12',
            },
            objectsNumber: {
                filters: { mnemo: 'class_id' as const, value: [] },
                title: 'Общее количество объектов',
                color: '#007BFF',
                icon: 'HomeOutlined' as const,
                textSize: '12',
            },
            bandCommon: {
                filters: { mnemo: 'class_id' as const, value: [] },
                title: 'Общая пропускная способность',
                color: '#007BFF',
                image: { src: '/band.png', width: 40 },
                apiValue: {
                    func: getSumObjectAttributes,
                    payload: { class_id: 41, attribute_id: 194 },
                    key: 'sum'
                },
                textSize: '12',
            }
        },
        torm: {
            attributes: {
                showLinks: true,
                height: 250,
            },
            pieStatus: {
                classesIds: [10074, 10088, 10084, 40, 42, 10107, 10108],
                representationType: 'pieChart' as const,
                isSingle: true
            },
            historyArm: {
                classesIds: [42],
                isSingle: true,
                representationType: 'pieChart' as const
            },
            historyZond: {
                classesIds: [40],
                isSingle: true,
                representationType: 'pieChart' as const
            },
            userActivity: {
                //height: '350', 
                dataSource: 'getUserActivityTop' as const,
                source: 'object' as const, 
                targetClassId: 43,
                relationIds: [20057, 109],
                attributeId: 250
            },
            operationSystems: {
                viewType: 'pieChart',
                filters: { mnemo: 'class_id', value: 42 },
                criteria: { mnemo: 'attribute', value: 10001 },
                sort: { sort: 'count', order: 'desc' },
                //height: '300'
            },
            topApplications: {
                dataSource: 'getProcessTop' as const,
                source: 'object' as const, 
                targetClassId: 43,
                relationIds: [20057, 109],
                attributeId: 256,
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$'
                }
            },
            topResources: {
                dataSource: 'getBrowserHistoryTop' as const,
                source: 'object' as const, 
                sourceClassId: 10104,
                targetClassId: 43,
                //height: '600',
                relationIds: [20057, 109],
                attributeId: 251,
                regexp: {
                    // eslint-disable-next-line max-len
                    values: '((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$'
                }
            },
            ObjectAdvancedTableWidget: {
                classesIds: [42],
                columns: ['object__name', 191, 238, 243, 249, 191, 246 ],
                relationIds: [161, 185],
                height: 500
            }
        },
        inspection: {
            attributes: {
                showLinks: true,
                height: 250,
            },
            pieStatus: {
                classesIds: [10074, 10088, 10084, 40, 42, 10107, 10108],
                representationType: 'pieChart' as const,
                isSingle: true
            },
            historyArm: {
                classesIds: [42],
                isSingle: true,
                representationType: 'pieChart' as const
            },
            historyZond: {
                classesIds: [40],
                isSingle: true,
                representationType: 'pieChart' as const
            }
        }
    }
}

export const DEFAULT_PASSWORD_REQUIREMENTS = {
    password_min_length: 12,
    password_change_freq_max_days: 0,
    password_expiration_days: 90,
    password_last_unique_count_min: 0 
}

//Цвет для конструктора
export const ADMIN_PRIMARY_COLOR = '#8a2be2'