import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'

export const fakeInitial = {
    childClassesIds: [10137, 10138, 10215, 10147, 10214, 10140, 10141, 10142, 10143, 10217],
    parentClasses: {
        0: { id: 10097, showObjectProps: ['name'], attributeIds: [] },
        1: { id: 10082, showObjectProps: ['name'], attributeIds: [] },
        2: { id: 10058, showObjectProps: ['name'], attributeIds: [] },
        3: { id: 10105, showObjectProps: ['name'], attributeIds: [] },
        4: { id: 10056, showObjectProps: ['name'], attributeIds: [] },
        6: { id: 10055, showObjectProps: ['name'], attributeIds: [] },
    },
    targetClasses: {
        ids: forumThemeConfig.classesGroups.devices,
        attributeIds: [],
        //filterByAttributes: (a) => a.readonly && a.history_to_db
    },
    statusColumn: 'Состояние оборудованияяя'
}

export const baseColumnsOptions = [
    { value: 'id', label: 'ID' }, 
    { value: 'object__name', label: 'Наименование' },
    { value: 'status__column', label: 'Состояние оборудования' }
]