import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'

export const initialObjectCableTableClassesForum = {
    childs: [
        ...(forumThemeConfig.classesGroups?.services || []),
        ...(forumThemeConfig.classesGroups?.rooms || []),
        ...(forumThemeConfig.classesGroups?.floors || []),
        ...(forumThemeConfig.classesGroups?.racks || []),
        ...(forumThemeConfig.classesGroups?.favor || []),
        ...(forumThemeConfig.classesGroups?.units || []),
    ],
    target: forumThemeConfig.classesGroups?.devices || [],
}

export const cableTableTranslation = {
    deviceA: {
        base: 'Наименование',
        attribute: 'Оборудование',
    },
    deviceClassA: {
        base: 'Класс оборудования',
    },
    deviceLocationA: {
        base: 'Расположение оборудования',
    },
    portA: {
        base: 'Порт подключения',
        attribute: 'Порт',
    },
    portClassA: {
        base: 'Класс порта подключения',
    },
    deviceB: {
        base: 'Наименование подключаемого оборудования',
        attribute: 'Подключаемое оборудование',
    },
    deviceClassB: {
        base: 'Класс подключаемого оборудования',
    },
    deviceLocationB: {
        base: 'Расположение подключаемого оборудования',
    },
    portB: {
        base: 'Порт подключаемого оборудования',
        attribute: 'Порт подключаемого оборудования',
    },
    portClassB: {
        base: 'Класс порта подключаемого оборудования',
    },
    cableType: {
        base: 'Тип кабеля',
        attribute: 'Тип кабеля',
    },
}

export const classesFormItems = [
    { name: 'cableClasses', label: 'Классы кабелей' },
    { name: 'portClasses', label: 'Классы портов' },
    { name: 'childClassesIds', label: 'Дочерние классы' },
    { name: 'targetClassesIds', label: 'Целевые классы' },
    { name: 'locationVisibleClassesIds', label: 'Классы отображаемых конструкций' },
    { name: 'devicesClasses', label: 'Классы устройств' }
]