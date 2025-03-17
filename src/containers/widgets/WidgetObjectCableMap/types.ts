export interface IWidgetObjectCableMapSettings {
    settings: {
        widget: {
            cableClasses: number[];
            childClassesIds: number[];
            targetClassesIds: number[];
            locationVisibleClassesIds: number[];
            relationsCablePort: number[];
            relationsPortDevice: number[];
            attributes?: {
                id: number,
                value: string | boolean | number,
                method: 'both' | 'some'
            },
            parentObject: number,
            mnemoMapCore: string
        }
        view?: null,
        vtemplate?: {
            objectId?: number
        }  
    },
}

export interface IWidgetObjectCableMapForm extends IWidgetObjectCableMapSettings {
    onChangeForm: <T>(data: T) => void
}