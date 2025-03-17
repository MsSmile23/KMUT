import { ModalType } from './types/types'

export const initialDataModalTab = {
    key: '',
    name: '',
    objectBinding: undefined,
    enabledStatelable: false,
    group_name: '',
    type: undefined,
    settings: {
        targetClasses: [],
        connectingClasses: [],
    },
    objectGroupPreview: undefined,
}

export const initialDataSettingManageZoneTab = {
    typeManageElement: 0,
    typeEditContent: 0
}

export const initialDataSettingUnManageZoneTab = {
    typeEditContent: 0
}

export const initialDataSettingVT = {
    name: '',
    maketType: 0,
    purpose: 0,
    classes: [],
    objectId: undefined
}

export const textModalTitle = {
    [ModalType.SETTING_VT]: 'Базовая настройка Макета',
    [ModalType.SETTING_VT_TAB]: 'Настройки таба',
    [ModalType.SETTING_MANAGE_ZONE]: 'Настроки зоны табов',
    [ModalType.SETTING_MAKRO_ZONE]: 'Выбор макро-зоны'
}

export const maketTypesList = [
    { label: 'Панель виджетов', value: 1 },
    { label: 'Инфопанель', value: 2 }
]

export const purposeList = [
    { label: 'Общий Макет', value: 1 },
    { label: 'Макет объекта', value: 2 },
    { label: 'МП Общий', value: 3 },
    { label: 'МП Объект', value: 4 }
]

export const tabTypesList = [
    { label: 'Статичная вкладка', value: 'single' },
    { label: 'Группа вкладок', value: 'group' }
]

export const builderDataList = [
    { label: 'Данные превью объекта с автообновлением', value: 'previewReload' },
    { label: 'Данные превью объекта', value: 'preview' },
    { label: 'Мок данные', value: 'mockData' }
]