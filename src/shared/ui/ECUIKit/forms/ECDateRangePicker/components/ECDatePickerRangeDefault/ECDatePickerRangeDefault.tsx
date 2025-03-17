import { DatePicker } from 'antd';
import { RangePickerBaseProps } from 'antd/es/date-picker/generatePicker';
import { Dayjs } from 'dayjs';

export interface IECDatePickerRangeDefaultProps extends RangePickerBaseProps<Dayjs> {

}

export const ECDatePickerRangeDefault = ({
    ...props
}: IECDatePickerRangeDefaultProps) => {
    return (
        <DatePicker.RangePicker
            {...props}
        />
    )
}