import { getReportTypes } from '@shared/api/ReportTypes/Models/getReportTypes/getReportTypes'
import { TReportType } from '@shared/types/reports'
import { WidgetECSimpleFiltersForm } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/components/WidgetECSimpleFiltersForm/WidgetECSimpleFiltersForm'
import { ECSelect } from '@shared/ui/forms'
import { useForm } from 'antd/es/form/Form'
import { Form, Select } from 'antd/lib'
import { useEffect, useState } from 'react'


const SimpleReportsForm = (props) => {

    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = useForm()
    const [reportsTypes, setReportTypes] = useState([])

    const initialValues = {
        selectedTypes: widget.selectedTypes,
        fields: widget.fields || [],
    }

    const formChange = (v, vs) => {
        console.log(vs)
        onChangeForm(vs)

        return v
    }

    useEffect(() => {
        const fetchData = async () => {
            const reportTypesResponse = await getReportTypes()

            setReportTypes(
                reportTypesResponse?.data?.map((type: TReportType) => {

                    return {
                        value: type?.id,
                        label: type?.name,
                    }
                }
                ))
        };

        fetchData();
    }, []);

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={formChange}
            initialValues={initialValues}
        >
            <Form.Item
                label="Доступные типы отчётов"
                name="selectedTypes"
            >
                <ECSelect
                    style={{ width: 200 }}
                    mode="multiple"
                    options={reportsTypes}
                    maxTagCount="responsive"
                />
            </Form.Item>

            <Form.Item name="fields">
                <WidgetECSimpleFiltersForm />
            </Form.Item>
        </Form >
    )
}

export default SimpleReportsForm