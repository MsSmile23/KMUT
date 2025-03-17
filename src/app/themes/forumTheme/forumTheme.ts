import ObjectInfoContainer from '@containers/objects/ObjectCardContainer/ObjectInfoContainer/ObjectInfoContainer'
import MainDefault from '@containers/vtemplates/forum/MainDefault'
import { commonTheme } from '../const'
import ObjectBuild from '@containers/vtemplates/forum/ObjectBuild'
import ObjectFloor from '@containers/vtemplates/forum/ObjectFloor'
import ObjectRoom from '@containers/vtemplates/forum/ObjectRoom'
import ObjectStand from '@containers/vtemplates/forum/ObjectStand'
import { IProjectSettings, ITheme, IThemeComponentMnemo } from '../types'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { forumWidgets } from '@app/themes/forumTheme/forumWidgets';
import ForumObjectCables from '@containers/vtemplates/forum/ForumObjectCables';
import ForumObjectRacks from '@containers/vtemplates/forum/ForumObjectRacks';
import defaultTheme from '@app/themes/defaultTheme/defaultTheme';
import { mergeTheme } from '@shared/utils/theme'

import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import ForumDeviceVtemplate from '@containers/vtemplates/forum/ForumDeviceVtemplate';
import ForumServiceVtemplate from '@containers/vtemplates/forum/ForumServiceVtemplate';
import ForumMonitoringTab from '@containers/vtemplates/forum/ForumMonitoringTab';
import { ForumFavourVtemplate } from '@containers/vtemplates/forum/ForumFavourVtemplate'
import { ForumProjectFavourVtemplate } from '@containers/vtemplates/forum/ForumProjectFavourVtemplate'
import { ForumIncident } from '@containers/vtemplates/forum/ForumIncident'

import newYearImage from '/img/newYear.jpg'
import ForumMain from '@containers/vtemplates/forum/constructorVtemplates/ForumMain'
import { getURL } from '@shared/utils/nav'

type ILocalTheme = Partial<ITheme<
IThemeComponentMnemo.tables 
| IThemeComponentMnemo.tree
| IThemeComponentMnemo.tabs
| IThemeComponentMnemo.map
>>

const links = [
    /* Нужна для скрытия/показа дерева */
    {
        icon: 'MenuOutlined',
        title: 'toggleTree',
        to: '',
        isActive: false
    }, 
    /* ------------------------------- */
    {
        icon: 'PieChartOutlined',
        // icon: 'DesktopOutlined',
        title: 'Главная',
        // title: 'Мониторинг',
        to: getURL('', 'showcase'),
        // to: ROUTES.MAIN,
        isActive: false
    }, 
    {
        icon: 'DatabaseOutlined',
        title: 'Активы',
        // title: 'Инвентори',
        to: getURL(`${ROUTES.INVENTORY}/${ROUTES_COMMON.LIST}`, 'showcase'),
        // to: `/${ROUTES.INVENTORY}/${ROUTES_COMMON.LIST}`,
        isActive: false
    }, 
    {
        icon: 'WarningOutlined',
        title: 'Инциденты',
        to: getURL(`${ROUTES.INCIDENTS}/${ROUTES_COMMON.LIST}`, 'showcase'),
        // to: `/${ROUTES.INCIDENTS}/${ROUTES_COMMON.LIST}`,
        isActive: false
    }, 
    {
        icon: 'ScheduleOutlined',
        title: 'Отчёты',
        to: getURL(`${ROUTES.REPORTS}/${ROUTES_COMMON.LIST}`, 'showcase'),
        // to: `/${ROUTES.REPORTS}/${ROUTES_COMMON.LIST}`,
        isActive: false
    }, 
    {
        icon: 'EnvironmentOutlined',
        title: 'Карта',
        to: getURL(`${ROUTES.OBJECTS}/${ROUTES.MAP}`, 'showcase'),
        // to: `/${ROUTES.OBJECTS}/${ROUTES.MAP}`,
        isActive: false
    }, 
    {
        icon: 'FileSearchOutlined',
        title: 'Системный журнал',
        to: getURL(`${ROUTES.OBJECTS}/${ROUTES_COMMON.SYSLOG}`, 'showcase'),
        // to: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.SYSLOG}`,
        isActive: false
    },
    {
        icon: 'WindowsOutlined',
        title: 'Инфопанель',
        // title: 'Инвентори',
        to: '',
        isActive: false,
        children: [
            {
                icon: 'DatabaseOutlined',
                title: 'Мониторинг',
                // title: 'Инвентори',
                to: getURL(`${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10022`, 'showcase'),
                // to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10022`,
                isActive: false
            }, 
            {
                icon: 'DatabaseOutlined',
                title: 'Карта опорной сети',
                // title: 'Инвентори',
                to: getURL(`${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10026`, 'showcase'),
                // to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10026`,
                isActive: false
            }, 
            {
                icon: 'DatabaseOutlined', 
                title: 'Геокарта',
                // title: 'Инвентори',
                to: getURL(`${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10027`, 'showcase'),
                // to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10027`,
                isActive: false
            }, 
            {
                icon: 'DatabaseOutlined', 
                title: 'Мониторинг СЦ',
                id: 10010,
                to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/10010`,
                isActive: false
            }, 
            {
                icon: 'DatabaseOutlined', 
                title: 'Критическая инфраструктура',
                mnemonic: 'сritical-infrastructure',
                to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/сritical-infrastructure`,
                isActive: false
            },
            {
                icon: 'DatabaseOutlined', 
                title: 'Важные порты',
                mnemonic: 'ports',
                to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/ports`,
                isActive: false
            },
            {
                icon: 'DatabaseOutlined',
                title: 'Карта СВН',
                mnemonic: 'network-map-video',
                to: `/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/network-map-video`,
                isActive: false
            },
        ]
    }, 
    /* Нужна для отделения настроек и уведомлений */
    {
        icon: 'StopOutlined',
        title: 'empty',
        to: '',
        isActive: false
    },
    /* ------------------------------------------ */
    {
        icon: 'FieldTimeOutlined',
        title: 'Service desk',
        to: 'https://fest2024.kmyt.ru/',
        target: '_blank',
        isActive: false
    },
    {
        icon: 'NotificationOutlined',
        title: 'Уведомления',
        to: getURL(`${ROUTES.NOTIFICATIONS}/${ROUTES_COMMON.LIST}`, 'showcase'),
        // to: `/${ROUTES.NOTIFICATIONS}/${ROUTES_COMMON.LIST}`,
        isActive: false
    },
]
const forumColors = {
    white: '#ffffff',
    black: '#000000',
    blue: 'rgba(44, 160, 207, 1)',
    skyBlue: 'rgba(233, 247, 252, 1)',
    lightBlue: 'rgba(201, 234, 248, 1)',
    semiLightBlue: 'rgba(179, 210, 226, 1)',
    darkBlue: '#0740AC',
    dark: '#272E3D',
    grey: '#555D60',
    lightGrey: '#f0f0f0',
    semiGray: 'rgba(0, 0, 0, 0.25)',
    lightBlue2: '#E9F7FC',
    red: 'rgba(255, 89, 89, 1)',
}

const localTheme: any /*IProjectSettings & ILocalTheme*/ = {
    title: 'Мониторинг ИКТ КМУТ',
    titleSettings: {
        text: 'Мониторинг ИКТ КМУТ',
        newYearImage: newYearImage,
        fontSize: 16,
        fontWeight: 600,
        color: '#26ade4',
    },
    map: {
        tilesUrl: import.meta.env.VITE_API_SERVER + '/tiles/map/{z}/{x}/{y}.png',
        //tilesUrl: 'https://192.168.189.10/tiles/map/{z}/{x}/{y}.png',
    },
    // title: 'Сириус',
    font: 'Inter, serif',
    layout: {
        notFoundPage: {
            background: forumColors.white,
            color: forumColors.blue,    
        },
        header: {
            background: forumColors.white,
            // background: '#1B2E47',
            font: {
                color: forumColors.blue,
                size: 16
            },
            visibility: true,
            menuAvailability: false,
            logo: {
                enabled: true,

                // component: ForumLogo,

                src: '/png/KMUT_logo.png',
            },
            menu: {
                background: forumColors.dark,
                color: forumColors.white,
            },
            userMenu: {
                enabled: true,
                icon: 'UserOutlined',
                fullName: true,
                border: {
                    color: forumColors.darkBlue,
                    width: 0,
                    radius: '50%'
                },
                background: forumColors.darkBlue,
                iconBackground: forumColors.white,
                font: {
                    color: forumColors.black,
                    size: 14
                }
            },
            search: {
                background: forumColors.white,
                buttonColor: forumColors.lightBlue,
                iconColor: forumColors.blue,
                placeholderColor: forumColors.semiGray,
                text: forumColors.black,
                width: '350px',
            },
            leftSidebarToggleButton: false,
            rightSidebarToggleButton: false,
            horizontalPadding: 24,
            verticalPadding: 0,
            routerLinks: links
        },
        footer: {
            background: forumColors.white,
            fontColor: 'white',
            visibility: false,
            menuAvailability: false
        },
        leftSidebar: {
            background: forumColors.white,
            fontColor: 'black',
            visibility: true,
            menuAvailability: true,
            logo: false,
            userMenu: false,
            abilityToLeave: false,
            onlyVisibleOnMain: false
        },
        rightSidebar: {
            background: forumColors.white,
            fontColor: 'black',
            visibility: false,
            menuAvailability: false,
            logo: true,
            userMenu: false,
            abilityToLeave: false
        },
        main: {
            background: forumColors.white,
            fontColor: forumColors.black,
        },
        siderMenu: {
            main: {
                gap: 20,
                width: 76,
                // width: 64,
                edgePadding: 24,
                radius: 8,
                background: forumColors.white,
                fontColor: forumColors.black,
                padding: '20px 16px',
                // padding: '17px 10px',
            },
            items: {
                gap: 20,
                width: 76,
                // width: 64,
                edgePadding: 24,
                radius: 8,
                tooltip: {
                    color: forumColors.white,
                    background: forumColors.grey,
                },
                background: {
                    active: forumColors.lightBlue,
                    inactive: '',
                },
                color: {
                    active: forumColors.blue,
                    inactive: forumColors.semiLightBlue,
                },
                notificationColor: forumColors.red
            }
        },
    },
    vtemplates: {
        dashboards: {
            title: 'Макет главной',
            default: { 
                title: 'Инфопанель 1', 
                component: ForumMain,
                // component: MainDefault 
            },
            items: [],
        },
        classes: {
            title: 'Макеты объектов по классам',
            default: { title: 'По умолчанию 1', component: ObjectInfoContainer },
            items: [
                { 
                    class_id: 10055, 
                    component: ObjectBuild, 
                    isCustomLayout: true,
                    tabs: [{
                        mnemo: 'summary',
                        name: 'Сводная',
                        component: ObjectBuild,
                        default: true
                    },
                    {
                        mnemo: 'cableTable',
                        name: 'Кабельный журнал',
                        component: ForumObjectCables,
                        default: false
                    },
                    {
                        mnemo: 'racks',
                        name: 'Стойки',
                        component: ForumObjectRacks,
                        default: false
                    },] 
                },
                //{ class_id: 10056, component: ObjectFloor },
                //{ class_id: 10057, component: ObjectRoom },
                {
                    class_id: 10058,
                    component: ObjectStand,
                    hideTabs: true
                },
                {   // Страница оборудования
                    class_ids: forumThemeConfig.classesGroups.devices,
                    component: ForumDeviceVtemplate,
                    isCustomLayout: true,
                    tabs: [
                        {
                            mnemo: 'summary',
                            name: 'Сводная',
                            component: ForumDeviceVtemplate,
                            default: true
                        },
                        {
                            mnemo: 'summary',
                            name: 'Мониторинг',
                            component: ForumMonitoringTab,
                            default: true
                        }
                    ]
                },
                {   // Страница сервисов
                    class_ids: forumThemeConfig.classesGroups.services,
                    component: ForumServiceVtemplate,
                    isCustomLayout: true,
                    tabs: [
                        {
                            mnemo: 'summary',
                            name: 'Сводная',
                            component: ForumServiceVtemplate,
                            default: true
                        },
                        {
                            mnemo: 'summary',
                            name: 'Мониторинг',
                            component: ForumMonitoringTab,
                            default: true
                        }
                    ]
                },
                {   // Страница услуг здания
                    class_ids: forumThemeConfig.classesGroups.favor,
                    component: ForumFavourVtemplate,
                    hideTabs: true
                },
                {   // Страница услуг 
                    class_ids: forumThemeConfig.classesGroups.favourMain,
                    component: ForumProjectFavourVtemplate,
                    hideTabs: true
                },
                { class_id: 300, component: ForumIncident }, //Инциденты
            ],
        },
    },
    //widgets: forumWidgets,
    components: {
        tables: {
            constructor: {
                Edit: defaultTheme?.components?.tables?.constructor?.Edit
            },
            manager: {
                // todo: change to manager
                Edit: defaultTheme?.components?.tables?.manager?.Edit
            },
            showcase: {
                Edit: defaultTheme?.components?.tables?.showcase?.Edit,
                Reports: {
                    Form: {
                        linkedClassesForObjects: [10103],
                    }
                }
            }
        },
        tree: {
            showcase: {
                backgroundColor: forumColors.white,
                fontColor: forumColors.black,
                borderColor: forumColors.lightGrey,
                boxShadow: '0 0 8px 0 rgba(0,0,0,0.4)', 
                borderRadius: 16,
                buttons: {
                    background: forumColors.white,
                    color: forumColors.grey
                },
                badges: {
                    background: forumColors.blue,
                    color: forumColors.white
                },
                mainTree: { 
                    enabled: true, 
                    classes: [{
                        target: [ 
                            ...forumThemeConfig.classesGroups.buildings
                        ],
                        linking: [],
                    }]
                }, 
                childrenTree: { 
                    enabled: true, 
                    parentTrackedClasses: [
                        ...forumThemeConfig.classesGroups.buildings,
                    ],
                    classes: [ 
                        { 
                            target: [
                                ...forumThemeConfig.classesGroups.devices
                            ], 
                            linking: [ 
                                ...forumThemeConfig.classesGroups.floors, 
                                ...forumThemeConfig.classesGroups.rooms, 
                                // 10083 абстрактный 
                                ...forumThemeConfig.classesGroups.racks.filter(cls => cls !== 10083), 
                                ...forumThemeConfig.classesGroups.units, 
                            ], 
                
                        },  
                        { 
                            target: [
                                ...forumThemeConfig.classesGroups.services
                            ], 
                            linking: [
                                ...forumThemeConfig.classesGroups.favour
                            ], 
                        } 
                    ] 
                }
            }
        },
        tabs: {
            showcase: {
                backgroundColorActive: forumColors.lightBlue2,
                color: forumColors.black,
                margin: '0',
                padding: '10px',
                border: '1px solid rgba(226, 226, 226, 1)',
                borderRadius: '0',
                boxShadow: 'none',
            }
        },
        map: {
            showcase: {
                startZoom: 14,
                mapCenter: [43.40758654559397, 39.95466648943133],
                attributesBind: { 
                    contour: {
                        attribute_id: 10179
                    },
                },
            }
        }
    },
}

const forumTheme = mergeTheme(commonTheme, localTheme) as ITheme



export default forumTheme