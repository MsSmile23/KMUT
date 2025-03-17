import { WarningOutlined } from '@ant-design/icons';
import { getReportsMeta } from '@shared/api/Reports/Models/getReportsMeta/getReportsMeta';
import { ECSelect } from '@shared/ui/forms';
import { ECLoader } from '@shared/ui/loadings';
import { Form, TimePicker, DatePicker, Row, Col, Popover } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTheme } from '@shared/hooks/useTheme';
import { selectAccount, useAccountStore } from '@shared/stores/accounts';
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';

type TOptionsLabels = 'REPORT_PERIOD_OPTIONS' | 'REGULARITY_OPTIONS' | 'PERIODICITY_OPTIONS'

type TOptionObject = {
    value: string
    label: string
    mnemo?: string
}



type TOptionsObject = Record<TOptionsLabels, TOptionObject[]> | null

const ReportPropertyForm = ({ onLogicTypeChange, form, editMode, reportTypes, setNextDisable, initialPeriodicity }) => {
    const periodicity = Form.useWatch('frequency_type', form);
    const reportPeriod = Form.useWatch('construction_period', form);
    const [options, setOptions] = useState<TOptionsObject>(null)
    const [errors, setErrors] = useState([]);
    const [lastPresetDates, setLastPresetDates] = useState({ start: null, end: null });

    const theme = useTheme();
    const accountData = useAccountStore(selectAccount);
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode || 'light';
    const textColor = createColorForTheme(theme?.filter?.filtersTextColor, theme?.colors, themeMode);
    const borderColor = createColorForTheme(theme?.filter?.filtersBorderColor, theme?.colors, themeMode);
    const backgroundColor = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode);

    const getPeriodRange = (periodValue) => {
        const now = dayjs();
        let start, end;

        switch (periodValue) {
            case 'current_time':
                start = now;
                end = now;
                break;
            case 'last_hour':
                start = now.subtract(1, 'hour');
                end = now;
                break;
            case 'yesterday':
                start = now.subtract(1, 'day').startOf('day');
                end = now.subtract(1, 'day').endOf('day');
                break;
            case 'today':
                start = now.startOf('day');
                end = now.endOf('day');
                break;
            case 'last_24_hours':
                start = now.subtract(24, 'hour');
                end = now;
                break;
            case 'last_7_days':
                start = now.subtract(7, 'day').startOf('day');
                end = now.endOf('day');
                break;
            case 'previous_week':
                start = now.subtract(1, 'week').startOf('week');
                end = now.subtract(1, 'week').endOf('week');
                break;
            case 'current_week':
                start = now.startOf('week');
                end = now.endOf('week');
                break;
            case 'last_30_days':
                start = now.subtract(30, 'day').startOf('day');
                end = now.endOf('day');
                break;
            case 'from_beginning_of_month':
                start = now.startOf('month');
                end = now;
                break;
            case 'previous_month':
                start = now.subtract(1, 'month').startOf('month');
                end = now.subtract(1, 'month').endOf('month');
                break;
            case 'previous_quarter':
                start = now.subtract(1, 'quarter').startOf('quarter');
                end = now.subtract(1, 'quarter').endOf('quarter');
                break;
            case 'current_quarter':
                start = now.startOf('quarter');
                end = now.endOf('quarter');
                break;
            case 'arbitrary':
                // Для произвольного периода возвращаем последние даты пресета
                start = lastPresetDates.start;
                end = lastPresetDates.end;
                break;
            default:
                start = null;
                end = null;
                console.warn(`Неизвестный период: ${periodValue}`);
                break;
        }

        return { start, end };
    };

    const handlePeriodChange = (value) => {
        if (value === 'arbitrary') {
            // При выборе произвольного периода используем последние даты пресета
            form.setFieldsValue({
                start_datetime: lastPresetDates.start,
                end_datetime: lastPresetDates.end,
            });

            return;
        }

        // Получаем диапазон дат для выбранного пресета
        const { start, end } = getPeriodRange(value);

        // Сохраняем даты пресета
        setLastPresetDates({ start, end });

        // Устанавливаем значения в форму
        form.setFieldsValue({
            start_datetime: start,
            end_datetime: end,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const metaData = await getReportsMeta()

            const metaDataSafe = metaData?.data || {};

            setOptions({
                REPORT_PERIOD_OPTIONS: getOptions('construction_periods', metaDataSafe),
                REGULARITY_OPTIONS: getOptions('frequency', metaDataSafe),
                PERIODICITY_OPTIONS: getOptions('frequency_type', metaDataSafe),
            });
        };

        fetchData();
    }, []);


    const getOptions = (mnemo, metaData) => {
        if (!metaData || !metaData[mnemo]) { return []; }

        return Object.values(metaData[mnemo]).map((el: TOptionObject) => ({ label: el.label, value: el.mnemo }));
    };

    const getPeriodOptions = () => {

        const currentTimeAllowed = reportTypes?.find(type => type.value == selectedType)?.fixed_term

        const newOptions = currentTimeAllowed
            ? [
                { value: 'current_time', label: 'На текущий момент' },
            ]
            : (options?.REPORT_PERIOD_OPTIONS || []);

        return periodicity === 'one_time'
            ? newOptions
            : newOptions.filter(option => option.value !== 'arbitrary')
    }

    const selectedType = Form.useWatch('report_type_id', form)

    useEffect(() => {
        if (reportTypes && selectedType) {
            const rootClasses = reportTypes.find(el => el.value === selectedType)?.rootClasses

            form.setFieldValue('rootClasses', rootClasses)
        }
    }, [selectedType])

    const getFormatsOptions = (selectedType) => {
        return reportTypes
            ?.find(type => type.value == selectedType)?.formats
            .map(format => ({ value: format, label: format }))
    }

    const customStyles = useMemo(() => (`
            .ant-select-selector {
                color: ${textColor} !important;
                background-color: ${backgroundColor} !important;
            }
            .ant-select-arrow {
                color: ${textColor} !important;
            }
            .ant-picker-suffix {
                color: ${textColor} !important;
            }
                .ant-form-item-explain {
                    display: none; /* Скрыть текст ошибки */
                }
        `), [])

    return (
        <>
            <style>{customStyles}</style>
            {
                reportTypes && !!options
                    ?
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            frequency_type: initialPeriodicity,
                        }}
                        onValuesChange={() => {
                            form.validateFields().then(() => {
                                setErrors([])
                                setNextDisable(false)
                            }).catch((err) => {
                                setErrors(err?.errorFields?.map(err => err.errors[0]))

                                if (err.errorFields.length === 0) { setNextDisable(false) }
                            });
                        }}
                    >
                        {/* Блок 1: Периодичность */}
                        <Row gutter={8} justify="start">
                            <Col span={8}>
                                <Form.Item
                                    label="Периодичность"
                                    name="frequency_type"
                                    rules={[{
                                        required: editMode ? false : true,
                                        message: 'Заполните поле "Периодичность"'
                                    }]}
                                    initialValue="one_time"
                                >
                                    <ECSelect
                                        onChange={(value) => {

                                            if (value == 'one_time') {
                                                form.setFieldsValue({
                                                    'frequency': null,
                                                    'frequency_started_at': null,
                                                });
                                            }
                                            form.setFieldsValue({
                                                'construction_period': null,
                                                'start_datetime': null,
                                                'end_datetime': null,
                                                ...(periodicity === 'one_time' && {
                                                    ...(form.getFieldValue('frequency')
                                                        && { 'frequency': null }),
                                                    ...(form.getFieldValue('frequency_started_at')
                                                        && { 'frequency_started_at': null }),
                                                })
                                            });
                                        }}
                                        size="small"
                                        disabled={editMode ? true : false}
                                        options={options?.PERIODICITY_OPTIONS}
                                        placeholder={editMode ? 'Регулярный' : ''}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Регулярность"
                                    name="frequency"
                                    tooltip={periodicity === 'one_time' ? 'Недоступно для разовых отчётов' : ''}
                                    rules={[{
                                        required: periodicity === 'one_time'
                                            ? false
                                            : true,
                                        message: 'Заполните поле "Регулярность"'
                                    }]}
                                >
                                    <ECSelect
                                        size="small"
                                        disabled={periodicity === 'one_time'}
                                        options={options?.REGULARITY_OPTIONS}
                                        placeholder={periodicity === 'one_time' ? '' : 'Выберите регулярность'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Время начала"
                                    name="frequency_started_at"
                                    tooltip={periodicity === 'one_time' ? 'Недоступно для разовых отчётов' : ''}
                                    rules={[{
                                        required: periodicity === 'one_time'
                                            ? false
                                            : true,
                                        message: 'Заполните поле "Время начала"'
                                    }]}
                                >
                                    <TimePicker
                                        style={{ width: 180 }}
                                        size="small"
                                        format="HH:mm"
                                        disabled={periodicity === 'one_time'}
                                        placeholder={periodicity === 'one_time' ? '' : 'Выберите время'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Блок 2: Логика отчёта */}
                        <Row gutter={8} justify="start">
                            <Col span={16}>
                                <Form.Item
                                    label="Тип отчёта"
                                    name="report_type_id"
                                    rules={[{
                                        required: true,
                                        message: 'Заполните поле "Тип отчёта"'
                                    }]}
                                >
                                    <ECSelect
                                        style={{ width: 370 }}
                                        size="small"
                                        options={reportTypes}
                                        onChange={onLogicTypeChange}
                                    />
                                </Form.Item>
                            </Col>
                            {selectedType &&
                                <Col span={8}>
                                    <Form.Item
                                        label="Форматы отчёта"
                                        name="formats"
                                        rules={[{
                                            required: true,
                                            message: 'Заполните поле "Форматы отчёта"'
                                        }]}
                                    >
                                        <ECSelect
                                            size="small"
                                            options={getFormatsOptions(selectedType)}
                                            mode="multiple"
                                            style={{ width: 180 }}
                                        />
                                    </Form.Item>
                                </Col>}
                        </Row>

                        {/* Блок 3: Период отчёта */}
                        <Row gutter={8} justify="start">
                            <Col span={8}>
                                <Form.Item
                                    label="Период отчёта"
                                    name="construction_period"
                                    rules={[{
                                        required: true,
                                        message: 'Заполните поле "Период отчёта"'
                                    }]}
                                >
                                    <ECSelect
                                        style={{ width: 180 }}
                                        size="small"
                                        options={getPeriodOptions()}
                                        onChange={handlePeriodChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    rules={[{
                                        required: reportPeriod !== 'arbitrary' ? false : true,
                                        message: 'Заполните поле "Начало периода"'
                                    }]}
                                    label="Начало периода"
                                    name="start_datetime"
                                    tooltip={reportPeriod !== 'arbitrary'
                                        ? 'Доступно только для Произвольного периода отчёта'
                                        : ''}
                                >
                                    <DatePicker
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm"
                                        style={{ width: 180 }}
                                        size="small"
                                        disabled={reportPeriod !== 'arbitrary'}
                                        placeholder={reportPeriod !== 'arbitrary' ? '' : 'Выберите дату'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: reportPeriod !== 'arbitrary' ? false : true,
                                            message: 'Заполните поле "Конец периода"'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const startDate = getFieldValue('start_datetime');
                                                const endDate = value;

                                                if (!startDate || !endDate) {
                                                    return Promise.resolve();
                                                }

                                                // Вычисляем разницу в миллисекундах
                                                const diffInMilliseconds = endDate.valueOf() - startDate.valueOf();

                                                // Преобразуем разницу в дни
                                                const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

                                                // Проверяем, что конец периода позже начала
                                                if (diffInMilliseconds < 0 ) {
                                                    return Promise
                                                        .reject(new Error(
                                                            'Дата окончания должна быть позже даты начала'
                                                        ));
                                                }

                                                // Проверяем, что интервал не превышает 93 дня
                                                if (diffInDays > 93) {
                                                    return Promise.reject(new Error(
                                                        'Интервал не должен превышать 93 дня'
                                                    ));
                                                }

                                                // Если всё в порядке, возвращаем успешный результат
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                    label="Конец периода"
                                    name="end_datetime"
                                    tooltip={reportPeriod !== 'arbitrary'
                                        ? 'Доступно только для Произвольного периода отчёта'
                                        : ''}
                                >
                                    <DatePicker
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm"
                                        style={{ width: 180 }}
                                        size="small"
                                        disabled={reportPeriod !== 'arbitrary'}
                                        placeholder={reportPeriod !== 'arbitrary' ? '' : 'Выберите дату'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {errors.length > 0 && (
                            <Popover
                                title="Внимание!"
                                content={
                                    errors.map((error, index) => (
                                        <p key={index} style={{ display: 'block' }}>
                                            {error}
                                        </p>
                                    ))
                                }
                            >
                                <WarningOutlined
                                    style={{
                                        fontSize: 24,
                                        color: 'red'
                                    }}
                                />
                            </Popover>
                        )}
                    </Form>
                    : <ECLoader />
            }
        </>

    );
};

export default ReportPropertyForm;