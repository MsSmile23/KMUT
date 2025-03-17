import { ECDatePickerMode, ECDatePickerModesProps } from './types'
import { ECDatePickerDefault } from './components/ECDatePickerDefault/ECDatePickerDefault';

export interface IECDatePicker<Mode extends ECDatePickerMode = 'default'> {
    mode?: Mode,
    props: ECDatePickerModesProps[Mode];
}

export const ECDatePicker = <T extends ECDatePickerMode = 'default'>({
    props,
    mode,
}: IECDatePicker<T>) => {
    const datePickerMode = mode || 'default';

    return (
        <ECDatePickerDefault {...props as ECDatePickerModesProps['default']} />
    )
}