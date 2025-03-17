import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC } from 'react'
import { TWidgetReports, TReports } from './types/WidgetReports'
import { Select } from '@shared/ui/forms'
import { getReportTypes } from '@shared/api/ReportTypes/Models/getReportTypes/getReportTypes'
import { useApi2 } from '@shared/hooks/useApi2'
import { reportFormats } from '@entities/reports/ReportForm/data'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'

const initialValues: TReports = {
    filters: {
        reportTypesAllowArray: null,
        reportFormatsAllowArray: null,
        linkedClassesForObjects: null,
    },
    tableOptions: {
        authorOfReport: null
    }
}

export const WidgetReportsForm: FC<TWidgetReports> = (props) => {
    const { settings, onChangeForm } = props
    const widget = settings?.widget || initialValues;
    const [form] = useForm()

    const reportTypes = useApi2(getReportTypes)

    const reportTypeOptionsAll = reportTypes?.data?.map(({ name, id }) => {
        return { value: id, label: name }
    }) || []

    const reportFormatsList = reportFormats.map(({ name, ext }) => {
        return { value: ext, label: name }
    }) || []

    const classesList = useApi2(getClasses)

    const reportClassesList = classesList?.data?.map(({ name, id }) => {
        return { value: id, label: name }
    }) || []

    const columnOfAuthorViewOptions = [
        { label: 'Не выводить', value: 'none' },
        { label: 'Логин', value: 'login' },
        { label: 'ФИО', value: 'fio' },
        { label: 'ФИО (логин)', value: 'fio_login' },
    ]

    return (
        <Form
            form={form}
            style={{ width: '100%' }}
            autoComplete="off"
            initialValues={widget || initialValues}
            layout="vertical"
            onValuesChange={(changedValues, values) => {
                onChangeForm(values)
            }}
        >

            <Form.Item name="filters">
                <Form.List name={['filters']}>
                    {() => (
                        <>
                            <Form.Item name="reportTypesAllowArray" label="Разрешенные типы отчетов">
                                <Select 
                                    options={reportTypeOptionsAll}
                                    placeholder="Выберите типы отчетов" 
                                    mode="multiple" 
                                />
                            </Form.Item>

                            <Form.Item name="reportFormatsAllowArray" label="Разрешенные форматы отчетов">
                                <Select 
                                    options={reportFormatsList}
                                    placeholder="Выберите форматы отчетов" 
                                    mode="multiple" 
                                />
                            </Form.Item>

                            <Form.Item name="linkedClassesForObjects" label="Разрешенные классы">
                                <Select 
                                    options={reportClassesList}
                                    placeholder="Выберите классы" 
                                    mode="multiple" 
                                />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item name={[ 'tableOptions', 'authorOfReport' ]} label="Колонка автора отчёта">
                <Select 
                    options={columnOfAuthorViewOptions}
                    placeholder="Выберите отображение колонки" 
                />
            </Form.Item>

        </Form>
    );
}

export default WidgetReportsForm