import { IObjectLinkedGroupedStatesProps } from '@entities/objects/ObjectLinkedGroupedStates/ObjectLinkedGroupedStates'

export interface IObjectLinkedGroupedStatesSettings {
    settings: {
        widget: IObjectLinkedGroupedStatesProps
        view?: null,
        vtemplate?: {
            objectId?: number
        }  
    },
}

export interface IWidgetObjectLinkedGroupedStatesForm extends IObjectLinkedGroupedStatesSettings {
    onChangeForm: <T>(data: T) => void
}