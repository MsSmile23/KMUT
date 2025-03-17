import { DatePicker, Select, Space } from 'antd';
import moment from 'moment';

const periods = {
    values: [
        'days',
        'today',
        'hours24',
        'hour',
        'lastWeek',
        'currentWeek',
        'lastMonth',
        'week',
        'month',
        'quarter',
        'currentQuarter',
    ],
    labels: {
        hour: 'За последний час',
        days: 'За вчера',
        today: 'За сегодня',
        hours24: 'За последние 24 часа',
        lastWeek: 'За прошедшую неделю',
        currentWeek: 'За текущую неделю',
        week: 'За последние семь дней',
        lastMonth: 'За прошлый календарный месяц',
        month: '30 дней c начала месяца по Н.В.',
        quarter: 'За прошедший квартал',
        currentQuarter: 'За текущий квартал',
    },
} as const;

/**
 * Компонент для выбора предустановленного периода (deprecated, остался от варианта с расписанием)
 */
const PastPeriod: React.FC<{
    setPastPeriod: any;
    period: [any, any]
}> = ({ period, setPastPeriod }) => {
    const options = periods.values.map((value) => {
        return { value, label: periods.labels[value] };
    });

    const getRange = (type: keyof typeof periods.labels): [any, any] => {
        switch (type) {
            case 'hour':
                return [moment().subtract(1, 'hour'), moment()];
            case 'week':
                return [moment().subtract(1, 'week'), moment()];
            case 'month':
                return [moment().subtract(1, 'month'), moment()];

            case 'days':
                return [
                    moment().subtract(1, 'days').startOf('day'),
                    moment().subtract(1, 'days').endOf('day'),
                ];
            case 'today':
                return [moment().startOf('day'), moment().endOf('day')];
            case 'hours24':
                return [moment().subtract(1, 'days'), moment()];
            case 'lastWeek':
                return [
                    moment().subtract(1, 'week').startOf('week'),
                    moment().subtract(1, 'week').endOf('week'),
                ];
            case 'currentWeek':
                return [moment().startOf('week'), moment().endOf('week')];
            case 'lastMonth':
                return [
                    moment().subtract(1, 'month').startOf('month'),
                    moment().subtract(1, 'month').endOf('month'),
                ];
            case 'quarter':
                return [
                    moment().subtract(1, 'quarter').startOf('quarter'),
                    moment().subtract(1, 'quarter').endOf('quarter'),
                ];
            case 'currentQuarter':
                return [moment().startOf('quarter'), moment().endOf('quarter')];
            default:
                return [null, null];
        }
    };

    return (
        <Space>
            <DatePicker.RangePicker
                value={period}
                onChange={(date) => {
                    setPastPeriod(date)
                }}
                showTime
            />
            <Select
                style={{ width: 320 }}
                placeholder="Выберите интервал"
                options={options}
                onChange={(value) => setPastPeriod(getRange(value))}
            />
        </Space>
    );
};

export default PastPeriod;