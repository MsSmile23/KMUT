import { ECDatePickerRangeDefault } from './components/ECDatePickerRangeDefault/ECDatePickerRangeDefault'
import { ECDatePickerRangeSimpleFilters } from './components/ECDatePickerRangeSimpleFilters/ECDatePickerRangeSimpleFilters';
import { ECDateRangePickerMode, ECDateRangePickerModesProps } from './types'

export interface IECDateRangePicker<Mode extends ECDateRangePickerMode> {
    mode: Mode,
    props: ECDateRangePickerModesProps[Mode]
}

export const ECDateRangePicker = <M extends ECDateRangePickerMode = 'default'>({
    mode,
    props,
}: IECDateRangePicker<M>) => {
    const pickerMode = mode || 'default';

    if (pickerMode === 'ecSimpleFilters') {
        return <ECDatePickerRangeSimpleFilters {...props as ECDateRangePickerModesProps['ecSimpleFilters']} />
    }

    return <ECDatePickerRangeDefault {...props as ECDateRangePickerModesProps['default']} />
}