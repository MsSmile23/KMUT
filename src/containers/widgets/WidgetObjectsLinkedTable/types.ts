import { IAttribute } from '@shared/types/attributes'
import { IObject } from '@shared/types/objects'

export interface IWidgetObjectsLinkedTableSettings {
    scrollX?: number
    parentObject?: number | IObject
    settings: {
        widget: {
            parentClasses: Array<{ 
                id: number, 
                showObjectProps?: string[], 
                attributeIds?: number[] 
            }>
            targetClasses: Partial<{
                ids: number[]
                attributeIds: number[]
                filterByAttributes: (attribute: IAttribute) => boolean
            }>
            statusColumn?: string
            classColumn?: string
            parentObjectId: number
            childClassesIds?: number[]
            relationIds?: number[]
            columnsOrder?: string[]
            chosenDataIndex?: string,
            hideChosenColumns?: boolean
            tableId?: string
        },
        view?: null,
        vtemplate?: {
            objectId?: number
        }  
    },
}

export interface IWidgetObjectsLinkedTableForm extends IWidgetObjectsLinkedTableSettings {
    onChangeForm: <T>(data: T) => void
}