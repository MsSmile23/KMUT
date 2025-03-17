import { FC, useEffect, useMemo, useState } from 'react'
import { Button, Col, Row, Typography } from 'antd'
import { TOAttrFieldProps, TOAttrForForm } from '@features/object-attributes/OAttrForm/types'
import { ButtonDeleteRow, Buttons } from '@shared/ui/buttons'
import { ECPopover } from '@shared/ui/ECUIKit/common'
import { QuestionOutlined, WarningOutlined } from '@ant-design/icons'
import { ECTooltip } from '@shared/ui/tooltips'

const baseSpan = 12
const compSettings = {
    labelRows: 3,
}

const OAttrFieldWrapper: FC<{
    attributeObject: TOAttrForForm
    attributeField: TOAttrFieldProps
    addAttributeForm: (id: TOAttrForForm['id']) => void
    deleteAttributeForm: (id: TOAttrForForm['id'], oAId: TOAttrFieldProps['id']) => void
    showHint: (attributeField: TOAttrFieldProps) => void
    attrsForRender?: any[]
    setAttrsForRender?: any
    children?: any
    form?: any
    withoutButtons?: boolean
}> = ({
    attributeObject,
    attributeField,
    addAttributeForm,
    deleteAttributeForm,
    showHint,
    children,
    attrsForRender,
    setAttrsForRender,
    form,
    withoutButtons
}) => {
    const colScheme = attributeObject.data_type.inner_type == 'boolean' ? [14, 6, 4] : [6, 14, 4]

    const deleteHandler = () => {
        const attrId = attributeObject?.id
        //* В случае удаление атрибута, находим его в в fields и меняем название,
        //* убирая id-шник, на который будем ориентироваться при отправлении на бек
        const updatedArray = attrsForRender?.map((attr) => {
            if (attr.id == attrId) {
                return {
                    ...attr,
                    fields: attr.fields.map((attrField) => {
                        if (attrField.id == attributeField.id) {
                            //*Для очищения поля от значений
                            form.setFieldValue([attrField.name.split('_')[0]], null)

                            return {
                                ...attrField,
                                name: attrField.name.split('_')[0],
                                id: null,
                            }
                        } else {
                            return attrField
                        }
                    }),
                }
            } else {
                return { ...attr }
            }
        })

        setAttrsForRender(updatedArray)
    }

    const isDeletable = useMemo(() => {



        if (attributeObject.multiplicity_left == 0 && attributeField?.id !== null && attributeField?.isLast) {
            return false
        }

        return true
    }, [attributeField, attributeObject])

    return (
        <>
            <Row align="middle">
                <Col span={colScheme[0]} style={{ alignSelf: 'center' }}>
                    <Typography.Paragraph
                        title={attributeObject.name}
                        style={{ marginBottom: '0px' }}
                        ellipsis={{ rows: compSettings.labelRows }}
                        strong={true}
                    >
                        {attributeObject.name}
                        {/* {attributeField?.deleted &&
                        <ECTooltip title="Внимание! Данные этого атрибута не будут направлены на сервер">
                            <WarningOutlined style={{ color: 'darkorange', marginLeft: '5px' }} />
                        </ECTooltip>} */}
                    </Typography.Paragraph>
                </Col>
                <Col span={colScheme[1]} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>              
                    {!attributeField.id && !form.getFieldValue(attributeField?.name) && !withoutButtons && (
                        // eslint-disable-next-line max-len
                        <ECTooltip title="Внимание! В случае, если поле не будет заполнено, данные этого атрибута не будут направлены на сервер">
                            <WarningOutlined style={{ color: 'darkorange' }} />
                        </ECTooltip>
                    )}
                    {attributeObject.settings.cols == 1 && children}
                </Col>
                <Col span={colScheme[2]} style={{ paddingRight: '10px', alignSelf: 'center' }}>
                    {attributeField.inner_type !== 'boolean' && (
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        <>{!withoutButtons &&
                        <Row gutter={2} justify="end">
                            <Col>
                                <Buttons.ButtonAdd
                                    size="small"
                                    shape="circle"
                                    text={false}
                                    onClick={() => {
                                        addAttributeForm(attributeObject.id)
                                    }}
                                    disabled={!attributeField.isNextAddable}
                                />
                            </Col>
                            <Col>
                                <ButtonDeleteRow
                                    withConfirm
                                    size="small"
                                    shape="circle"
                                    // onClick={() => {deleteAttributeForm(attributeObject.id, attributeField.id)}}
                                    // disabled={!attributeField.isDeletable }
                                    disabled={isDeletable}
                                    onClick={() => {
                                        deleteHandler()
                                    }}
                                />
                            </Col>
                            <Col>
                                <ECPopover
                                    content={
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: attributeField?.description ?? showHint(attributeField),
                                            }}
                                        />
                                    }
                                >
                                    <Button size="small" shape="circle" style={{ marginLeft: 0 }}>
                                        {/* //?убрал пропсы из-за ворнингов в консоли
                                        // onPointerEnterCapture={undefined}
                                        // onPointerLeaveCapture={undefined} */}
                                        <QuestionOutlined />
                                    </Button>
                                </ECPopover>
                            </Col>
                        </Row>}
                        </>
                    )}
                </Col>
            </Row>
            {attributeObject.settings.cols > 1 && (
                <Row>
                    <Col span={24}>{children}</Col>
                </Row>
            )}
        </>
    )
}

export default OAttrFieldWrapper