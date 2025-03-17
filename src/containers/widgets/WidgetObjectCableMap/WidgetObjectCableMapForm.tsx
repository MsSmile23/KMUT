import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { useRelationsStore } from '@shared/stores/relations'
import { Form, Select } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { classesFormItems } from './data'
import { IObjectСableTableWidgetForm } from '../ObjectСableTableWidget/types'
import { useObjectsStore } from '@shared/stores/objects'
import AttributesFormItem from '@entities/object-attributes/OAttrFormField/OAttrFormField'

type attributesDataType = {
    id: number,
    value: string | boolean | number
}

const initialAttributes = {
    id: null,
    value: null
}

const WidgetObjectCableMapForm: FC<IObjectСableTableWidgetForm> = ({
    onChangeForm,
    settings: { widget }
}) => {
    const [cableClasses, setCableClasses] = useState<number[]>([])
    const [portClasses, setPortClasses] = useState<number[]>([])
    const [attributesInTargetClass, setAttributesInTargetClass] = useState<number[]>([])
    const [attributesData, setAttributesData] = useState<attributesDataType>(initialAttributes)

    const relationsOptionsAll = useRelationsStore((st) => st.store.data.map((rel) => ({
        value: rel.id, label: rel.name, ids: [rel.left_class_id, rel.right_class_id]
    })))

    const { store } = useObjectsStore()

    const objectsOptions = useMemo(() => {
        return store?.data.map((obj) => ({ label: obj.name, value: obj.id }))
    }, [store])


    const attributes = useMemo(() => {
        const tmp: Required<Record<string, boolean>> = {}

        return store.data.filter(({ class_id }) => {
            return attributesInTargetClass.includes(class_id)
        }).flatMap(({ object_attributes }) => {
            return object_attributes.filter(({ attribute }) => {
                return tmp[attribute.id] ? false : (tmp[attribute.id] = true)
            })
        }) || []
    }, [store, attributesInTargetClass])

    const dataTypeAttributes = attributes.find((attr) =>
        attr.attribute_id === attributesData.id)?.attribute?.data_type?.inner_type || ''

    const cableRelationsOptions = relationsOptionsAll.filter((opt) => {
        if (cableClasses.length > 0 && portClasses.length > 0) {
            return opt.ids.some((id) => cableClasses.includes(id) && portClasses.includes(id))
        }

        return opt.ids.some((id) => cableClasses.includes(id))
    })

    const portRelationsOptions = relationsOptionsAll.filter((opt) => {
        return opt.ids.some((id) => portClasses.includes(id))
    })
    const [form] = Form.useForm()

    const changeForm = (values: any) => {
        if ('cableClasses' in values) {
            setCableClasses(values.cableClasses || [])
        }

        if ('portClasses' in values) {
            setPortClasses(values.portClasses || [])
        }

        if ('targetClassesIds' in values) {
            if (!values.targetClassesIds || !values.targetClassesIds.length) {
                form.setFieldsValue({
                    'attributes': [],
                    'attributesValue': null
                })
                setAttributesData(initialAttributes)
            }
            setAttributesInTargetClass(values.targetClassesIds || [])
        }

        const attributes = {
            id: values.attributes,
            value: values?.attributesValue,
            method: values?.attributesMethod
        }

        delete values?.portClasses
        delete values?.attributes
        delete values?.attributesValue
        delete values?.attributesMethod


        console.log('values', values)
        onChangeForm({
            ...values,
            attributes
        })
    }

    const generateAttrList = (item) => {
        return {
            label: item.attribute.name,
            value: item.attribute.id
        }
    }

    useEffect(() => {
        onChangeForm(widget)
    }, [])

    const tmp = {
        ...(dataTypeAttributes == 'boolean' ? { valuePropName: 'checked' } : {})
    }

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={widget}
            onValuesChange={(value, values) => {
                if ('attributes' in value) {
                    if (!value.attributes || value?.attributes?.length) {
                        setAttributesData(initialAttributes)
                    } else {
                        setAttributesData((prev) => ({ ...prev, id: value.attributes }))
                    }
                    form.setFieldValue('attributesValue', '')
                }

                if ('attributesValue' in value) {
                    setAttributesData((prev) => ({ ...prev, value: value.attributesValue }))
                }

                changeForm(values)
            }}
        >
            <Form.Item name="parentObject" label="Объект">
                <Select options={objectsOptions} />
            </Form.Item>
            {classesFormItems.map((props) => (
                <Form.Item key={props.name} {...props}>
                    <ClassesCascader placeholder="" />
                </Form.Item>
            ))}
            <Form.Item name="relationsCablePort" label="Связи между портом и кабелем">
                <Select mode="multiple" options={cableRelationsOptions} />
            </Form.Item>
            <Form.Item name="relationsPortDevice" label="Связи между портом и устройством">
                <Select mode="multiple" options={portRelationsOptions} />
            </Form.Item>
            <Form.Item name="paintCablesByState" label="Окраска кабелей по статусу">
                <Select options={[{ value: true, label: 'Да' }, { value: false, label: 'Нет' }]} />
            </Form.Item>
            <Form.Item name="attributes" label="Атрибуты">
                <Select options={attributes.map(generateAttrList)} disabled={!attributes.length} />
            </Form.Item>
            {!!attributesData.id && (
                <Form.Item name="attributesValue" label="Значение атрибута" {...tmp} >
                    <AttributesFormItem dataType={dataTypeAttributes} />
                </Form.Item>
            )}
            {!!attributesData.value && (
                <>
                    <Form.Item name="attributesMethod" label="Метод">
                        <Select
                            options={[{ value: 'both', label: 'Все' }, { value: 'some', label: 'Один из' }]}
                        />
                    </Form.Item>
                    <Form.Item name="mnemoMapCore" label="Мнемоника">
                        <Select
                            options={[
                                { value: 'network_map_core', label: 'Карта опорной сети' }, 
                                { value: 'network-map-video', label: 'Карта СВН' }
                            ]}
                        />
                    </Form.Item>
                </>
            )}
        </Form>
    )
}

export default WidgetObjectCableMapForm