import { CSSProperties, FC, useState } from 'react'
/* eslint-disable max-len */
import { Form } from 'antd'
import { Select } from '@shared/ui/forms'
import { useForm } from 'antd/es/form/Form'
import { availableIndicatorsList } from './utils'

export interface IChartIndicator {
    band: string
    average: string
}

interface IIndicatorFormProps {
    getFormValues: (form: any) => void
    style?: {
        form?: CSSProperties
        formItem?: CSSProperties
    }
}

export const IndicatorForm: FC<IIndicatorFormProps> = ({
    getFormValues, style
}) => {
    const [form] = useForm()
    // const chosenIndicator = availableIndicatorsList.find(indicator => indicator.value === currentIndicator)
    const [currentIndicator, setCurrentIndicator] = useState<keyof IChartIndicator | ''>('') 
    
    const handleIndicatorsChange = (value, values) => {
        // console.log('value', value)
        setCurrentIndicator(value['indicators'])
        getFormValues(value['indicators'])

        return value
    }

    return (
        <Form
            form={form}
            style={{
                position: 'absolute',
                top: 5,
                left: 5,
                zIndex: 1000,
                ...style?.form
            }}
            initialValues={{
                indicators: currentIndicator
            }}
            onValuesChange={handleIndicatorsChange}

        >
            <Form.Item
                name="indicators"
                label="Выберите индикатор"
                style={{
                    width: 300,
                    marginBottom: 0,
                    ...style?.formItem
                }}
            >
                <Select 
                    options={availableIndicatorsList}
                    // placeholder="Выберите индикатор"
                />
            </Form.Item>
        </Form>
    )
}