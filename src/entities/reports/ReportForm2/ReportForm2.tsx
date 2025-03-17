import { Button, message, theme } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Form, Steps } from 'antd/lib';
import { FC, useEffect, useMemo, useState } from 'react';
import ReportPropertyForm from './ReportPropertyForm';
import ReportObjectsForm from './ReportObjectsForm';
import { postReportsTasks } from '@shared/api/Reports/Models/postReportsTasks/postReportsTasks';
import { ECTooltip } from '@shared/ui/tooltips';
import moment from 'moment-timezone';
import { patchTaskById } from '@shared/api/Reports/Models/patchTaskById/patchTaskById';
import { getReportTypes } from '@shared/api/ReportTypes/Models/getReportTypes/getReportTypes';
import { TReport } from '@shared/types/reports';
import ReportFieldsConstructorForm from './ReportFieldsConstructorForm';
import { TFieldConstructorItem } from './types';
import { useTheme } from '@shared/hooks/useTheme';
import { selectAccount, useAccountStore } from '@shared/stores/accounts';
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';

type TReportType = {
    id: number
    name: string
    mnemo: string
    root_classes: (string | number)[]
    formats: string[]
    flags: string | null
}

interface IReportFormProps {
    closeModal?: () => void
    task?: any
    editMode?: boolean
    initialPeriodicity?: 'one_time' | 'regular'
    updateData?: () => void
    succesTitle?: string
}

const getFiltersObject = (filters) => {

    const filtersObject = {}

    for (const [key, value] of Object.entries(filters)) {
        filtersObject[`relation_column_${key}`] = value
    }

    return filtersObject
}

const ReportForm2: FC<IReportFormProps> = ({
    closeModal,
    task,
    editMode = false,
    initialPeriodicity,
    updateData,
    succesTitle = 'Отчёт успешно сохранён'
}) => {

    const theme = useTheme();
    const accountData = useAccountStore(selectAccount);
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode || 'light';
    const textColor = createColorForTheme(theme?.filter?.filtersTextColor, theme?.colors, themeMode);

    const [form] = useForm();
    // const { token } = theme.useToken();

    const [selectedReportType, setSelectedReportType] = useState(task?.report_type_id || null)
    const [reportTypes, setReportTypes] = useState(null)
    const [filters, setFilters] = useState(task?.filters
        ? getFiltersObject(JSON.parse(task?.filters))
        : {})
    const [onlyFiltersMode, setOnlyFiltersMode] = useState(
        task?.flags ? JSON.parse(task?.flags).use_filters
            : false
    )
    const [downLinkItems, setDownLinksItems] = useState<TFieldConstructorItem[]>(task?.constructor_fields
        ? JSON.parse(task?.constructor_fields)?.down_links : [])
    const [upLinkItems, setUpLinksItems] = useState<TFieldConstructorItem[]>(task?.constructor_fields
        ? JSON.parse(task?.constructor_fields)?.up_links : [])
    const [nextDisable, setNextDisable] = useState(true)

    const changeLogic = (value) => {
        setSelectedReportType(value)
        form.setFieldValue('formats', [])
    }

    useEffect(() => {
        const fetchData = async () => {
            const reportTypesResponse = await getReportTypes()

            setReportTypes(
                reportTypesResponse?.data?.map((type: TReportType) => {

                    const flags = type?.flags ? JSON.parse(type?.flags) : null

                    return {
                        value: type?.id,
                        label: type?.name,
                        rootClasses: type?.root_classes,
                        formats: type?.formats,
                        universal: flags?.universal || false,
                        fixed_term: flags?.fixed_term || false
                    }
                }
                ))
        };

        fetchData();
    }, []);

    const [formValues, setFormValues] = useState<Partial<TReport>>(task
        ? {
            frequency_type: 'regular',
            frequency: task?.frequency,
            frequency_started_at: moment(task?.frequency_started_at, 'HH:mm:ss'),
            report_type_id: task?.report_type?.id,
            formats: task?.formats,
            construction_period: task?.construction_period,
            selectedObjects: task?.objects,
            root_class: task?.constructor_fields ? JSON.parse(task.constructor_fields)?.root_class : null,
            root_attributes: task?.constructor_fields ? JSON.parse(task.constructor_fields)?.root_attributes : [],
            timeRounding: task?.constructor_fields ? JSON.parse(task.constructor_fields)?.timeRounding : ''
        }
        : {});
    const [selectedObjects, setSelectedObjects] = useState(task?.objects || [])

    useEffect(() => {
        form.setFieldsValue(formValues)
    }, [formValues])

    const contentStyle = {
        lineHeight: '260px',
        color: textColor,
        borderRadius: 4,
        marginTop: 16,
    };

    const steps = [
        {
            title: (<span style={{ color: textColor }}>Свойства отчёта</span>),
            content:
                <ReportPropertyForm
                    onLogicTypeChange={changeLogic}
                    editMode={editMode}
                    form={form}
                    reportTypes={reportTypes}
                    setNextDisable={setNextDisable}
                    initialPeriodicity={initialPeriodicity}
                />,
        },
        // Проверяем тип логики, чтобы скрыть или показать шаг "Конструктор полей"
        ...(reportTypes?.find(type => type.value === selectedReportType)?.universal
            ? [
                {
                    title: (<span style={{ color: textColor }}>Конструктор полей</span>),
                    content:
                        <ReportFieldsConstructorForm
                            form={form}
                            setDownLinksItems={setDownLinksItems}
                            setUpLinksItems={setUpLinksItems}
                            downLinksItems={downLinkItems}
                            upLinksItems={upLinkItems}
                        />,
                },
            ]
            : []),
        {
            title: (<span style={{ color: textColor }}>Объекты</span>),
            content:
                <ReportObjectsForm
                    form={form}
                    selectedObjects={selectedObjects} // Передаем состояние
                    setSelectedObjects={setSelectedObjects}
                    selectedFilters={filters}
                    setFilters={setFilters}
                    onlyFiltersMode={onlyFiltersMode}
                    setOnlyFiltersMode={setOnlyFiltersMode}
                />,
        },
    ];

    const [current, setCurrent] = useState(0);

    const next = async () => {
        try {
            // Попробуем валидировать все поля формы перед переходом
            await form.validateFields(); // Валидирует обязательные поля

            // Если валидация прошла успешно, обновляем значения формы и переходим к следующему шагу
            setFormValues({ ...formValues, ...form.getFieldsValue() });
            setCurrent(current + 1); // Переход к следующему шагу
        } catch (error) {
            // Если есть ошибки, то они уже отображаются на форме
            console.warn('Validation failed:', error);
        }
    };
    const prev = () => {
        setCurrent(current - 1);
        setFormValues({ ...formValues, ...form.getFieldsValue() });
        form.setFieldsValue(formValues); // Восстанавливаем значения при возврате
    };
    const items = steps.map((item) => ({
        key: item?.title,
        title: item?.title,
    }));

    const saveReport = async () => {

        const filtersObject = {}

        for (const [key, value] of Object.entries(filters)) {
            if (key !== 'id' && key !== 'name' && !!value) {

                const newKey = key?.includes('_')
                    ? key.split('_')[2]
                    : key

                if (value?.length > 0) {
                    filtersObject[newKey] = value
                }
            }
        }

        const constructor_fields = {
            up_links: upLinkItems,
            down_links: downLinkItems,
            root_class: formValues.root_class,
            root_attributes: formValues.root_attributes,
            timeRounding: formValues.timeRounding
        }

        const payload = {
            ...formValues,
            objects: selectedObjects || [],
            filters: JSON.stringify(filtersObject),
            flags: JSON.stringify({
                use_filters: onlyFiltersMode,
            }),
            constructor_fields: JSON.stringify(constructor_fields),
            ...(formValues.frequency_started_at &&
                { frequency_started_at: formValues.frequency_started_at.format('HH:mm') }
            ),
            ...(formValues.end_datetime && { end_datetime: formValues.end_datetime.endOf('day').toISOString() }),
            ...(formValues.start_datetime && { start_datetime: formValues.start_datetime.startOf('day').toISOString() })
        };

        // console.log('constructor_fields', constructor_fields)

        // console.log('payload', payload)

        try {
            const response = editMode
                ? await patchTaskById(task.id, payload)
                : await postReportsTasks(payload)

            // console.log('response', response)

            if (response?.success) {
                message.success(succesTitle);
                closeModal()

                if (updateData) {
                    updateData()
                }

                return
            }

            message.error(`Ошибка при сохранении 
                ${payload.frequency_type == 'regular' ? 'задания' : 'отчёта'}: 
                ${response.errors.join(', ')}`);
        } catch (error) {
            console.error('Error saving report:', error);
            message.error(`Ошибка при сохранении ${payload.frequency_type == 'regular' ? 'задания' : 'отчёта'}. 
                Попробуйте ещё раз.`);
        }
    };

    return (
        <>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => next()}
                    // disabled={nextDisable}
                    >
                        Далее
                    </Button>
                )}
                {current === steps.length - 1 && (
                    selectedObjects.length == 0 && !onlyFiltersMode
                        ?
                        <ECTooltip
                            title="Выберите объекты"
                        >
                            <Button
                                type="primary"
                                disabled={selectedObjects.length == 0 && !onlyFiltersMode}
                                style={{ color: textColor }}
                            >
                                Сохранить
                            </Button>
                        </ECTooltip>
                        :
                        <Button
                            type="primary"
                            onClick={saveReport}
                            disabled={selectedObjects.length == 0 && !onlyFiltersMode}
                            style={{ color: textColor }}
                        >
                            Сохранить
                        </Button>

                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Назад
                    </Button>
                )}
            </div>
        </>
    );
};

export default ReportForm2;