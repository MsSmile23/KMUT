import { IObject } from '@shared/types/objects'
import { findAttributeValue } from './prepare'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'


export const findObjectByAttributeId = (
    objects: IObject[], 
    referenceObject?: IObject,
    attributeId?: number
) => {
    return objects.find((obj) => {
        const monitoringObjectId = findAttributeValue(referenceObject, attributeId)
        
        return Number(monitoringObjectId) === obj.id
    })
} 
export const createMonitoringObjectName = (
    monitoringObject: IObject | undefined,
    attributeIds?: Record<'manufacturer' | 'model', number | undefined>
) => {
    const entity = monitoringObject?.name
    const manufacturer = findAttributeValue(monitoringObject, attributeIds?.manufacturer)
    const model = findAttributeValue(monitoringObject, attributeIds?.model)
    
    return `${entity || ''} ${manufacturer || ''} ${model || ''}`.trim()
}

export const createValueIndexes = (key: string, value: any) => ({
    [`${key}Print`]: value,
    [`${key}Filter`]: value,
    [`${key}Sort`]: value,
})

export const findParentName = (parents: IObject[], mnemo: string) => {
    return parents.find((parent) => forumThemeConfig.classesGroups?.[mnemo]?.includes(parent.class_id))?.name
}