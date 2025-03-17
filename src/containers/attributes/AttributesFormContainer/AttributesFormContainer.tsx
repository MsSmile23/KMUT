/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-max-depth */
import {
    getAttributeCategories
} from '@shared/api/AttributeCategories/Models/getAttributeCategories/getAttributeCategories'
import {
    getAttributeStereotypes
} from '@shared/api/AttributeStereotypes/Models/getAttributeStereotypes/getAttributeStereotypes'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { getDataTypes } from '@shared/api/DataTypes/Models/getDataTypes/getDataTypes'
import { getPackages } from '@shared/api/Packages/Models/getPackages/getPackages'
import { useApi } from '@shared/hooks/useApi'
import { IAttributeCategory } from '@shared/types/attribute-categories'
import { IAttributeStereotype } from '@shared/types/attribute-stereotypes'
import { IClass } from '@shared/types/classes'
import { IDataType } from '@shared/types/data-types'
import { IPackage } from '@shared/types/packages'
import { Forms } from '@shared/ui/forms'
import { createOptions } from '@shared/ui/forms/Select/createOptions'
import { Col, ColProps, Divider, Form, message, Row, RowProps, Select, Space, Typography } from 'antd'
import { FormInstance, Rule } from 'antd/es/form'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { attributesProps } from '../AttributesTableContainer/AttributesTableData'
import { attributesFormDefaultValues, attributesFormItemNames as names, visibilityOptions } from './AttributesFormData'
import { getAttributeById } from '@shared/api/Attribute/Models/getAttributeById/getAttributeById'
import { ButtonSubmit } from '@shared/ui/buttons'
import { patchAttributeById } from '@shared/api/Attribute/Models/patchAttributeById/patchAttributeById'
import { postAttributes } from '@shared/api/Attribute/Models/postAttributes/postAttributes'
import { IAttribute, IAttributePost, IAttributeViewType } from '@shared/types/attributes'
import { getAttributesViewTypes } from '@shared/api/Attribute/Models/getAttributesViewTypes/getAttributesViewTypes'
import * as Icons from '@ant-design/icons/lib/icons/'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Modal } from 'antd'
import { ECTabs } from '@shared/ui/tabs'
import AttributeFormViewMeasurement from './AttributeFormMeasurement/AttributeFormMeasurement'
import AttributeFormViewTypes from './AttributeFormViewTypes/AttributeFormViewTypes'
import AttributeFormParams from './AttributeFormParams/AttributeFormParams'
import { responseHandler } from '@shared/utils/api.utils'
import { useLicenseStore } from '@shared/stores/license'
import { useAttributesStore } from '@shared/stores/attributes'
const { Text } = Typography

export interface IAttributesFormContainer {
    form?: FormInstance<any>
    id?: number
    setLinkedAttributes?: any, // deprecated
    modal?: any // deprecated
    onSubmit?: (attribute: IAttribute, payload?: Record<string, any>) => void
}

type TFormValues = Partial<Record<keyof typeof attributesFormDefaultValues, any>>

const createPlaceholder = (loading: boolean) => loading ? 'Загрузка' : ''

const options = {
    left: new Array(10).fill(10).map((_el, i) => {
        return { value: i, label: i }
    }),
    right: new Array(10).fill(10).map((_el, i) => {
        return { value: i, label: i === 0 ? '*' : i }
    })
}

const rowStyles: RowProps = {
    gutter: [32, 0],
}
const colStyles: ColProps = {
    xs: 8
}
const required: Rule[] = [{ required: true, message: 'Обязательно' }]

const ItemDivider: React.FC = () => <Divider style={{ marginTop: 0 }} />

const AttributesFormContainer: React.FC<IAttributesFormContainer> = ({
    form,
    id,
    onSubmit,
    ...props
}) => {
    const setFieldsValue = form?.setFieldsValue

    const [formValues, setFormValues] = useState<TFormValues>({})

    const [activeTab, setActiveTab] = useState('measurements')
    const dataTypes = useApi<IDataType[]>([], getDataTypes, { all: true })
    const attrCats = useApi<IAttributeCategory[]>([], getAttributeCategories, { all: true })
    const packages = useApi<IPackage[]>([], getPackages, { all: true })
    const attrTypes = useApi<IAttributeStereotype[]>([], getAttributeStereotypes, { all: true })
    const classes = useApi<IClass[]>([], getClasses, { all: true })
    const viewTypes = useApi<IAttributeViewType[]>([], getAttributesViewTypes, { all: true })
    const [additionalViewTypes, setAdditionalViewTypes] = useState([])
    const [arrayIndex, setArrayIndex] = useState(0)

    const handleAddViewType = (type) => {
        if (type == 'bottom') {
            setAdditionalViewTypes([...additionalViewTypes || [], { index: arrayIndex }]);
        }

        if (type == 'top') {
            setAdditionalViewTypes([{ index: arrayIndex }, ...additionalViewTypes || []]);
        }
        setArrayIndex(arrayIndex + 1)
    };

    const handleViewTypeChange = (index: number, id: number) => {
        setAdditionalViewTypes(additionalViewTypes.map(vt => vt.index === index
            ? {
                ...vt,
                ...viewTypes.data?.find(el => el.id == id)
            }
            : vt));
    };

    const handleViewTypeDelete = (index: number) => {
        setAdditionalViewTypes(additionalViewTypes.filter(vt => vt.index !== index))
    };

    const [
        editedInitialValues,
        setEditedInitialValues
    ] = useState<Partial<typeof attributesFormDefaultValues>>({})

    const [msg, ctx] = message.useMessage();

    const iconOptions: any[] = Object.keys(Icons).map((icon) => {
        return {
            value: icon,
            label: (
                <Space>
                    <ECIconView icon={icon as any} />
                    <Text>{icon}</Text>
                </Space>
            ),
        }
    })

    const submit = async () => {
        await form.validateFields()

        const values: Partial<typeof attributesFormDefaultValues> = form.getFieldsValue(true)

        const payload: IAttributePost = {
            name: values.name,
            visibility: values.visibility as any,
            multiplicity_left: values.multiplicity.left,
            multiplicity_right: values.multiplicity.right || null,
            attribute_category_id: values.attributeCategory ?? null,
            data_type_id: values.dataType,
            attribute_stereotype_id: values.attributeStereotype ?? null,
            sort_order: Number(values.sortOrder),
            unit: values.unit,
            history_to_cache: values.historyToCache,
            history_to_db: values.historyToDb,
            readonly: values.readonly,
            package_id: values.package,
            secondary_view_type_ids: additionalViewTypes?.map(el => el.id) || [],
            params: JSON.stringify(values.params),
            // initial_value: values.initialValue,
            // static_feature: values.staticValue,
            view_type_id: values.viewType,
            description: values.description,
        }

        if (!id) {
            payload['codename'] = values.codename
        }

        if (values.classes && Array.isArray(values.classes) && values.classes.length > 0) {
            payload.classes_ids = values.classes.reduce((acc, item) => {
                //return { ...acc, [item]: true }
                //acc.push({ id: item, status: true })
                acc.push(item)

                return acc
                //}, [] as IAttributePost['classes_ids'])
            }, [] as number[])

        }

        const response = id ? await patchAttributeById(`${id}`, payload) : await postAttributes(payload)

        responseHandler(
            response,
            Modal,
            `Ошибка при ${id ? 'редактировании' : 'создании'} атрибута`,
            `Атрибут успешно ${id ? 'обновлен' : 'создан'}`,
            () => onSubmit(response.data, payload)
        )
    }

    useEffect(() => {
        if (!id) {
            return
        }

        getAttributeById(`${id}`).then((response) => {
            if (!response.data) {
                return
            }

            const d = response.data

            setEditedInitialValues({
                name: d.name,
                visibility: d.visibility,
                unit: d.unit,
                dataType: d.data_type_id,
                // initialValue: d.initial_value,
                // staticValue: d?.static_feature,
                multiplicity: {
                    left: d.multiplicity_left || 0,
                    right: d.multiplicity_right || 0
                },
                secondary_view_type_ids: d.secondary_view_type_ids ?? [],
                attributeCategory: d.attribute_category_id,
                sortOrder: d.sort_order,
                package: d.package_id,
                params: d.params,
                attributeStereotype: d.attribute_stereotype_id,
                classes: d.classes.map((cl) => cl.id),
                historyToDb: d.history_to_db,
                historyToCache: d.history_to_cache,
                readonly: d.readonly,
                viewType: d.view_type_id,
                codename: d.codename,
                description: d.description,
            })
        })

    }, [id])

    useEffect(() => setArrayIndex(additionalViewTypes?.length ?? 0), [additionalViewTypes])

    useEffect(() => {
        setFieldsValue?.(editedInitialValues)
        setFormValues(editedInitialValues)
        setAdditionalViewTypes(editedInitialValues.secondary_view_type_ids?.map((vtId, index) => {
            return ({
                index,
                ...viewTypes.data.find(el => el.id == vtId)
            })
        }))
    }, [setFieldsValue, editedInitialValues])

    return (
        <>
            {ctx}
            <Form
                id="attributes-form"
                form={form}
                labelCol={{ xs: 12 }}
                colon={false}
                requiredMark={true}
                labelAlign="left"
                initialValues={id ? {} : attributesFormDefaultValues}
                onValuesChange={(changed, values) => {
                    /**
                     * не вызывается form при изменения селекта, поэтому пока через useState
                     * todo: посмотреть мануал по использованию зависимостей внутри формы
                     */
                    setFormValues(values)
                    form?.setFieldsValue(values)

                    if (names.package in changed) {
                        form?.resetFields([names.attributeStereotype, names.classes])
                    }
                }}
            >
                <ButtonSubmit
                    style={{ background: 'green' }}
                    onClick={submit}
                />
                <Row {...rowStyles} style={{ marginTop: 20 }}>
                    <Col {...colStyles}>
                        <Form.Item
                            label={attributesProps.name.label}
                            name={attributesProps.name.name}
                            rules={attributesProps.name.rules}
                        >
                            <Forms.Input />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={attributesProps.visibility.label}
                            name={attributesProps.visibility.name}
                            rules={attributesProps.visibility.rules}
                        >
                            <Forms.Select options={visibilityOptions} />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={attributesProps.codename.label}
                            name={attributesProps.codename.name}
                            rules={attributesProps.codename.rules}
                        >
                            <Forms.Input disabled={id ? true : false} />
                        </Form.Item>
                    </Col>
                </Row>

                <ItemDivider />

                <Row {...rowStyles}>
                    <Col {...colStyles}>
                        <Form.Item
                            label={attributesProps.dataType.label}
                            name={attributesProps.dataType.name}
                            rules={attributesProps.dataType.rules}
                        >
                            <Forms.Select
                                options={createOptions(dataTypes.data)}
                                disabled={dataTypes.empty || dataTypes.loading}
                                loading={dataTypes.loading}
                                placeholder={createPlaceholder(dataTypes.loading)}
                            />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.viewType.label}</Forms.Label>}
                            name={attributesProps.viewType.name}
                            rules={attributesProps.viewType.rules}
                        >
                            <Forms.Select
                                dropdownStyle={{ width: 'fit-content' }}
                                // todo: в attrTypes нет поля package_id, потом добавить аргумент compare
                                options={createOptions(viewTypes.data)}
                                loading={viewTypes.loading}
                                placeholder={createPlaceholder(viewTypes.loading)}
                            />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        {/* //? Прокидывается некий props, не совсем понятно что и как */}
                        <Form.Item
                            labelAlign="left"
                            label={attributesProps.icon.label}
                            name={attributesProps.icon.name}
                        >


                            <Forms.Select
                                customData={{
                                    data: iconOptions?.slice(1, iconOptions?.length) ?? [],
                                    convert: {
                                        valueField: 'value',
                                        optionFilterProp: 'value',
                                        optionLabelProp: 'label',
                                    },
                                }}
                                {...props}
                            />
                            {/* <Forms.IconSelect {...props} /> */}
                        </Form.Item>
                    </Col>
                </Row>

                <ItemDivider />

                <Row {...rowStyles}>
                    <Col {...colStyles}>
                        {/* todo: убрать в multiplicity select */}
                        <Form.Item
                            label={<Forms.Label>{attributesProps.multiplicity.label}</Forms.Label>}
                            name={attributesProps.multiplicity.name}
                            rules={attributesProps.multiplicity.rules}
                        >
                            <Space.Compact style={{ width: '100%' }}>
                                {['left', 'right'].map((k) => (
                                    <Form.Item
                                        key={k}
                                        noStyle
                                        name={['multiplicity', k]}
                                        // todo: посмотреть как сделать поле required нормальным образом
                                        rules={[{
                                            required: Boolean(required),
                                            message: k === 'left' ? 'Обязательно' : ' '
                                        }]}
                                    >
                                        <Select options={options[k]} style={{ width: '100%' }} placeholder="*" />
                                    </Form.Item>
                                ))}
                            </Space.Compact>
                        </Form.Item>

                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.attributeCategory.label}</Forms.Label>}
                            name={attributesProps.attributeCategory.name}
                            rules={attributesProps.attributeCategory.rules}
                        >
                            <Forms.Select
                                options={createOptions(attrCats.data)}
                                disabled={attrCats.empty}
                                loading={attrCats.loading}
                                placeholder={createPlaceholder(attrCats.loading)}
                            />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.sortOrder.label}</Forms.Label>}
                            name={attributesProps.sortOrder.name}
                            rules={attributesProps.sortOrder.rules}
                            initialValue="99"
                        >
                            <Forms.Input />
                        </Form.Item>
                    </Col>
                </Row>

                <ItemDivider />

                <Row {...rowStyles}>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.package.label}</Forms.Label>}
                            name={attributesProps.package.name}
                            rules={attributesProps.package.rules}
                        >
                            <Forms.Select
                                options={createOptions(packages.data)}
                                disabled={packages.empty || packages.loading}
                                loading={packages.loading}
                                placeholder={createPlaceholder(packages.loading)}
                            />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.attributeStereotype.label}</Forms.Label>}
                            name={attributesProps.attributeStereotype.name}
                            rules={attributesProps.attributeStereotype.rules}
                        >
                            <Forms.Select
                                dropdownStyle={{ width: 'fit-content' }}
                                disabled={!formValues?.package}
                                // todo: в attrTypes нет поля package_id, потом добавить аргумент compare
                                options={createOptions(attrTypes.data)}
                                loading={attrTypes.loading}
                                placeholder={createPlaceholder(attrTypes.loading)}
                            />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.classes.label}</Forms.Label>}
                            name={attributesProps.classes.name}
                            rules={attributesProps.classes.rules}
                        >
                            <Forms.Select
                                mode="multiple"
                                maxTagCount="responsive"
                                disabled={!formValues?.package}
                                options={createOptions(classes.data, ['package_id', formValues?.package])}
                                loading={classes.loading}
                                placeholder={createPlaceholder(classes.loading)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <ItemDivider />
                <Row {...rowStyles}>

                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.unit.label}</Forms.Label>}
                            name={attributesProps.unit.name}
                            rules={attributesProps.unit.rules}
                        >
                            <Forms.Input />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            label={<Forms.Label>{attributesProps.description.label}</Forms.Label>}
                            name={attributesProps.description.name}
                            rules={attributesProps.description.rules}
                        >
                            <Forms.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <ItemDivider />

                <ECTabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'measurements',
                            label: 'Измерения',
                            children: <AttributeFormViewMeasurement
                                rowStyles={rowStyles}
                                attributesProps={attributesProps}
                                names={names}
                            />
                        },
                        {
                            key: 'representation',
                            label: 'Представления',
                            disabled: !form.getFieldValue('viewType') || viewTypes.loading,
                            children: <AttributeFormViewTypes
                                handleAddViewType={handleAddViewType}
                                attributesProps={attributesProps}
                                viewTypes={viewTypes}
                                additionalViewTypes={additionalViewTypes}
                                createOptions={createOptions}
                                handleViewTypeChange={handleViewTypeChange}
                                createPlaceholder={createPlaceholder}
                                handleViewTypeDelete={handleViewTypeDelete}
                            />
                        },
                        {
                            key: 'Params',
                            label: 'Параметры',
                            disabled: false,
                            children: <AttributeFormParams
                                rowStyles={rowStyles}
                                colStyles={colStyles} />
                        }
                    ]}
                />
            </Form>
        </>
    )
}

export default AttributesFormContainer