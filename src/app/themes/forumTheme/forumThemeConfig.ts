import { ILegendSettings } from '@pages/dev/vladimir/ResponsivePieChartWrapper/ResponsivePieChart'
import { IClass } from '@shared/types/classes'
import { rangeButtons } from '@shared/ui/charts/highcharts/CommonChart'

export const relationsDevicesUnits = [10038, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113]
export const relationsPortDevice = [10012, 10057, 10058, 10059, 10060, 10061, 10062, 10063, 10064,
    10065, 10066, 10067, 10068, 10069, 10070, 10071, 10072, 10073, 10074, 10075, 10142, 10143,
    10144, 10145, 10146, 10147, 10148, 10149, 10150, 10151, 10152,
    10153, 10154, 10155, 10156, 10157, 10158, 10159, 10160, 10425, 14952]
export const relationsCablePort = [10211, 10017, 10013]
export const cableClasses = [10066, 10064]
export const objectForumId = 11081

export const forumClass = 10107
export const classesGroups = {
    //Классы услуг здания
    favor: [10137, 10138, 10147, 10214, 10243, 10286 ],
    favour: [10137, 10138, 10147, 10214, 10243, 10286],
    //Классы услуг проекта
    favourMain: [10133, 10134, 10213, 10216, 10242, 10285],
    // Классы сервисов
    services: [10140, 10141, 10142, 10143, 10217, 10241, 10272, 10287 ],
    //Классы оборудования
    devices: [
        10073, 10074, 10076, 10077, 10078, 10079, 10080, 42, 10084, 10085, 10087, 40, 10088, 10089, 10090, 10086,
        10116, 10117, 10118, 10119, 10120, 10239, 10247, 10288, 10291
    ],

    /*
    devices: [
        10073, 10077, 10079, 42, 10080, 10074, 10076, 10078, 10116, 10117, 10084, 10085, 10087, 10088, 10089, 10090,
        10086, 10118, 10119, 10120, 40, 10247, 10239, 10087
    ],

     */
    servers: [10090, 100247],
    zonds: [40],
    ibps: [10088],
    cables: [10066, 10064],
 
    buildings: [10055],
    rooms: [10105, 10106],
    floors: [10056],
    racks: [10083, 10059, 10058],
    units: [10082],
    mapObjects: [10055],
    unitPlacements: [10097], //Расположение в стойке
    relationIds: [10038, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10426, 10438, 10450, 
        10438, 10450, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10426, 13484, 13485, 
        14585, 17427, 14954, 17100, 10095 ],
}

const targetClsIds = [
    10061, 10071, 10072, 10073, 10074, 10075, 10076, 10077, 10078, 10079, 10080, 42, 10084, 10085,
    10087, 40, 10088, 10089, 10090, 10086,
]
const classZond = 40 //УСТАРЕЛО - использовать classesGroups
const classServer = 10090 //УСТАРЕЛО - использовать classesGroups
const classIBP = 10088 //УСТАРЕЛО - использовать classesGroups
const childClsIds = [10056, 10105, 10106, 10058, 10082]
// eslint-disable-next-line max-len
const cyprTargetIds = [40, 42, 10073, 10074, 10076, 10077, 10078, 10079, 10080, 10084, 10085, 10086, 10087, 10088, 10089, 10090, 10113, 10116, 10117, 10118, 10119, 10120, 10239, 10247, 10288, 10291, 10305]
// eslint-disable-next-line max-len
const cyprChildIds = [10133, 10134, 10137, 10138, 10140, 10141, 10142, 10143, 10147, 10213, 10214, 10216, 10217, 10241, 10242, 10243, 10272, 10285, 10286, 10287, 10304]
const attributeIds = [
    10065, // Этажность
    10054, // Обслуживающая организация
    10051, // ФИО ответственного
    10052, // К/т ответственного
    10008, // Адрес
]

// Атрибуты для вывода на страничке оборудования ( 4 плашки)
const attributesForDevicePage = {
    zondAndServer: [10119, 10165, 10166, 10167],
    IBP: [10119, 10147, 10148, 10149]
}

// атрибуты обнаруженных устройств для таблицы дискавери
export const discoveryAttributesIds = {
    date: 10178,
    macsys: 10188,
    mac: 10021,
    vendor: 10046,
    ip: 10020,
}

export const chartConfig = {
    currentZoomInterval: '1ч', 
}

const legendSettings = {
    units: '',
    typeValues: 'both',
    isEnabled: true,
    showNames: true,
    orientation: 'bottom',
    type: 'vertical',
    width: 300,
    x: 50,
    maxHeight: 100,
    chart: {
        marginBottom: 100,
    },
    fontSize: '12px'
} as ILegendSettings

export const forumThemeConfig = {
    mainObjectId: 10143,
    incidents: {
        externalTicketUrl: 'https://fest2024.kmyt.ru/task',
        attributesBind: {
            externalTickedId: {
                id: 10173,
            },
            externalTickedState: {
                id: 10174,
            }
        }
    },
    classesGroups,
    forumClass,
    classIBP,
    classServer,
    classZond,
    main: {
        statuses: {
            chart: {
                isWidget: false,
                isSingle: true,
                height: 240, // высота контейнера, где график используется
                // height: 350, // высота контейнера, где график используется
                representationType: 'pieChart' as const,
                classesIds: [...classesGroups.devices, ...cyprTargetIds], //cypr
                // classesIds: classesGroups.devices, // forum
                // classesIds: targetClsIds,
                // childClsIds: [...childClsIds, ...classesGroups.services], // forum
                childClsIds: [...childClsIds, ...classesGroups.services, ...cyprChildIds], // cypr
                legendSettings: {
                    ...legendSettings,
                    chartRatio: 0.50, //cypr
                    // chartRatio: 0.35, //forum
                    legendRatio: 0.38, //cypr
                    // legendRatio: 0.55, //forum
                    width: 170,
                    x: 0,
                    showNames: false,
                    maxHeight: 115,
                    chart: {
                        marginBottom: 150,
                        size: 170,
                        height: 230 // высота самого графика
                        // height: 235 // высота самого графика
                        // height: 300 // высота самого графика
                    },
                    fontSize: '12px'
                } as ILegendSettings,
            }
        },
        deviceStatuses: {
            attributes: {
                attributeIds: attributeIds,
            },
            stateLabels: {
                classes_id: classesGroups.favor
            },
            chart: {
                isWidget: false,
                isSingle: true,
                height: 220, // высота контейнера, где график используется
                representationType: 'pieChart' as const,
                classesIds: [...classesGroups.devices, ...cyprTargetIds], //cypr
                // classesIds: classesGroups.devices, // forum
                childClsIds: [...childClsIds, ...cyprChildIds], // cypr
                // childClsIds: childClsIds, // forum
                legendSettings: {
                    ...legendSettings,
                    width: 170,
                    x: 0,
                    maxHeight: 115,
                    chart: {
                        marginBottom: 150,
                        size: 170,
                        height: 210 // высота самого графика
                        // height: 190 // высота самого графика
                    },
                    showNames: false,
                    fontSize: '12px',
                    chartRatio: 0.50, //cypr
                    legendRatio: 0.38, //cypr
                    // chartRatio: 0.28, //forum
                    // legendRatio: 0.60, //forum
                } as ILegendSettings,
            }
        },
        clientIncidentsDynamics: {
            height: 272
        },
        cableTable: {
            targetClsIds: classesGroups.devices,
            relationsCablePort: relationsCablePort,
            relationsPortDevice: relationsPortDevice,
            cableClasses: cableClasses,
        }
    },
    build: {
        deviceStatuses: {
            attributes: {
                attributeIds: attributeIds,
            },
            stateLabels: {
                classes_id: classesGroups.favor
            },
            chart: {
                isWidget: false,
                isSingle: true,
                height: 350, // высота контейнера, где график используется
                representationType: 'pieChart' as const,
                classesIds: classesGroups.devices,
                childClsIds: childClsIds,
                legendSettings: {
                    ...legendSettings,
                    width: 170,
                    x: 0,
                    maxHeight: 105,
                    chart: {
                        marginBottom: 130,
                        size: 170,
                        height: 315 // высота самого графика
                        // height: 285 // высота самого графика
                    },
                    fontSize: '12px',
                    chartRatio: 0.47,
                    legendRatio: 0.40,
                } as ILegendSettings,
            },
        },
        favorHealth: {
            height: 350
        },
        clientIncidentsDynamics: {
            height: 400,
            sourceClassId: 300,
        },
        cableTable: {
            targetClsIds: classesGroups.devices,
            relationsCablePort: relationsCablePort,
            relationsPortDevice: relationsPortDevice,
            cableClasses: cableClasses,
        }
    },
    service: {
        objectAttributes: {
            linkedObjects: { targetClasses: [{
                class_id: 10055,
                showClassName: true,
            }, {
                class_id: 10138,
                showClassName: true,
            }], connectingClasses: [  10138, 10055 ] }
        },
        devicesTable: {
            targetClasses: { 
                ids: classesGroups.devices,
                attributeIds: [10119, 10138, 10139],
                filterByAttributes: (a) => a.readonly && a.history_to_db
            },
            parentClasses: [{ id: 10055, attributeIds: [10008, 10065] }],
            statusColumn: 'Состояние оборудования',
            childClsIds: [],
            scroll: { x: 2000 }
        }
    },
    favour: {
        objectAttributes: {
            linkedObjects: { targetClasses: [{
                class_id: 10055,
                showClassName: true,
            }, {
                class_id: 10138,
                showClassName: true,
            }], connectingClasses: [  10138, 10055 ] }
        },
        devicesTable: {
            targetClasses: { 
                ids: classesGroups.devices,
                attributeIds: [10119, 10138, 10139],
                filterByAttributes: (a) => a.readonly && a.history_to_db
            },
            parentClasses: [{ id: 10055, attributeIds: [10008, 10065] }],
            statusColumn: 'Состояние оборудования',
            childClsIds: [],
            scroll: { x: 2000 }
        }
    },
    device: {
        attributes: {
            height: 490
        },
        attributesForDevicePage

    }
}