import { IECDatePickerRangeDefaultProps } from './components/ECDatePickerRangeDefault/ECDatePickerRangeDefault';
import { IECDatePickerRangeSimpleFiltersProps } from './components/ECDatePickerRangeSimpleFilters/ECDatePickerRangeSimpleFilters'

export type ECDateRangePickerModesProps = {
    default: IECDatePickerRangeDefaultProps,
    ecSimpleFilters: IECDatePickerRangeSimpleFiltersProps,
}

export type ECDateRangePickerMode = keyof ECDateRangePickerModesProps;