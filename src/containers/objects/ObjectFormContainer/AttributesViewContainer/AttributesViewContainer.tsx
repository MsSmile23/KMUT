import { FC, useEffect, useState } from 'react'
import { Card, Col, Form } from 'antd'
import { SERVICES_ATTRIBUTES } from '@shared/api/Attribute'
import { SERVICES_CLASSES } from '@shared/api/Classes'
import { SERVICES_DATA_TYPES } from '@shared/api/DataTypes'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { FORM_NAMES } from '../data'
import { IClass } from '@shared/types/classes'
import { IDataType } from '@shared/types/data-types'
import { IAttribute } from '@shared/types/attributes'
import { IObject } from '@shared/types/objects'
import { getOAValueFormField } from '@shared/utils/objects'
import OAttrFormForView from '@features/object-attributes/OAttrForm/OAttrFormForView'
import { IAttrData } from '@features/object-attributes/OAttrForm/OAttrForm'


interface IObjectFormContainer {
    id?: string
    onClose?: any
    classId?: string | number
    onSuccess?: (object: IObject) => void
    isModal?: boolean
    objShowStatus?: { [key: string]: boolean }
}

const AttributesViewContainer: FC<IObjectFormContainer> = ({
    id,
    classId,
}) => {
    const [classes, setClasses] = useState<IClass[]>([])
    const [objectId, /* setObjectId */] = useState<string | undefined>(id)
    const [dataTypes, setDataTypes] = useState<IDataType[]>([])
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [objectAttributes, setObjectAttributes] = useState<
        {
            attribute: IAttribute
            attribute_id: number
            attribute_value: string | number | boolean | null
            id: number
            object_id: number
        }[]
    >([])
    const [attrData, setAttrData] = useState<IAttrData[]>([])
    const [/* prepareValues */, setPrepareValues] = useState<any>(null)
    const [form] = Form.useForm()
    const selectedClass = form.getFieldValue(FORM_NAMES.CLASS)


    useEffect(() => {
        SERVICES_CLASSES.Models.getClasses({ all: true }).then((resp) => {
            if (resp.success) {
                if (resp?.data !== undefined) {
                    const filteredDataByAbstract = resp?.data?.filter((item) => item.is_abstract === false)

                    if (classId) {
                        form.setFieldValue(FORM_NAMES.CLASS, Number(classId))
                    }

                    setClasses(filteredDataByAbstract)
                }
            }
        })

        SERVICES_DATA_TYPES.Models.getDataTypes({ all: true }).then((resp) => {
            if (resp?.success) {
                if (resp.data !== undefined) {
                    setDataTypes(resp.data)
                }
            }
        })
    }, [])


    const createAttributes = () => {
        const localPrepareValues: any = {}
        const attributesFields: any[] = attributes.map((attr) => {
            return {
                ...attr,
                currentAmount: attr.multiplicity_left === 0 ? 1 : attr.multiplicity_left,
                minAmount: attr.multiplicity_left,
                maxAmount: attr.multiplicity_right ? attr.multiplicity_right : Infinity,
            }
        })


        if (objectAttributes?.length > 0) {
            objectAttributes.forEach((item) => {
                const checkAttribute = attributesFields.find((af) => af.id == item.attribute_id) ?? false

                if (!checkAttribute) {
                    return
                }
                const checkAttributesCount = objectAttributes.filter((oa) => oa.attribute_id == item.attribute_id)

                if (checkAttributesCount.length > 1) {
                    attributesFields.forEach((attrField) => {
                        if (attrField.id == item.attribute_id) {
                            attrField.currentAmount = checkAttributesCount.length
                        }
                    })

                    checkAttributesCount.forEach((check, index2) => {
                        const value = check.attribute_value
                        const attribute_id = check.attribute_id

                        form.setFieldsValue({
                            [item.attribute_id + `-${index2 + 1}`]: getOAValueFormField({
                                value,
                                attribute_id,
                                attributes }),

                        })
                        localPrepareValues[item.attribute_id + `-${index2 + 1}`] = getOAValueFormField({
                            value,
                            attribute_id,
                            attributes })
                    })
                }


                if (checkAttributesCount.length == 1) {
                    const value = item.attribute_value
                    const attribute_id = item.attribute_id

                    form.setFieldsValue({
                        [item.attribute_id + '-1']: getOAValueFormField({
                            value,
                            attribute_id,
                            attributes }),

                    })
                    localPrepareValues[item.attribute_id + '-1'] = getOAValueFormField({
                        value,
                        attribute_id,
                        attributes })
                }
            })
        }

        setPrepareValues(localPrepareValues)
        setAttrData(attributesFields)

    }

    useEffect(() => {
        if (selectedClass !== undefined && classes !== undefined) {
            SERVICES_ATTRIBUTES.Models.getAttributes({ all: true }).then((resp) => {
                if (resp.success) {
                    if (resp.data !== undefined) {
                        const currentClass: IClass = classes.find((cl) => cl.id === selectedClass)

                        setAttributes(
                            resp?.data?.filter(
                                (item) =>
                                    item.classes_ids.find((clas) => clas?.id === currentClass?.id) &&
                                    (item.visibility === 'public' || item.visibility === 'private')
                            )
                        )

                        if (id !== undefined) {
                            SERVICES_OBJECTS.Models.getObjectById(id).then((resp) => {
                                if (resp.success) {
                                    if (resp?.data !== undefined) {

                                        setObjectAttributes(resp.data.object_attributes)
                                        form.setFieldValue(FORM_NAMES.NAME,
                                            resp.data.name === 'null' ? '' : resp.data.name);
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
    }, [id, selectedClass])

    useEffect(() => {
        createAttributes()
    }, [attributes, objectAttributes])

    return (
        <Form labelAlign="left" form={form} disabled={true}>
            <Card style={{  }}>
                <Col span={24} style={{ display: 'flex' }} >
                    <Form.Item
                        style={{ width: '100%' }}
                        colon={false}
                    >
                        <OAttrFormForView
                            attributes={attrData}
                            dataTypes={dataTypes}
                            form={form}
                            objectId={Number(objectId)}
                        />
                    </Form.Item>
                </Col>


            </Card>
        </Form>
    )
}

export default AttributesViewContainer