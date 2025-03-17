import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById'
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { useApi2 } from '@shared/hooks/useApi2'
import { Select } from '@shared/ui/forms'
import { Form } from 'antd'
import { useForm, useWatch } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

interface IDemoOAIndicatorsFormState {
    class: number
    object: number
    objectAttributeIds: number[]
}
interface IDemoOAIndicatorsFormProps {
    getFormValues: (values: IDemoOAIndicatorsFormState) => void
}
interface IOptionsListItem {
    value: number
    label: string
}

export const DemoOAIndicatorsForm: FC<IDemoOAIndicatorsFormProps> = ({
    getFormValues
}) => {
    const [form] = useForm()
    const classes = useApi2(() => getClasses({ all: true }))
    const objects = useApi2(() => getObjects({ all: true }))
    // const [optionsList, setClassList] = useState<
    //     Record<keyof IDemoOAIndicatorsFormState, IOptionsListItem[]>
    // >({
    //     class: [],
    //     object: [],
    //     objectAttributeIds: []
    // })
    const currentClassId = useWatch<IDemoOAIndicatorsFormState['class']>('class', form)
    const currentObjectId = useWatch<IDemoOAIndicatorsFormState['object']>('object', form)
    const currentObject = objects?.data?.find(obj => obj.id === currentObjectId)
    const currentClass = classes?.data?.find(cls => cls.id === currentClassId)

    const initial: IDemoOAIndicatorsFormState = {
        class: null,
        object: null,
        objectAttributeIds: []
    }
    const handleChange = (value, values) => {        
        if ('objectAttributeIds' in value) {
            getFormValues(value)
        }

        return value
    }

    // useEffect(() => {
    //     if (currentClassId) {
    //         const classesList = classes.data
    //             .map(cls => {
    //                 return {
    //                     value: cls.id,
    //                     label: cls.name
    //                 }
    //             })
    //             .sort((a, b) => a?.label.localeCompare(b?.label))

    //         setClassList(prev => ({ ...prev, class: classesList }))
    //     }
    // }, [currentClassId])

    // useEffect(() => {
    //     if (currentClassId && currentObjectId) {
    //         const objectsList = objects.data
    //             .reduce((acc, object) => {
    //                 if (object.class_id === currentClassId) {
    //                     acc.push({
    //                         value: object.id,
    //                         label: object.name
    //                     })
    //                 }

    //                 return acc 
    //             }, [])
    //             .sort((a, b) => a?.label.localeCompare(b?.label))

    //         setClassList(prev => ({ ...prev, object: objectsList }))
    //     }
    // }, [currentObjectId])

    // useEffect(() => {
    //     if (currentClassId && currentObjectId) {
    //         const objectsAttributesList = currentObject?.object_attributes
    //             ?.reduce((acc, oa) => {
    //                 const currenOA = currentClass?.attributes?.find(cls => {
    //                     return cls.id === oa.attribute_id
    //                 })

    //                 if (currenOA?.history_to_cache || currenOA?.history_to_db) {
    //                     acc.push({
    //                         value: oa.id,
    //                         label: currenOA.name
    //                     })
    //                 }

    //                 return acc
    //             }, [])
    //             .sort((a, b) => a?.label.localeCompare(b?.label))

    //         setClassList(prev => ({ ...prev, objectAttributeIds: objectsAttributesList }))
    //     }
    // }, [currentClassId])

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initial}
            onValuesChange={handleChange}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '12px',
                    // justifyContent: 'space-between'
                }}
            >
                <Form.Item
                    name="class"
                    label="Класс"
                    style={{ flex: 1 }}
                >
                    <Select 
                        options={classes.data
                            .reduce((acc, cls) => {
                                if (cls.package_id === PACKAGE_AREA.SUBJECT) {
                                    acc.push({
                                        value: cls.id,
                                        label: cls.name
                                    })
                                }

                                return acc
                            }, [])
                            .sort((a, b) => a?.label.localeCompare(b?.label)) ?? []}
                        virtual
                        onClear={() => form.resetFields(['object', 'objectAttributeIds'])}
                    />
                </Form.Item>
                <Form.Item
                    name="object"
                    label="Объект"
                    style={{ flex: 1 }}
                >
                    <Select 
                        options={objects.data
                            .reduce((acc, object) => {
                                if (object.class_id === currentClassId) {
                                    acc.push({
                                        value: object.id,
                                        label: object.name
                                    })
                                }
            
                                return acc 
                            }, [])
                            .sort((a, b) => a?.label.localeCompare(b?.label)) ?? []}
                        virtual
                        onClear={() => form.resetFields(['objectAttributeIds'])}
                    />
                </Form.Item>
                <Form.Item
                    name="objectAttributeIds"
                    label="Атрибут объекта"
                    style={{ flex: 1 }}
                >
                    <Select 
                        options={currentObject?.object_attributes
                            ?.reduce((acc, oa) => {
                                const currenOA = currentClass?.attributes?.find(cls => {
                                    return cls.id === oa.attribute_id
                                })
            
                                if (currenOA?.history_to_cache || currenOA?.history_to_db) {
                                    acc.push({
                                        value: oa.id,
                                        label: currenOA.name
                                    })
                                }
            
                                return acc
                            }, [])
                            .sort((a, b) => a?.label.localeCompare(b?.label)) ?? []}
                        mode="multiple"
                        maxTagCount="responsive"
                    />
                </Form.Item>
            </div>
        </Form>
    )
}