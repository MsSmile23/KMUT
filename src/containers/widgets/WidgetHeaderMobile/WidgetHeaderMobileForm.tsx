import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { Select } from '@shared/ui/forms'
import { HEADER_TYPE, IHeaderMobile } from '@shared/ui/HeaderMobile/HeaderMobile'
import { Form, Input, Switch } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

interface IWidgetHeaderMobileFormProps {
    onChangeForm: <T>(data: T) => void
    settings: {
        vtemplate: {objectId: number},
        widget: IHeaderMobile,
    }
}

const WidgetHeaderMobileForm: FC<IWidgetHeaderMobileFormProps> = (props) => {
    const [form] = useForm()
    const { settings, onChangeForm } = props
    const [ stateValues, setStateValues ] = useState<IHeaderMobile>(settings?.widget)
    const classes = useClassesStore(selectClasses)

    const classesOptions = classes.map((item) => ({   
        label: item.name,
        value: item.id
    }))

    const headerTypeOptions = [
        { label: 'Главная', value: HEADER_TYPE.MAIN },
        // { label: 'Услуга', value: HEADER_TYPE.SERVICE },
        { label: 'Объект', value: HEADER_TYPE.OBJECT },
    ]

    const onChange = (value, valuesChange) => {
        const key = Object.keys(value)[0]

        if (key === 'isSearchVisible') {
            const updatedValues = {
                ...stateValues,
                isSearchVisible: value[key],
                isPickerVisible: false,
            }

            setStateValues(updatedValues)
            form.setFieldsValue(updatedValues)
        } else if (key === 'isPickerVisible') {
            const updatedValues = {
                ...stateValues,
                isPickerVisible: value[key],
                isSearchVisible: false,
            }

            setStateValues(updatedValues)
            form.setFieldsValue(updatedValues)
        } else {
            setStateValues(prev => {
                return {
                    ...prev,
                    ...valuesChange
                }
            })
        }
    }

    useEffect(() => {
        setStateValues(settings?.widget)
    }, [settings.widget])

    useEffect(() => {
        onChangeForm(stateValues)
    }, [stateValues])

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={stateValues}
            onValuesChange={(value, valuesChange) => onChange(value, valuesChange)}
            style={{ width: 400 }}
        >
            <Form.Item name="title" label="Заголовок страницы">
                <Input type="text" placeholder="Введите заголовок" />
            </Form.Item>
            <Form.Item name="headerType" label="Тип шапки">
                <Select placeholder="Выберите тип" options={headerTypeOptions} />
            </Form.Item>
            <div style={{ display: 'flex' }}>
                <Form.Item 
                    name="isSearchVisible" 
                    label="Отображение поиска" 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                <Form.Item 
                    name="isFilterVisible" 
                    label="Отображение фильтра" 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                <Form.Item 
                    name="isPickerVisible" 
                    label="Отображение селекта" 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </div>
            {stateValues.isPickerVisible && 
            <>
                <Form.Item 
                    name="parentClass"
                    label="Класс родителя"
                    required
                >
                    <Select options={classesOptions} placeholder="Выберите класс" />
                </Form.Item>
                <Form.Item 
                    name="targetClasses"
                    label="Целевой класс"
                    required
                >
                    <Select options={classesOptions} placeholder="Выберите класс" mode="multiple" />
                </Form.Item>
            </>}
        </Form>
    )
}

export default WidgetHeaderMobileForm