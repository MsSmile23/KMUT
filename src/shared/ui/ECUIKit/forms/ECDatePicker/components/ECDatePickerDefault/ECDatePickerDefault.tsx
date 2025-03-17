import { DatePicker } from 'antd'
import { PickerBaseProps } from 'antd/es/date-picker/generatePicker'
import { Dayjs } from 'dayjs';

export interface IECDatePickerDefaultProps extends PickerBaseProps<Dayjs> {

}

export const ECDatePickerDefault = ({
    ...props
}: IECDatePickerDefaultProps) => {

    return (
        <DatePicker
            {...props}
        />
    )
}