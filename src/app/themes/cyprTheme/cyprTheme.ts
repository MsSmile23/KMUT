import { mergeTheme } from '@shared/utils/theme'
import { commonTheme } from '../const'
import { ITheme } from '../types'
import defaultTheme from '../defaultTheme/defaultTheme'
import ForumInfopanelMonitoring from '@containers/vtemplates/forum/ForumInfopanelMonitoring'
import ForumMonitoringSC from '@containers/vtemplates/forum/constructorVtemplates/ForumMonitoringSC'
import ForumMain from '@containers/vtemplates/forum/constructorVtemplates/ForumMain'


const themeColors = {
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
    title: 'ЦИПР',
    titleSettings: {
        text: 'ЦИПР',
        fontSize: 16,
        fontWeight: 600,
        color: '#26ade4',
    },
    dark: {
        background: '#272E3D', fontColor: '#ffffff' 
    },
    map: {
        tilesUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    // title: 'Сириус',
    font: 'Inter, serif',
    layout: {
        notFoundPage: {
            background: themeColors.white,
            color: themeColors.blue,    
        },
        header: {
            background: themeColors.white,
            // background: '#1B2E47',
            font: {
                color: themeColors.blue,
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
                background: themeColors.dark,
                color: themeColors.white,
            },
            userMenu: {
                enabled: true,
                icon: 'UserOutlined',
                fullName: true,
                border: {
                    color: themeColors.darkBlue,
                    width: 0,
                    radius: '50%'
                },
                background: themeColors.darkBlue,
                iconBackground: themeColors.white,
                font: {
                    color: themeColors.black,
                    size: 14
                }
            },
            search: {
                background: themeColors.white,
                buttonColor: themeColors.lightBlue,
                iconColor: themeColors.blue,
                placeholderColor: themeColors.semiGray,
                text: themeColors.black,
                width: '350px',
            },
            leftSidebarToggleButton: false,
            rightSidebarToggleButton: false,
            horizontalPadding: 24,
            verticalPadding: 0,
            // routerLinks: links
        },
        footer: {
            background: themeColors.white,
            fontColor: 'white',
            visibility: false,
            menuAvailability: false
        },
        leftSidebar: {
            background: themeColors.white,
            fontColor: 'black',
            visibility: true,
            menuAvailability: true,
            logo: false,
            userMenu: false,
            abilityToLeave: false,
            onlyVisibleOnMain: false
        },
        rightSidebar: {
            background: themeColors.white,
            fontColor: 'black',
            visibility: false,
            menuAvailability: false,
            logo: true,
            userMenu: false,
            abilityToLeave: false
        },
        main: {
            background: themeColors.white,
            fontColor: themeColors.black,
        },
        siderMenu: {
            main: {
                gap: 20,
                width: 76,
                // width: 64,
                edgePadding: 24,
                radius: 8,
                background: themeColors.white,
                fontColor: themeColors.black,
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
                    color: themeColors.white,
                    background: themeColors.grey,
                },
                background: {
                    active: themeColors.lightBlue,
                    inactive: '',
                },
                color: {
                    active: themeColors.blue,
                    inactive: themeColors.semiLightBlue,
                },
                notificationColor: themeColors.red
            }
        },
    },
    vtemplates: {
        dashboards: {
            title: 'Макет главной',
            default: { 
                title: 'Инфопанель 1', 
                component: ForumMain,
            },
            items: [],
        },
    },
    // vtemplates: {
    //     dashboards: {
    //         title: 'Макет главной',
    //         default: { 
    //             title: 'Инфопанель 1', 
    //             component: ForumMain,
    //             // component: MainDefault 
    //         },
    //         items: [],
    //     },
    //     classes: {
    //         title: 'Макеты объектов по классам',
    //         default: { title: 'По умолчанию 1', component: ObjectInfoContainer },
    //         items: [
    //             { 
    //                 class_id: 10055, 
    //                 component: ObjectBuild, 
    //                 isCustomLayout: true,
    //                 tabs: [{
    //                     mnemo: 'summary',
    //                     name: 'Сводная',
    //                     component: ObjectBuild,
    //                     default: true
    //                 },
    //                 {
    //                     mnemo: 'cableTable',
    //                     name: 'Кабельный журнал',
    //                     component: ForumObjectCables,
    //                     default: false
    //                 },
    //                 {
    //                     mnemo: 'racks',
    //                     name: 'Стойки',
    //                     component: ForumObjectRacks,
    //                     default: false
    //                 },] 
    //             },
    //             //{ class_id: 10056, component: ObjectFloor },
    //             //{ class_id: 10057, component: ObjectRoom },
    //             {
    //                 class_id: 10058,
    //                 component: ObjectStand,
    //                 hideTabs: true
    //             },
    //             {   // Страница оборудования
    //                 class_ids: forumThemeConfig.classesGroups.devices,
    //                 component: ForumDeviceVtemplate,
    //                 isCustomLayout: true,
    //                 tabs: [
    //                     {
    //                         mnemo: 'summary',
    //                         name: 'Сводная',
    //                         component: ForumDeviceVtemplate,
    //                         default: true
    //                     },
    //                     {
    //                         mnemo: 'summary',
    //                         name: 'Мониторинг',
    //                         component: ForumMonitoringTab,
    //                         default: true
    //                     }
    //                 ]
    //             },
    //             {   // Страница сервисов
    //                 class_ids: forumThemeConfig.classesGroups.services,
    //                 component: ForumServiceVtemplate,
    //                 isCustomLayout: true,
    //                 tabs: [
    //                     {
    //                         mnemo: 'summary',
    //                         name: 'Сводная',
    //                         component: ForumServiceVtemplate,
    //                         default: true
    //                     },
    //                     {
    //                         mnemo: 'summary',
    //                         name: 'Мониторинг',
    //                         component: ForumMonitoringTab,
    //                         default: true
    //                     }
    //                 ]
    //             },
    //             {   // Страница услуг здания
    //                 class_ids: forumThemeConfig.classesGroups.favor,
    //                 component: ForumFavourVtemplate,
    //                 hideTabs: true
    //             },
    //             {   // Страница услуг 
    //                 class_ids: forumThemeConfig.classesGroups.favourMain,
    //                 component: ForumProjectFavourVtemplate,
    //                 hideTabs: true
    //             },
    //             { class_id: 300, component: ForumIncident }, //Инциденты
    //         ],
    //     },
    // },
    // widgets: forumWidgets,
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
                backgroundColor: themeColors.white,
                fontColor: themeColors.black,
                borderColor: themeColors.lightGrey,
                boxShadow: '0 0 8px 0 rgba(0,0,0,0.4)', 
                borderRadius: 16,
                buttons: {
                    background: themeColors.white,
                    color: themeColors.grey
                },
                badges: {
                    background: themeColors.blue,
                    color: themeColors.white
                },
                mainTree: { 
                    enabled: true, 
                    classes: [{
                        target: [10319, 10321],
                        linking: [],
                    }],
                    groupingOrder: [
                        {
                            id: 0,
                            name: 'Класс объекта'
                        }
                    ]
                }, 
                childrenTree: { 
                    enabled: true, 
                    parentTrackedClasses: [10319, 10321],
                    classes: [{
                        target: [10320],
                        linking: []
                    }]
                }
            }
        },
        tabs: {
            showcase: {
                backgroundColorActive: themeColors.lightBlue2,
                color: themeColors.black,
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
    menu: {
        manager: ['pages', 'menu', 'rule_layouts', 'theme_settings']
    },
    pages: [
        {
            name: 'Мониторинг',
            url: '/infopanels/show/monitoring',
            vtemplate_id: null,
            id: '10022',
            isActive: true,
            component: ForumInfopanelMonitoring,
        },
        {
            name: 'Мониторинг СЦ',
            url: '/infopanels/show/monitoring-sc',
            vtemplate_id: null,
            id: '10010',
            isActive: true,
            component: ForumMonitoringSC,
        },
    ]
}


const vpnTheme = mergeTheme(commonTheme, localTheme) as ITheme

export default vpnTheme