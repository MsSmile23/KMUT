import { SERVICES_CLASSES } from '@shared/api/Classes'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { findFieldIsImage, uploadImage } from '@shared/ui/ECUIKit/forms'
import { responseErrorHandler } from '@shared/utils/common'
import { getURL } from '@shared/utils/nav'
import { Modal } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'

interface ISaveProps {
    classId?: string | undefined
    values: any
    linkedOperations: number[]
    linkedAttributes: any[]
    setClassId: any
    navigate: any
    isContinue: boolean
    form: AnyObject
    forceUpdate: () => void
    forceUpdateAttrsStore: () => void
}

export const saveClass = async ({
    classId,
    values,
    linkedOperations,
    linkedAttributes,
    setClassId,
    navigate,
    isContinue,
    form,
    forceUpdate,
    forceUpdateAttrsStore,
}: ISaveProps) => {
    let newValues = values

    const valuesHasOwnIsImage = findFieldIsImage(values)

    if (valuesHasOwnIsImage) {
        newValues = await uploadImage(newValues, form.setFieldsValue)
    }

    // eslint-disable-next-line max-len
    const response: any = await SERVICES_CLASSES.Models.postClasses(
        newValues,
        classId ? parseInt(classId, 10) : undefined
    )

    if (response.success) {
        const linkedAttributesIds: { id: number; static_feature: string; initial_value: string; order: number }[] =
            linkedAttributes.map((attr) => {
                return {
                    id: attr?.id,
                    static_feature:
                        newValues[`attr_static_feature_${attr.id}`] !== null &&
                        newValues[`attr_static_feature_${attr.id}`] !== undefined
                            ? String(newValues[`attr_static_feature_${attr.id}`])
                            : '',
                    initial_value:
                        newValues[`attr_initial_value_${attr.id}`] !== null &&
                        newValues[`attr_initial_value_${attr.id}`] !== undefined
                            ? String(newValues[`attr_initial_value_${attr.id}`])
                            : '',
                    order: newValues[`attr_sort_order_${attr.id}`] == '' ? 99 : newValues[`attr_sort_order_${attr.id}`],
                }
            })
        const data: any = response?.data

        setClassId(data.id)  

        const payload: any = [{ class_id: data?.id, attributes: linkedAttributesIds }]


        const responseLinkClassAttrs: any = await SERVICES_CLASSES.Models.putClassAttributes(payload)

        const responseLinkClassOperations: any = await SERVICES_CLASSES.Models.putClassOperations([
            {
                class_id: parseInt(data?.id, 10),
                operations: linkedOperations,
            },
        ])

        if (responseLinkClassAttrs.success && responseLinkClassOperations.success) {
            Modal.success({
                content: `Класс успешно ${classId ? 'отредактирован' : 'создан'}`,
            })

            if (isContinue) {
                navigate(getURL(`${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                // navigate(`/${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`)
            }

            //*При создании и оставлении на страничке переводим на апдейт
            if (!classId && !isContinue) {
                navigate(getURL(`${ROUTES.CLASSES}/${ROUTES_COMMON.UPDATE}/${data.id}`, 'constructor'))
            }
            forceUpdateAttrsStore()
        }

        if (responseLinkClassAttrs.success == false) {
            responseErrorHandler({
                response: responseLinkClassAttrs,
                modal: Modal,
                errorText: 'Ошибка привязки атрибутов',
            })
        }

        if (responseLinkClassOperations.success == false) {
            responseErrorHandler({
                response: responseLinkClassOperations,
                modal: Modal,
                errorText: 'Ошибка привязки операций',
            })
        }

        forceUpdate()
    } else {
        responseErrorHandler({
            response: response,
            modal: Modal,
            errorText: `Ошибка при ${classId ? 'редактировании' : 'создании'} класса`,
        })
    }
}