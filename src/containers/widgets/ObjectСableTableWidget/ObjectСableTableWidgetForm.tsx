import { FC, useEffect, useState } from 'react';
import { IObjectСableTableWidgetForm } from './types';
import { Form, Select } from 'antd';
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader';
import { useRelationsStore } from '@shared/stores/relations';
import { useAttributesStore } from '@shared/stores/attributes';
import { classesFormItems } from './data';

const ObjectСableTableWidgetForm: FC<IObjectСableTableWidgetForm> = ({
    onChangeForm,
    settings: { widget }
}) => {
    const [ cableClasses, setCableClasses ] = useState<number[]>([])
    const [ portClasses, setPortClasses ] = useState<number[]>([])
    const relationsOptionsAll = useRelationsStore((st) => st.store.data.map((rel) => ({
        value: rel.id, label: rel.name, ids: [rel.left_class_id, rel.right_class_id]
    })))
    const cableRelationsOptions = relationsOptionsAll.filter((opt) => {
        if (cableClasses.length > 0 && portClasses.length > 0) {
            return opt.ids.some((id) => cableClasses.includes(id) || portClasses.includes(id))
        }

        return opt.ids.some((id) => cableClasses.includes(id))
    })
    const portRelationsOptions = relationsOptionsAll.filter((opt) => {
        return opt.ids.some((id) => portClasses.includes(id))
    })

    const attributesOptions = useAttributesStore((st) => st.store.data.map((attr) => ({
        value: attr.id, label: attr.name
    })))

    const [ form ] = Form.useForm()

    const changeForm = (values: any) => {
        if ('cableClasses' in values) {
            setCableClasses(values.cableClasses || [])
        }

        if ('portClasses' in values) {
            setPortClasses(values.portClasses || [])
        }

        // delete values?.portClasses

        onChangeForm(values)
    }

    useEffect(() => {
        onChangeForm(widget)
    }, [])

    return (
        <Form 
            form={form}
            layout="vertical"
            initialValues={widget}
            onValuesChange={(_, values) => changeForm(values)}
        >
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
            <Form.Item name="upDownAttributeId" label="Атрибут вверх/вниз">
                <Select options={attributesOptions} />
            </Form.Item>
            <Form.Item name="columnsAttributesIds" label="Атрибуты для вывода столбцов">
                <Select options={attributesOptions} />
            </Form.Item>
            <Form.Item name="attributeIdPortName" label="Атрибут названия порта">
                <Select options={attributesOptions} />
            </Form.Item>
            <Form.Item name="paintCablesByState" label="Окраска кабелей по статусу">
                <Select options={[{ value: true, label: 'Да' }, { value: false, label: 'Нет' }]} />
            </Form.Item>
        </Form>
    )
}

export default ObjectСableTableWidgetForm