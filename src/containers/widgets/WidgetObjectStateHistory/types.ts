import { IStateHistoryProps } from '@entities/states/ObjectStateHistory/ObjectStateHistory'

export interface IWidgetObjectStateSettings {
    settings: {
        widget: IStateHistoryProps
        view?: null,
        vtemplate?: {
            objectId?: number
        }
    }
}

export interface IWidgetObjectStateFormProps extends IWidgetObjectStateSettings {
    onChangeForm: <T>(data: T) => void
}