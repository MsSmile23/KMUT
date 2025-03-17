import { dataLayoutType } from '@containers/settings/layout/LayoutSettings'
import { IClass } from '@shared/types/classes'
import { ButtonProps, ThemeConfig } from 'antd'
import { CSSProperties, FC, ReactNode } from 'react'
import newYearImage from '*.jpg';
import { ITempModificatWithGetValue } from '@shared/types/temp-modification';

interface ILoginPage {
    logo: string | FC,
    background: string
    color: string
}
interface IPreloadPage extends ILoginPage {
    slides: { id: number, element: FC }[]
}
interface IInterfacesPage extends ILoginPage {
    background: string
}

interface IMainPage {
    logo: string | FC,
    header: {
        background: string
        color: string
    },
    main: {
        background: string
        color: string
    }
    footer: {
        background: string,
        color: string
    },
}

export interface IProjectSettings extends ILocalTheme {
    title?: string
    page?: {
        login?: ILoginPage,
        interfaces?: IInterfacesPage,
        preload?: IPreloadPage,
        main?: IMainPage
    },
    charts?: Record<string, any>
    themeMode?: string
}

export enum IThemes {
    DEFAULT = 'default',
    MISHK = 'mishk',
    ZAGS = 'zags',
    SIRIUS = 'sirius',
    DARK = 'dark',
    LIGHT = 'light',
    FORUM = 'forum',
    FNS = 'fns',
    VPN = 'vpn',
    CYPR = 'cypr'
}

/**
 * Новый формат типизации темы 
 * @type components - для темизации отдельных shared компонент
 * @type TComponentMnemo - служит для передачи мнемоник компонентов для rewrite темизации только конкретных
 * @type TComponent - служит для типизации темизации под каждый тип интерфейса 
 * (на уровне локальной темы могут быть не все)
 */
export type ITheme<
    TComponentMnemo = IThemeComponentMnemo,
    TComponent = Partial<IThemeComponent>
> =
    TComponentMnemo extends IThemeComponentMnemo
        ?
        ILocalTheme & {
            components: Record<IThemeComponentMnemo, TComponent>,
        }
        : never

export enum IThemeComponentMnemo {
    tables = 'tables',
    buttons = 'buttons',
    tree = 'tree',
    tabs = 'tabs',
    map = 'map',
    paddings = 'paddings'
}

export type IThemeComponentMnemoType = typeof IThemeComponentMnemo 

export type IThemeComponent = {
    constructor: any,
    manager: any,
    showcase: any,
}

export interface ITabs {
    activeTabBackgroundColor?: string
}

type TCustomButton = 'add' | 'download' | 'columns'
type TCustomButtonStyle = 'Enabled' | 'Bg' | 'Border' | 'Shadow' | 'Icon'
type TButtonDesign = `${TCustomButton}${TCustomButtonStyle}`
type TStyle = {
    style?: CSSProperties
    bodyStyle?: CSSProperties
    props?: Record<string, any>
}
type TTableStyle = {
    Edit?: {
        Buttons?: Partial<Record<Partial<TButtonDesign>, string | boolean>> & TStyle,
        ButtonsCard?: {
            design?: ThemeConfig['components']['Card'],
        } & TStyle
        Paginator?: {
            enabled?: boolean
        },
        Pagination?: {
            enabled?: boolean
        },
        Table?: {
            design?: ThemeConfig['components']['Table'],
            reports?: {
                linkedClassesForObjects?: number[]
            }
        } & TStyle,
        TableCard?: {
            design?: ThemeConfig['components']['Card'],
        } & TStyle,
        Drawer?: {
            design?: ThemeConfig['components']['Drawer'],
        } & {
            // todo: вынести отдельно footerBg в DrawerFooter?
            style?: CSSProperties & { footerBg: string, footerHeight: number | string }
            bodyStyle?: CSSProperties
        },
    }
}
type TTablesByInterface = {
    constructor?: TTableStyle
    manager?: TTableStyle
    showcase?: TTableStyle
}

export interface IPadding {
    isActive: boolean;
    value: number;
}

export interface ILocalTheme {
    title?: string
    titleSettings?: {
        text: string,
        newYearImage: string,
        fontSize: number,
        fontWeight: number,
        color: string
    }
    header?: {
        background?: string,
        textColor?: string,
        logo?: string
        hideSearch?: boolean
    },
    backgroundColor?: string,
    widget?: {
        textColor?: string,
        background?: string
        shadowWidth?: string,
        shadowColor?: string
    },
    sideBar?: {
        background?: string,
        textColor?: string,
        width?: number
    },
    filter: {
        filtersTextColor: string,
        filtersBorderColor: string,
    },
    hideLeftSidebar?: boolean

    baseDecoration?: any,
    projectThemeMode?: string

    system?: {
        showcaseObjects: {
            packages: number[]
            classes: number[]
        },
        managerObjects: {
            packages: number[]
            classes: number[]
            mainClasses: number[]
        },
    }

    paddings?: {
        basePadding?: number
        leftPaddingMenu?: IPadding;
        headerPadding?: IPadding;
        headerContentPadding?: IPadding;
        rightPaddingContent?: IPadding;
        bottomPaddingContent?: IPadding;
        menuSidebar?: IPadding;
        upAndDownTreePadding?: IPadding;
        sidebarPageContentPadding?: IPadding;
        verticalWidgetPadding?: IPadding;
        horizontalWidgetPadding?: IPadding;
    };
    map?: {
        tilesUrl?: string
    }
    colors?: {mnemo: string, name: string, color: string}[]
    tabs?: ITabs,
    table?: any,
    dark?: {
        background: string,
        fontColor: string, 
        colors?: {mnemo: string, name: string, color: string}[]
    } 
    background?: string,
    textColor?: string,

    menu?: {
        background?: string,
        width?: number
        manager: Array<'pages' | 'menu' | 'rule_layouts' | 'discovery'| 'theme_settings'>,
        inactiveMenu: {
            textColor?: string,
            background?: string
        },
        activeMenu: {
            textColor?: string,
            background?: string
        }
    }
    externalTicketUrl?: string
    tempModifications?: ITempModificatWithGetValue,
    licenseStatus?: boolean,
    themeMode?: string
    checkHealthBlocking?: boolean
    font?: string
    layout?: dataLayoutType
    vtemplates?: {
        dashboards: {
            title: string,
            default: { title: string, component: FC },
            // todo: посмотреть где используется и типизировать
            items: any[],
        },
        classes: {
            title: string,
            default: { 
                title: string, 
                component: FC 
            },
            items: Array<{ 
                isCustomLayout?: boolean
                classId?: number, 
                class_id?: number 
                class_ids?: IClass['id'][]
                component: FC
                tabs?: {
                    mnemo: string
                    name: string
                    component: FC
                    default: boolean
                }[]
            }>
        },
    },
    widgets?: { mnemo: string, title: string, component: ReactNode}[],
    tables?: TTablesByInterface
    tree?: {
        backgroundColor: string
        fontColor: string
        borderColor: string
        boxShadow: string
        borderRadius: number
        mainTree: {
            enabled: boolean,
            classes: {
                target: IClass['id'][],
                linking: [],
            }[],
        },
        childrenTree: {
            enabled: boolean,
            parentTrackedClasses: IClass['id'][],
            classes: { 
                    target: IClass['id'][], 
                    linking: IClass['id'][], 
                }[], 
        },
    },
    pages?:
        {
            name: string,
            url: string,
            vtemplate_id: null,
            id: string,
            isActive: boolean,
            component?: FC,
        }[]
}