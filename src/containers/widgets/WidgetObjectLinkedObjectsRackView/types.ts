import { IObjectLinkedObjectsRackViewProps } from '@entities/objects/ObjectLinkedObjectsRackView/ObjectLinkedObjectsRackView'

export interface IWidgetObjectLinkedObjectsRackViewSettings {
    settings: {
        widget: IObjectLinkedObjectsRackViewProps & { objectId?: number }
        vtemplate: { objectId?: number }
        view?: null
    }
}

export interface IWidgetObjectLinkedObjectsRackViewForm extends IWidgetObjectLinkedObjectsRackViewSettings {
    onChangeForm: <T>(data: T) => void
}

export interface IWidgetObjectLinkedObjectsRackViewSettingsProps extends IWidgetObjectLinkedObjectsRackViewSettings {}