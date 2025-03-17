import { useAttributesStore } from '@shared/stores/attributes';
import { useObjectsStore } from '@shared/stores/objects';
import { Form, InputNumber, Select } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { IWidgetObjectStateFormProps } from './types';
import { RangePickerWithPresets } from '@shared/ui/forms';
import dayjs, { Dayjs } from 'dayjs';
/**
 * Форма создания виджета для отображения истории статусов
 * 
 * @param onChangeForm - функция для обновления пропсов виджета (самого виджета или превью виджета)
 * @param settings - объект с настройками виджета
 * @param settings.widget.objectId - id объекта, на основе которого формируются данные (например, устройство)
 * @param settings.widget - см. interface IStateHistoryProps
 */
const WidgetObjectStateHistoryForm: FC<IWidgetObjectStateFormProps> = ({ onChangeForm, settings }) => {
    const widget = settings?.widget
    const chartSettings = widget?.settings
    const objectId = settings?.objectId

    const [ form ] = Form.useForm()
    const [ isTargetObject, setIsTargetObject ] = useState(() => {
        return chartSettings?.targetEntity !== undefined ? chartSettings?.targetEntity === 'object' : true
    })

    const objectsOptions = useObjectsStore((st) => st.store.data.map((obj) => {
        return ({ value: obj.id, label: `${obj.id} - ${obj.name}` })
    }))
    const attributeOptions = useAttributesStore((st) => st.store.data.map((attr) => {
        return ({ value: attr.id, label: `${attr.id} - ${attr.name}` })
    }))

    const allowOnlyIntegers = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (!'0123456789'.includes(ev.key) && ev.key !== 'Backspace') {
            ev.preventDefault()
        }
    }

    const changeForm = (_value: any, values: any) => {
        if (values?.targetEntity) {
            setIsTargetObject(values?.targetEntity === 'object')

            form.setFieldValue('entityId', undefined)
        }

        onChangeForm({ settings: { ...values, period: values?.period?.map(p => p ? p?.unix() : null) } })
    }

    const filterOptions = (input: string, option: { value: number, label: string }) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const initialValues = useMemo(() => ({
        targetEntity: chartSettings?.targetEntity || 'object',
        entityId: chartSettings?.entityId || objectId,
        updatingInterval: chartSettings?.updatingInterval || 60_000,
        period: chartSettings?.period?.map((p: any) => {
            return p 
                ? dayjs(p * 1000)
                : null
        }) as [Dayjs, Dayjs] ?? [null, null]
    }), [])

    useEffect(() => {
        onChangeForm({ settings: initialValues })
    }, [])

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={changeForm}
            initialValues={initialValues}
        >
            <Form.Item name="targetEntity" label="Сущность для отображения">
                <Select
                    style={{ width: '100%' }}
                    options={[
                        { value: 'object', label: 'Объект' },
                        { value: 'object_attribute', label: 'Атрибут' },
                    ]} 
                />
            </Form.Item>
            <Form.Item 
                name="entityId" 
                label={`${isTargetObject ? 'Объект' : 'Атрибут'} для отображения при отсутствии родительского объекта`}
            >
                <Select
                    showSearch
                    filterOption={filterOptions}
                    options={isTargetObject ? objectsOptions : attributeOptions}
                />
            </Form.Item>
            <Form.Item name="updatingInterval" label="Интервал автообновления в миллисекундах">
                <InputNumber min={10_000} precision={0} onKeyDown={allowOnlyIntegers} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item 
                name="period" 
                style={{ marginBottom: 0 }}
            >
                <RangePickerWithPresets 
                    withPresets
                    initial={[null, null]}
                    style={{ 
                        preset: { width: 250 }
                    }}
                />
            </Form.Item>
        </Form>
    )
}

export default WidgetObjectStateHistoryForm