import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { Select } from '@shared/ui/forms'
import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useMemo, useState } from 'react'

interface WidgetObjectAttributesFromProps {
    onChangeForm: <T>(data: T) => void
    settings: {
        object: IObject
    }
}

const WidgetObjectAttributesFrom: FC<WidgetObjectAttributesFromProps> = (props) => {

    const { settings, onChangeForm } = props

    const [dataObjectId, setDataObjectId] = useState<number>(0)

    const [form] = useForm()

    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    const objectList = useMemo(() => {
        return objects?.map((item) => {
            return {
                value: item?.id,
                label: item?.name
            }
        }) || []
    }, [objects])

    useEffect(() => {
        form.setFieldsValue({
            object: settings?.object?.id || undefined
        })
    }, [settings])

    useEffect(() => {
        const tmp = objects.find((item) => item?.id === dataObjectId) || {} as IObject

        if (Object.keys(tmp || {})?.length) {
            onChangeForm<{object: IObject}>({
                object: {
                    ...tmp
                }
            })
        }
    }, [dataObjectId, objects])
    
    return (
        <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 400 }}
            initialValues={{ object: settings?.object?.id || undefined }}
            onValuesChange={(changedValues, _) => {
                setDataObjectId(changedValues?.['object'] || {})
            }}
        >
            <Form.Item name="object">
                <Select
                    options={objectList}
                    placeholder="Выберите объект"
                />
            </Form.Item>
        </Form>
    )
}

export default WidgetObjectAttributesFrom