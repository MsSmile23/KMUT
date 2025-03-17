import { IECDatePickerDefaultProps } from './components/ECDatePickerDefault/ECDatePickerDefault';

export type ECDatePickerModesProps = {
    default: IECDatePickerDefaultProps,
}

export type ECDatePickerMode = keyof ECDatePickerModesProps;