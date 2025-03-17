export interface IObjectСableTableWidgetSettings {
    settings: {
        widget: {
            devicesClasses?: number[]
            cableClasses: number[],
            portClasses: number[],
            childClassesIds: number[],
            targetClassesIds: number[],
            locationVisibleClassesIds: number[],
            relationsCablePort: number[],
            relationsPortDevice: number[],
            upDownAttributeId: number,
            columnsAttributesIds: number[],
            attributeIdPortName: number
            paintCablesByState?: boolean
            attributes: {
                id: number,
                value: string | boolean | number,
                method: 'both' | 'some'
            }
        }
        view?: null,
        vtemplate?: {
            objectId?: number
        }  
    },
}

export interface IObjectСableTableWidgetForm extends IObjectСableTableWidgetSettings {
    onChangeForm: <T>(data: T) => void
}