import { commonTheme } from '@app/themes/const'
import ObjectInfoContainer from '@containers/objects/ObjectCardContainer/ObjectInfoContainer/ObjectInfoContainer'
import { MainDefault } from '@containers/vtemplates/fns/MainDefault'
import { ObjectInspection } from '@containers/vtemplates/fns/ObjectInspection'
import { ObjectTorm } from '@containers/vtemplates/fns/ObjectTorm'
import { ILocalTheme } from '../types'

const localTheme: ILocalTheme = {
    title: 'Мониторинг ИКТ КМУТ',
    titleSettings: {
        text: 'Мониторинг ИКТ КМУТ',
        fontSize: 16,
        fontWeight: 600,
        color: '#26ade4',
    },
    font: 'Inter, serif',
    map: {
        tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    colors: [
        {
            mnemo: 'primaryColor',
            name: 'Основной цвет',
            color: '#000000',
        },
        {
            mnemo: 'secondaryColor',
            name: 'Вспомогательный цвет',
            color: '#ffffff',
        },
        {
            mnemo: 'textColor',
            name: 'Цвет текста',
            color: '#ffffff',
        },
    ],
    dark: { colors: [
        {
            mnemo: 'primaryColor',
            name: 'Основной цвет',
            color: '#000000',
        },
        {
            mnemo: 'secondaryColor',
            name: 'Вспомогательный цвет',
            color: '#000000',
        },
        {
            mnemo: 'textColor',
            name: 'Цвет текста',
            color: '#000000',
        },
    ],
    },

    layout: {
        notFoundPage: {
            background: '#ffffff',
            color: 'rgba(44, 160, 207, 1)',
        },
        header: {
            background: '#ffffff',
            // background: '#1B2E47',
            font: {
                color: 'rgba(44, 160, 207, 1)',
                size: 16,
            },
            visibility: true,
            menuAvailability: false,
            logo: {
                enabled: true,
                src: '/png/KMUT_logo.png',
            },
            menu: {
                background: '#272E3D',
                color: '#ffffff',
            },
            userMenu: {
                enabled: true,
                icon: 'UserOutlined',
                fullName: true,
                border: {
                    color: '#0740AC',
                    width: 0,
                    radius: '50%',
                },
                background: '#0740AC',
                iconBackground: '#ffffff',
                font: {
                    color: '#000000',
                    size: 14,
                },
            },
            search: {
                background: '#ffffff',
                buttonColor: 'rgba(201, 234, 248, 1)',
                iconColor: 'rgba(44, 160, 207, 1)',
                placeholderColor: 'rgba(0, 0, 0, 0.25)',
                text: '#000000',
                width: '350px',
            },
            leftSidebarToggleButton: false,
            rightSidebarToggleButton: false,
            horizontalPadding: 24,
            verticalPadding: 0,
        },
        main: {
            background: '#ffffff',
            fontColor: '#000000',
        },
        footer: {
            background: '#ffffff',
            fontColor: 'white',
            visibility: false,
            menuAvailability: false,
        },
        leftSidebar: {
            background: '#ffffff',
            fontColor: 'black',
            visibility: true,
            menuAvailability: true,
            logo: false,
            userMenu: false,
            abilityToLeave: false,
            onlyVisibleOnMain: false,
        },
        rightSidebar: {
            background: '#ffffff',
            fontColor: 'black',
            visibility: false,
            menuAvailability: false,
            logo: true,
            userMenu: false,
            abilityToLeave: false,
        },
        siderMenu: {
            main: {
                gap: 20,
                width: 76,
                // width: 64,
                edgePadding: 24,
                radius: 8,
                background: '#ffffff',
                fontColor: '#000000',
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
                    color: '#ffffff',
                    background: '#555D60',
                },
                background: {
                    active: 'rgba(201, 234, 248, 1)',
                    inactive: '',
                },
                color: {
                    active: 'rgba(44, 160, 207, 1)',
                    inactive: 'rgba(179, 210, 226, 1)',
                },
                notificationColor: 'rgba(255, 89, 89, 1)',
            },
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
    // },
    components: {
        tables: {
            constructor: {
                Edit: {
                    ButtonsCard: {
                        style: {
                            border: 'none',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            overflow: 'hidden',
                            padding: 0,
                        },
                        bodyStyle: {
                            padding: 5,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderBottomWidth: 0,
                            overflow: 'hidden',
                        },
                    },
                    TableCard: {
                        style: {
                            border: 'none',
                        },
                        bodyStyle: {
                            padding: 0,
                            overflow: 'hidden',
                        },
                    },
                    Pagination: {
                        enabled: false,
                    },
                    Paginator: {
                        enabled: false,
                    },
                    Drawer: {
                        style: {
                            footerBg: '#F4F4F5',
                            footerHeight: 68,
                        },
                    },
                },
            },
            manager: {
                Edit: {
                    ButtonsCard: {
                        style: {
                            border: 'none',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            overflow: 'hidden',
                            padding: 0,
                        },
                        bodyStyle: {
                            padding: 5,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderBottomWidth: 0,
                            overflow: 'hidden',
                        },
                    },
                    TableCard: {
                        style: {
                            border: 'none',
                        },
                        bodyStyle: {
                            padding: 0,
                            overflow: 'hidden',
                        },
                    },
                    Pagination: {
                        enabled: false,
                    },
                    Paginator: {
                        enabled: false,
                    },
                    Drawer: {
                        style: {
                            footerBg: '#F4F4F5',
                            footerHeight: 68,
                        },
                    },
                },
            },
            showcase: {
                Edit: {
                    Table: {
                        design: {
                            borderColor: 'rgba(0,0,0,0.1)',
                            headerBorderRadius: 0,
                            headerBg: '#ffffff',
                        },
                        style: {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderBottomWidth: 0,
                            borderTop: '1px solid rgba(0,0,0,0.1)',
                        },
                    },
                    Paginator: {
                        enabled: true,
                    },
                    Buttons: {
                        downloadEnabled: true,
                        downloadBg: 'white',
                        columnsIcon: 'LayoutOutlined',
                        props: {
                            scrollSize: 'middle',
                        },
                    },
                    ButtonsCard: {
                        style: {
                            border: 'none',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            overflow: 'hidden',
                            padding: 0,
                        },
                        bodyStyle: {
                            padding: '22px 16px',
                            background: '#E9F7FC',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderBottomWidth: 0,
                            overflow: 'hidden',
                        },
                    },
                    TableCard: {
                        style: {
                            border: '1px solid rgba(0,0,0,0.1)',
                        },
                        bodyStyle: {
                            padding: 0,
                            overflow: 'hidden',
                        },
                    },
                    Pagination: {
                        enabled: false,
                    },
                    Drawer: {
                        style: {
                            footerBg: '#F4F4F5',
                            footerHeight: 68,
                        },
                    },
                },
            },
        },
        tabs: {
            showcase: {
                backgroundColorActive: '#E9F7FC',
                color: '#000000',
                margin: '0',
                padding: '10px',
                border: '1px solid rgba(226, 226, 226, 1)',
                borderRadius: '0',
                boxShadow: 'none',
            },
        },
        tree: {
            showcase: {
                backgroundColor: '#ffffff',
                fontColor: '#000000',
                borderColor: '#f0f0f0',
                boxShadow: '0 0 8px 0 rgba(0,0,0,0.4)',
                borderRadius: 16,
                buttons: {
                    background: '#ffffff',
                    color: '#555D60',
                },
                badges: {
                    background: 'rgba(44, 160, 207, 1)',
                    color: '#ffffff',
                },
                mainTree: {
                    enabled: true,
                    classes: [
                        {
                            target: [],
                            linking: [],
                        },
                    ],
                },
                childrenTree: {
                    enabled: true,
                    parentTrackedClasses: [],
                    classes: [
                        {
                            target: [],
                            linking: [],
                        },
                    ],
                },
            },
        },
        map: {
            showcase: {
                startZoom: 14,
                mapCenter: [55.7522, 37.6156],
                attributesBind: {
                    coordinates: undefined,
                },
            },
        },
    },
    themeConfig: {
        classesGroup: {
            devices: [10034, 10036]
        },
        relationsIds: [10050, 10096],
    }
}

// todo: исправить дефолтный экспорт (пересмотреть getViewTemplate)
export default { ...commonTheme, ...localTheme }