import { ModalType } from './types/types'

export const initialBaseSettingsVT = {
    name: '',
    maketType: 0,
    purpose: 0,
    classes: [],
    objectId: undefined
}

export const textModalTitle = {
    [ModalType.SETTING_VT]: 'Базовая настройка Макета МП',
    [ModalType.SETTING_VT_TAB]: 'Настройки таба',
    [ModalType.SETTING_MANAGE_ZONE]: 'Настройки зоны табов',
    [ModalType.SETTING_MAKRO_ZONE]: 'Выбор макро-зоны'
}

export const resolutionOptions = [
    { value: '{"width":360,"height":640}', label: '360x640 (Galaxy S5)' },
    { value: '{"width":360,"height":740}', label: '360x740 (Galaxy S8+)' },
    { value: '{"width":412,"height":915}', label: '360x780 (Galaxy S20 Ultra/Pixel 7)' },
    { value: '{"width":360,"height":780}', label: '360x780 (Pixel 4)' },
    { value: '{"width":375,"height":667}', label: '375x667 (iPhone 6/7/8)' },
    { value: '{"width":414,"height":896}', label: '414x896 (iPhone X/11)' },
    { value: '{"width":390,"height":844}', label: '390x844 (iPhone 12 Pro)' },
    { value: '{"width":430,"height":932}', label: '390x844 (iPhone 14 Pro Max)' },
]

export const initialDataModalTab = {
    key: '',
    objectBinding: undefined,
    enabledStatelable: false,
    group_name: '',
    children: '',
    label: '',
    currentLabel: '',
    type: undefined,
    settings: {
        targetClasses: [],
        connectingClasses: [],
    },
    objectGroupPreview: undefined,
}