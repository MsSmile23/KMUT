/* 

Сейчас при клике на строку показывается карточка объекта мониторинга

Что меняем
- Переводим показ карточки объекта мониторинга на иконку (вторую) в гриде инцидентов
- По клику на строку показываем кастомную модалку со сборной информацией об инциденте

Поля вывода в модалке
1 ID (id объекта Инцидента)
2 Почтовый адрес (атрибут Объекта мониторинга)
3 Наименование Здание (как в строке таблицы)
4 Этаж (name объекта класса Этаж, найденного функцией поиска вверх - добавить в целевые классы)
5 Помещение (name объекта класса Помещение, найденного функцией поиска вверх - добавить в целевые классы)
6 Стойка (name объекта класса Стойка, найденного функцией поиска вверх - добавить в целевые классы)
7 Юнит (name объекта класса Стойка, найденного функцией поиска вверх - добавить в целевые классы)
8 Наименование оборудование (name Объекта мониторинга)
9 Модель (атрибут Объекта мониторинга - добавят)
10 Производитель (атрибут Объекта мониторинга)
11 Тип оборудования (name класса Объекта мониторинга)
12 Тип инцидента (нарушение, отклонение и т.д.)
13 Описание инцидента (атрибут Инцидента)
14 Уровень критичности (атрибут Инцидента)
15 Дата и время начала (атрибут Инцидента)
16 Дата и время окончания (атрибут Инцидента)
17 Длительность (как в строке таблицы)
18 Сервис (как в строке таблицы)
19 Услуга (как в строке таблицы)
20 IP-адрес мониторинга (атрибут Объекта мониторинга)
21 Серийный номер (атрибут Объекта мониторинга)
22 Инвентарный номер (атрибут Объекта мониторинга)
23 ФИО ответственного (атрибут Объекта мониторинга)
24 Номер заявки в SD (из SD) (атрибут Инцидента - добавят)
25 Статус решения в SD (из SD) (атрибут Инцидента - добавят)
26 Ответственный специалист (из SD) (атрибут Инцидента - добавят)
27 Кнопка перехода на страницу оборудования (иконка как в строке)
28 Кнопка перехода на страницу инцидента в SD (иконка как в строке, id и url предоставят)

*/

import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { findChildObjects_TEST } from '@shared/utils/objects'

export const orderedInfo = [
    'id',
    'incidentAttributeId_10173',
    'incidentAttributeId_10174',
    'incidentAttributeId_10175',
    'post',
    'building',
    'floor',
    'room',
    'rack',
    'unit',
    'monitoringObjectName',
    'model',
    'manufacturer',
    'monitoringObjectType',
    'incidentType',
    'description',
    'criticality',
    // todo: начало и конец возможно стоит заменить на поля в prepare.ts
    'incidentAttributeId_10110',
    'incidentAttributeId_10111',
    'duration',
    'service',
    'favor',
    'ip',
    'serial',
    'inventoryNumber',
    'responsibleCredentials',
    'requestNumber',
    'status',
    'specialist',
]

const findAttributeValue = (obj: IObject, id: number) => {
    return obj?.object_attributes.find((oa) => oa.attribute_id === id)?.attribute_value
}

export const createInfo = ({
    monitoringObject,
    attributeIds,
}: {
    monitoringObject: IObject,
    attributeIds: Record<string, number>
}) => {
    const result = findChildObjects_TEST({
        objects: useObjectsStore.getState().store.data,
        object: monitoringObject,
        targetClasses: [
            ...classesGroups.buildings,
            ...classesGroups.rooms, 
            ...classesGroups.floors,
            ...classesGroups.racks,
            ...classesGroups.units,
            ...forumThemeConfig.classesGroups.devices,
            ...forumThemeConfig.classesGroups.favor,
            ...forumThemeConfig.classesGroups.services
        ]
    })
    
    const findObject = (ids: number[]) => result.find((el) => ids.includes(el?.class_id))

    return {
        post: {
            key: 'post',
            title: 'Почтовый адрес',
            value: findAttributeValue(monitoringObject, attributeIds?.post),
        },
        floor: {
            key: 'floor',
            title: 'Этаж',
            value: findObject(classesGroups.floors)?.name,
        },
        room: {
            key: 'room',
            title: 'Помещение',
            value: findObject(classesGroups.rooms)?.name,
        },
        rack: {
            key: 'rack',
            title: 'Стойка',
            value: findObject(classesGroups.racks)?.name,
        },
        unit: {
            key: 'unit',
            title: 'Юнит',
            value: findObject(classesGroups.units)?.name,
        },
        monitoringObjectName: {
            key: 'monitoringObjectName',
            title: 'Наименование оборудование',
            value: monitoringObject?.name,
        },
        model: {
            key: 'model',
            title: 'Модель',
            value: findAttributeValue(monitoringObject, attributeIds?.model)
        },
        manufacturer: {
            key: 'manufacturer',
            title: 'Производитель',
            value: findAttributeValue(monitoringObject, attributeIds?.manufacturer)
        },
        monitoringObjectType: {
            key: 'monitoringObjectType',
            title: 'Тип оборудования',
            value: monitoringObject?.class?.name
        },
        incidentType: {
            key: 'incidentType',
            title: 'Тип инцидента',
            value: undefined
        },
        monitoringIp: {
            key: 'ip',
            title: 'IP-адрес мониторинга',
            value: findAttributeValue(monitoringObject, attributeIds?.type)
        },
        serialNumber: {
            key: 'serial',
            title: 'Серийный номер',
            value: findAttributeValue(monitoringObject, attributeIds?.serial)
        },
        inventoryNumber: {
            key: 'inventoryNumber',
            title: 'Инвентарный номер',
            value: findAttributeValue(monitoringObject, attributeIds?.inventory)
        },
        responsible: {
            key: 'responsibleCredentials',
            title: 'ФИО ответственного',
            value: findAttributeValue(monitoringObject, attributeIds?.responsible)
        },
        requestNumber: {
            key: 'requestNumber',
            title: 'Номер заявки',
            value: findAttributeValue(monitoringObject, attributeIds?.request)
        },
        status: {
            key: 'status',
            title: 'Статус решения',
            value: findAttributeValue(monitoringObject, attributeIds?.status)
        },
        specialist: {
            key: 'specialist',
            title: 'Ответственный специалист',
            value: findAttributeValue(monitoringObject, attributeIds?.specialist)
        },
    }
}