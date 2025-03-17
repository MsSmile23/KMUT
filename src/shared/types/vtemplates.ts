import { ReactNode } from 'react'
import { TPage } from './common'
import { widgetType } from './widgets'


export type paramsVtemplate = {
    tabs: TabsArrType[],
    dataToolbar: TInitialDataSettingVTType,
    layoutContentManageZone: { [x: string]: layoutType },
    layoutContentUnmanageableZone: layoutType,
    dataSettingManageZoneTab: TDataSettingManageZoneTabType,
    dataSettingUnmanageZoneTab: TDataSettingUnmanageZoneTabType,
    dataSettingFullScreenZone: TDataSettingFullScreenZone,
    makroZone: number,
    showHeaderZone: boolean,
    typeTabs: 'vertical' | 'horizontal',
    builderData: 'previewReload' | 'preview' | 'mockData'
}

export interface dataVtemplateProps<T> {
    id: number,
    mnemonic: string,
    name: string
    params: T,
    vtemplate_type: {
        id: number,
        mnemonic: string,
        name: string,
        params: string
    },
    vtemplate_type_id: number
}

export enum MacroZoneType {
    MANAGE_ZONE = 1,
    UNMANAGE_ZONE = 2,
    FULLSCREEN_ZONE = 3,
    DEFAULT_ZONE = 0
}

export enum VTGeneratorToolbarType {
    SETTING = 'setting',
    ADD_TOP_BLOCK = 'add_top_block',
    SHOW = 'show',
    EDIT = 'edit',
    CLEAR = 'clear',
    SAVE = 'save',
    SAVE_AND_EXIT = 'save_and_exit',
    CANCEL = 'cancel',
    MAKRO_ZONE = 'makroZone',
    EXPORT_JSON = 'export_json',
    IMPORT_JSON = 'import_json'
}

export enum ModalType {
    SETTING_VT = 'settingVT',
    SETTING_VT_TAB = 'settingVTTab',
    SETTING_MANAGE_ZONE = 'settingManageZone',
    SETTING_UNMANAGE_ZONE = 'settingUnmanageZone',
    SETTING_MAKRO_ZONE = 'settingMacroZone',
    SETTING_DEFAULT = ''
}

export type TabsArrType = {
    key: string,
    label: ReactNode | '',
    currentLabel: string,
    children: ReactNode | string,
    content?: any,
    object_preview?: any,
    type?: string,
    settings?: {
        targetClasses: number[],
        connectingClasses: number[],
    }
    objectBinding?: string,
    enabledStatelable?: boolean,
    group_name?: string,
    objectGroupPreview?: number,
    tabOutputMode?: 'individualTabs' | 'tabsList'
}

export type initialDataToolbarType = {
    preview: boolean,
    nameVtemplate: string,
    classId: string,
    transmitSubjectId: boolean
}

export type initialDataModalTabtype = {
    key: string
    name: string
    type?: string
    settings?: {
        targetClasses: number[]
        connectingClasses: number[]
    }
    objectBinding?: string
    enabledStatelable?: boolean
    group_name?: string
    objectGroupPreview?: number
    tabOutputMode?: 'individualTabs' | 'tabsList'
}

export type initialItemsProps = {
    tabs: TabsArrType[],
    oldTabs: TabsArrType[]
}

export enum requestVtemplate {
    POST = 'post',
    PATCH = 'patch'
}

export type TInitialDataSettingVTType = {
    name: string,
    maketType: number,
    purpose: number,
    classes: number[],
    objectId?: number,
    objectBindings?: number[],
    mnemonic?: string,
    layotWidth?: number,
    layotHeight?: number,
    pageBinding?: TPage,
    builderData?: TBuilderData,
    vtemplateId?: number,
    filters?: any[]
}

export type TDataSettingManageZoneTabType = {
    typeManageElement: number,
    typeEditContent: number,
    isMiniHeader?: boolean
}

export type TDataSettingUnmanageZoneTabType = {
    typeEditContent: number
}

export interface layoutType {
    widgets: widgetType[],
    allZones: any
    edit: boolean,
    cols: number,
    breakpoint: string
    width: number
}

export interface IDataModalMacroZone {
    typeEditContent: MacroZoneType, 
    typeTabs: 'vertical' | 'horizontal'
}

export type TBuilderData = 'previewReload' | 'preview' | 'mockData'

export type TDataSettingFullScreenZone = widgetType