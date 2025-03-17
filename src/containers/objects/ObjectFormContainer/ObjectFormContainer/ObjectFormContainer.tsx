/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useState } from 'react'
import { Card, Col, Divider, Form, Modal, Row, Spin } from 'antd'
import { Forms } from '@shared/ui/forms'
import { BaseButton, Buttons } from '@shared/ui/buttons'
import { SERVICES_ATTRIBUTES } from '@shared/api/Attribute'
import { SERVICES_CLASSES } from '@shared/api/Classes'
import { SERVICES_DATA_TYPES } from '@shared/api/DataTypes'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { FORM_NAMES } from '../data'
import { IClass } from '@shared/types/classes'
import { IDataType } from '@shared/types/data-types'
import { IAttribute } from '@shared/types/attributes'
import { ILink, ILinkField, ILinkPost } from '@shared/types/links'
import { IAttrData, OAttrFormMemo } from '@features/object-attributes/OAttrForm/OAttrForm'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { SERVICES_LINKS } from '@shared/api/Links'
import { IObject } from '@shared/types/objects'
import LinksRelationForm from '../LinksRelationForm/LinksRelationForm'
import { AttributeModal } from '../ui/AttributeModal/AttributeModal'
import { jsonParseAsObject, responseErrorHandler } from '@shared/utils/common'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { useAttributesStore } from '@shared/stores/attributes'
import { useObjectsStore } from '@shared/stores/objects'
import { getURL } from '@shared/utils/nav'
import { ECTooltip } from '@shared/ui/tooltips'
import { ApartmentOutlined } from '@ant-design/icons'
import { DefaultModal2 } from '@shared/ui/modals'
import ObjectLinksTree from '@entities/objects/ObjectLinksTree/ObjectLinksTree'
import { findFieldIsImage, uploadImage } from '@shared/ui/ECUIKit/forms'


interface IObjectFormContainer {
    id?: number
    objectId?: IObject
    onClose?: any
    classId?: string | number
    onSuccess?: (object: IObject) => void
    isModal?: boolean
    objShowStatus?: { [key: string]: boolean }
    setObject?: React.Dispatch<React.SetStateAction<IObject>>
}

type IObjectPost = Partial<IObject>

interface ObjShowStatus {
    [key: string]: boolean
}
interface ObjData {
    id: number
    classId: number
    status: boolean
    objectName: string
    className: string
}
export interface IOa {
    attribute: IAttribute
            attribute_id: number
            attribute_value: string | number | boolean | null
            id: number
            object_id: number
}

const ObjectFormContainer: FC<IObjectFormContainer> = ({ id, classId, onSuccess, isModal = false, setObject }) => {
    const [classes, setClasses] = useState<IClass[]>([])
    const [objectId, setObjectId] = useState<number | undefined>(id)
    const [dataTypes, setDataTypes] = useState<IDataType[]>([])
    const [isContinue, setIsContinue] = useState<boolean>(false)
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const updateStore = useObjectsStore(st => st.fetchData)
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(true)
    const [isLoadingAttrs, setIsLoadingAttrs] = useState<boolean>(true)
    const [isLoadingLinks, setIsLoadingLinks] = useState<boolean>(true)
    // const [objectName, setObjectName] = useState('')
    const [protectedAttributes, setProtectedAttributes] = useState<any[]>([])
    const [objectAttributes, setObjectAttributes] = useState<IOa[]>([])

    const [attrData, setAttrData] = useState<IAttrData[]>([])
    const navigate = useNavigate()
    const [prepareValues, setPrepareValues] = useState<any>(null)
    const [compState, setCompState] = useState<{
        formData: {
            objects?: IObjectPost[]
            links?: ILinkPost[]
            formIds?: { entity: 'object' | 'link'; realId: number; formId: number }[]
        }
        linkFields: ILinkField[]
        errors: any
    }>({
        formData: {
            objects: [],
            links: [],
            formIds: [],
        },
        linkFields: [],
        errors: [],
    })
    const [extractedData, setExtractedData] = useState<any>(null)
    const [isObjectShow, setIsObjectShow] = useState<ObjData>({
        id: null,
        classId: null,
        status: false,
        objectName: '',
        className: '',
    })
    const [objShowStatus, setObjShowStatus] = useState<ObjShowStatus>({})

    //*линки,объекты которых нет в сторе
    const [unresolvedObjectLinks, setUnresolvedObjectLinks] = useState<ILink[]>([])

    //~Добавление валидации для атрибутов (тест)
    const [validation, setValidation] = useState<any>(null)

    //~Добавление валидации для атрибутов (тест)

    const [form] = Form.useForm()
    const [data, setData] = useState<any>(null)


    Form.useWatch(FORM_NAMES.CLASS, form)
 
    const selectedClass = form.getFieldValue(FORM_NAMES.CLASS)
    const [isOpenTreeModal, setIsOpenTreeModal] = useState<boolean>(false)

    useEffect(() => {
        setObjectId(id)
    }, [id])
    // Необходимо при отрытии формы без переданного класса
    const [classFromSelect, setClassFromSelect] = useState<number>(undefined)
    const classesForSelect = useClassesStore(selectClasses)

    //*Сохраняем объъект в стейт ля дальнейшего использования внутри подкомпонентов без запросов к стору
    const [currentObject, setCurrentObject] = useState<IObject>(null)

    // const getByIndex = useObjectsStore(selectObjectByIndex)
    const getAttributeByIndex = useAttributesStore.getState().getByIndex
    const SubmitHandler = async (values?: any) => {

        let newValues = data ?? values

        const valuesHasOwnImage = findFieldIsImage(newValues)

        if (valuesHasOwnImage) {
            newValues = await uploadImage(newValues, form.setFieldsValue)
        }

        //!Костыльное решение для правильного сбора значений атрибутов из формы
        // try {
        const class_id = form.getFieldValue(FORM_NAMES.CLASS)
        const attributeValues = newValues
        const { name, codename, ...attrs } = attributeValues


        const filteredAttributes = []

        Object.keys(attrs).forEach((key) => {
            if (Number(key.split('id')[1]) ) {
                filteredAttributes.push({
                    attribute_id: Number(key.split('-')[0]),
                    attribute_value: attrs[key] ?? null,
                    object_attribute_id: Number(key.split('id')[1]) ?? null
    
                })
            }
            else {
                if (attrs[key] !== undefined && attrs[key] !== null && attrs[key] !== '') {
                    filteredAttributes.push({
                        attribute_id: Number(key.split('-')[0]),
                        attribute_value: attrs[key],
                        object_attribute_id: Number(key.split('id')[1]) || null     
                    })  
                }
            }
            
    
        })
        const localAttributes: any = {
            class_id: class_id,
            name: name,
            attributes: [
                ...filteredAttributes,
                ...protectedAttributes,
            ],
        }

        if (!id) {
            localAttributes.codename = codename
        }



        //*Тестируем блокировку отправки на бек при нарушении валидации
        if (validation === null || !Object?.values(validation).includes(false)) {
            const responseObject = objectId
                ? await SERVICES_OBJECTS.Models.putObjectById(String(objectId), localAttributes)
                : await SERVICES_OBJECTS.Models.postObjects(localAttributes)

            if (responseObject.success) {
                const object_id: number = responseObject.data.id

                setObjectId(object_id)

                let links: ILinkPost[] = compState.linkFields.map((item) => {
                    // const relationProps = UTILS.Relations.getRelationProps(item.relation)

                    const newItem: Partial<ILinkPost> = {
                        // left_object_id:  relationProps.dirType == 'left' ? object_id : item.value,
                        // right_object_id: relationProps.dirType == 'right' ? object_id : item.value,
                        left_object_id: (item.relation.left_class_id == item.classId 
                        || item.originRelation?.left_class_id == item.classId) ? item.object?.data?.id : object_id,
                        right_object_id: (item.relation?.right_class_id == item.classId
                        || item.originRelation?.right_class_id == item.classId ) ? item.object?.data?.id  : object_id,
                        relation_id: item.relation_id,
                        order: item.order
                    }

                    if (item.id !== 0) {
                        return { ...newItem, id: item.id } as ILinkPost
                    }

                    return { ...(newItem as ILinkPost) }
                })

                links = [...links, ...extractedData]
            
                //*Смешиваем фактические линки и скрытые
                unresolvedObjectLinks.forEach(link => {
                    const item = {
                        left_object_id: link.left_object_id,
                        right_object_id: link.right_object_id,
                        relation_id: link.relation_id,
                        order: link.order,
                        id: link.id
                    }

                    links.push(item)

                })
                const payload: {
                    object_id: number
                    links: ILinkPost[]
                } = { object_id, links }


                try {

                    const responseLinks: any = await SERVICES_LINKS.Models.postLinksSyncObjects(payload)

                    responseLinks.success
                        ? Modal.success({
                            content: `Объект успешно ${objectId ? 'изменен' : 'создан'}`,
                        })
                        : Modal.error({
                            content: `Связи сохранены частично, обнаружены ошибки:
                        ${responseLinks.error.response.data.message}`,
                        })

                    compState.linkFields.map((linkField) => {
                        const newLinkData = responseLinks.data.created?.find(
                            (data: any) => Number(data.left_object_id) === Number(linkField.value)
                        )

                        newLinkData ? (linkField.id = newLinkData?.id) : linkField.value
                    })
                    setCompState({ ...compState, errors: responseLinks.data?.errors })

                    setCompState((prevState) => ({
                        ...prevState,
                        linkFields: prevState.linkFields.map((linkField, index) => {
                            const errorsToAdd = responseLinks?.data?.errors?.find((error) => error.index === index)

                            return {
                                ...linkField,
                                errors: errorsToAdd,
                            }
                        }),
                    }))

                    if (onSuccess) {
                        onSuccess(responseObject.data)

                        return
                    }

                    if (isContinue == true) {
                        navigate(getURL(
                            `${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${classId}`, 
                            'manager'
                        ))
                        // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${classId}`)
                        setIsContinue(false)
                        await updateStore()
                    }
                    form.setFieldsValue(data)
                } catch (error) {
                    console.error('error', error)
                    Modal.error({ content: `Связи сохранены частично, обнаружены ошибки: ${error.message}` })
                }
            // const responseLinks: any = await SERVICES_LINKS.Models.postLinksSyncObjects(payload)
            }
            else {
                responseErrorHandler({
                    response: responseObject,
                    modal: Modal,
                    errorText: `Ошибка при ${objectId ? 'редактировании' : 'создании'}`,
                })
            }
        }
        else {
            const errors  = []

            Object.keys(validation).map(item => {
                if (validation[item] == false) {
                    const attribute = attributes.find(attr => attr.id == item)

                    errors.push(` Атрибут ${attribute.name} не прошёл валидацию!`)
                }
            })
            responseErrorHandler({
                response: {
                    data: [],
                    success: false,
                    error: { errors: errors } 
                },
                modal: Modal,
                errorText: 'Ошибка валидации атрибутов',
            })
        }
        // } 
        // catch (error) {
        //     console.error(error.message)
        //     Modal.error({ content: `Связи сохранены частично, обнаружены ошибки: ${error.message}` })
        // }
    }

    useEffect(() => {

        form.setFieldValue(FORM_NAMES.CLASS, classFromSelect)
    }, [classFromSelect])

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

        const attributesFields: any[] = attributes.map((attr) => {
            const objectAttrs = objectAttributes.filter(oa => oa.attribute_id == attr.id)

            return {
                ...attr,
                currentAmount: objectAttrs.length > 0
                    ? objectAttrs.length
                    :  attr.multiplicity_left === 0 ? 1 : attr.multiplicity_left,
                minAmount: attr.multiplicity_left,
                maxAmount: attr.multiplicity_right ? attr.multiplicity_right : Infinity,
                objectAttributes: objectAttrs.length > 0 ? objectAttrs : null

            }
        })

        setAttrData(attributesFields)
    }

    useEffect(() => {
    
        if (selectedClass !== undefined && classes !== undefined) {
            SERVICES_ATTRIBUTES.Models.getAttributes({ all: true }).then((resp) => {

                if (resp.success) {
                    if (resp.data !== undefined) {
                        const currentClass: IClass = classes.find((cl) => cl.id == classId)

                        setAttributes(
                            resp?.data?.filter(
                                (item) =>
                                    item.classes_ids.find((clas) => clas?.id === currentClass?.id) &&
                                    (item.visibility === 'public' || item.visibility === 'private')
                            )
                        )

                        const localProtectedAttributes: any[] = resp?.data
                            ?.filter(
                                (item) =>
                                    item.classes_ids.find((clas) => clas?.id === currentClass?.id) &&
                                    item.visibility === 'protected'
                            )
                            .map((attr) => {
                                return {
                                    attribute_id: attr?.id,
                                    attribute_value: attr?.initial_value ?? null,
                                }
                            })

                        setProtectedAttributes(localProtectedAttributes)

                        setIsLoadingAttrs(false) 

                    
                        if (id !== undefined) {

                            // const object = getByIndex('id', id)

                            // setIsLoadingForm(false) 

                            // setObjectAttributes(object.object_attributes)

                            // form.setFieldValue(
                            //     FORM_NAMES.NAME,
                            //     object.name === 'null' ? '' : object.name
                            // )

                            SERVICES_OBJECTS.Models.getObjectById(id).then((resp) => {
                                if (resp.success) {
                                    if (resp?.data !== undefined) {

                                        setCurrentObject(resp.data)
                                        setObject(resp.data)

                                        setIsLoadingForm(false) 
                                        const objectAttributes  = resp?.data.object_attributes.map(attr => {return (
                                            { ...attr, attribute: getAttributeByIndex('id', attr.attribute_id) })})

                                        setObjectAttributes(objectAttributes)
                                        form.setFieldsValue({
                                            [FORM_NAMES.NAME]: resp.data.name === 'null' ? '' : resp.data.name,
                                            codename: resp.data?.codename
                                        }

                                        )
                                    }
                                }
                            }) 
                        } else {
                            setIsLoadingForm(false) 
                        }
                    }
                }
            })
        }
    }, [id, selectedClass])

    useEffect(() => {
        createAttributes()
    }, [attributes, objectAttributes])

    useEffect(() => {
        const localPrepareValues: any = {}

        if (objectAttributes?.length > 0) {
            objectAttributes.forEach((item) => {
                let value

                if (item.attribute.data_type.inner_type == 'jsonb'
                && item.attribute.data_type.mnemo == 'schedule') {
                    value = jsonParseAsObject(item.attribute_value)
                }
                else {
                    value = item.attribute_value
                }

                if (item.attribute.data_type.inner_type == 'boolean') {
                    //value  = item.attribute_value == 0 ? false : true
                    value = item.attribute_value === '1'
                }

                //Проверяем существует ли вообще атрибут класса соответствующий атрибуту объекта
                const checkAttribute = attrData.find((af) => af.id == item.attribute_id) ?? false

                if (!checkAttribute) {
                    return
                }

                //Проверяем сколько вообще атрибутов объекта существует для атрибута класса данного атрибута объекта
                const checkAttributesCount = objectAttributes.filter((oa) => oa.attribute_id == item.attribute_id)

                if (checkAttributesCount.length > 1) {
                    attrData.forEach((attrField) => {
                        if (attrField.id == item.attribute_id) {
                            attrField.currentAmount = checkAttributesCount.length
                        }
                    })

                    checkAttributesCount.forEach((check, index) => {
                        const value = check.attribute_value



                        form.setFieldsValue({
                            // [item.attribute_id + `-${index2 + 1}`]: check?.attribute_value,
                            [item.attribute_id + '-' + (index + 1) + '_id' + item?.id]: value
                        })
                        localPrepareValues[item.attribute_id + '-' + index + 1 + '_id' + item?.id] = value
                    })
                }

                if (checkAttributesCount.length == 1) {
                
                    item.attribute_id  + '-' + '-1' + '_id' + item?.id
          
                    form.setFieldsValue({
                        [   item.attribute_id  + '-' + '1' + '_id' + item?.id]: value
                        
                        // getOAValueFormField({
                        //     value: value,
                        //     attribute_id: attribute_id,
                        //     attributes: objectAttributes,
                        // }),
                    })
                    localPrepareValues[  item.attribute_id  + '-' + '1' + '_id' + item?.id] = value
                    
                    //  getOAValueFormField({
                    //     value: value,
                    //     attribute_id: attribute_id,
                    //     attributes: objectAttributes
                    // })
                }
            })
        }

     

        setPrepareValues(localPrepareValues)

    }, [objectAttributes])

    const onChangeLinks = (linkFields: ILinkField[]) => {

        setCompState({ ...compState, linkFields })
    }


    const handleButtonCancel = () => {
        Object.keys(form.getFieldsValue()).forEach((item) => {
            form.setFieldsValue({
                [item]: null,
            })
        })
    }

    const handleUndoChangesButton = () => {
        if (prepareValues !== null) {
            form.setFieldsValue(prepareValues)
        } else {
            handleButtonCancel()
        }
    }
    const cancelTreeModalHandler = () => {
        setIsOpenTreeModal(false)
    }

    return (
        <>

            <DefaultModal2
                height="75vh"
                onCancel={cancelTreeModalHandler}
                open={isOpenTreeModal}
                tooltipText="Просмотр дерева объекта"
                showFooterButtons = {false}
            >
                <div style={{ height: '100%', overflow: 'auto' }}>
                    <ObjectLinksTree cancelTreeModalHandler={cancelTreeModalHandler} objectId={objectId} />
                </div>
            </DefaultModal2>
            {(!classId && !classFromSelect) && 
        <Col span={8}>
            <Forms.Select
                onChange={(e) => {setClassFromSelect(e)}}
                placeholder="Выберите класс создаваемого объекта" 
                customData={{
                    data: classesForSelect.filter((item) => item.is_abstract === false) ?? [],
            
                    convert: { valueField: 'id', optionLabelProp: 'name' },
                }}
            />
        </Col>}
            {!isLoadingAttrs && !isLoadingForm && !isLoadingLinks && (
                <>
                    <Form labelAlign="left" labelCol={{ span: 8 }} form={form} onFinish={SubmitHandler}>
                        <Row gutter={8} align="middle">
                            {isModal ? (
                                <Col>
                                    <Buttons.ButtonSubmit customText="Сохранить изменения" color="green" />
                                </Col>
                            ) : (
                                <>
                                    <Col>
                                        <Buttons.ButtonSubmit
                                            color="green"
                                            customText="Сохранить и перейти в список"
                                            onClick={() => {
    
                                                setData(form.getFieldsValue())
                                                setIsContinue(true)
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <Buttons.ButtonSubmit
                                            onClick={() => {  
                                                setData(form.getFieldsValue())
                                            }}
                                            color="#1890FF" customText="Сохранить и продолжить"
                                        />
                                    </Col>
                                </>
                            )}
                            <Col>
                                <Buttons.ButtonClear customText="Отмена изменений" onClick={handleUndoChangesButton} />
                            </Col>
                            <Col>
                                <Buttons.ButtonCancel customText="Очистить все поля" onClick={handleButtonCancel} />
                            </Col>
                            <Col
                                span={3}
                                style={{
                                    justifySelf: 'flex-end',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginLeft: 'auto' }}
                            >   
                                <ECTooltip title="Посмотреть дерево объекта">
                                    <BaseButton
                                        size="small"
                                        shape="circle"
                                        style={{ backgroundColor: '#188EFC', color: '#ffffff' }}
                                        type="primary"
                                        onClick={() => {setIsOpenTreeModal(true)}}
                                        icon={<ApartmentOutlined />}
                                    />
                                </ECTooltip>
                            </Col>
                        </Row>
                        <Card style={{ margin: '20px 0' }}>
                            <Row gutter={8} align="middle">
                                <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={4}>Имя объекта</Col>
                                    <Form.Item
                                        label=" "
                                        labelCol={{ offset: 1, span: 1 }}
                                        style={{ width: '100%', margin: 0 }}
                                        colon={false}
                                        name={FORM_NAMES.NAME}
                                        rules={[{ required: true, message: 'Обязательное поле' }]}
                                    >
                                        <Forms.Input placeholder="Введите имя объекта" type="text" />
                                    </Form.Item>
                                </Col>
                                
                                <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={4}>Код</Col>
                                    <Form.Item
                                        label=" "
                                        labelCol={{ offset: 1, span: 1 }}
                                        style={{ width: '100%', margin: 0 }}
                                        colon={false}
                                        name="codename"
                                        rules={[{ required: true, message: 'Обязательное поле' }]}
                                    >
                                        <Forms.Input
                                            disabled={id ? true : false} 
                                            placeholder="Введите код" type="text"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {attrData?.length > 0 && <Divider type="horizontal" />}

                            <OAttrFormMemo
                                attributes1={attrData}
                                dataTypes={dataTypes}
                                setAttrData={setAttrData}
                                form={form}
                                objectId={Number(objectId)}
                                classId={classId}
                                setValidation = {setValidation}

                            />
                        </Card>
                    </Form>

                    {isObjectShow.status && isObjectShow.id in objShowStatus && (
                        <AttributeModal setIsObjectShow={setIsObjectShow} isObjectShow={isObjectShow} />
                    )}
                </>
            )}

            {((isLoadingAttrs || isLoadingForm || isLoadingLinks) 
            && (classId !== undefined || classFromSelect !== undefined)) && 
            <Col style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin style={{ margin: '0 auto', width: '100%' }} tip="Идёт загрузка формы" size="large" >
                </Spin>
            </Col>}

            {(classId || classFromSelect) && (
                <LinksRelationForm
                    currentObject={currentObject}
                    setUnresolvedObjectLinks={setUnresolvedObjectLinks}
                    isLoadingAttrs = {isLoadingAttrs}
                    isLoadingForm={isLoadingForm}
                    isLoadingLinks={isLoadingLinks}
                    setIsLoadingLinks={setIsLoadingLinks}
                    objectId={Number(objectId)}
                    classId={classId ? Number(classId) : classFromSelect}
                    onLinksChange={onChangeLinks}
                    linkFields={compState.linkFields}
                    errors={compState.errors}
                    setExtractedData={setExtractedData}
                    setIsObjectShow={setIsObjectShow}
                    isObjectShow={isObjectShow}
                    setObjShowStatus={setObjShowStatus}
                    objShowStatus={objShowStatus}
                    
                />
            )}
        </>
    )
}

export default ObjectFormContainer