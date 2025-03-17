import { IAttributeHistoryDateIntervalForGet } from '@shared/types/attribute-history'

export type TECDatePickerWithPresets = {
    viewType?: 'buttons' | 'select'
    setDateInterval: (value: IAttributeHistoryDateIntervalForGet) => void
}