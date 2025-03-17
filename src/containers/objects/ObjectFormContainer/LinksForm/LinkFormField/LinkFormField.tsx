import { Col, Row, Select, Space } from 'antd'
import { ButtonAddRow, ButtonDeleteRow } from '@shared/ui/buttons'
import { IObject } from '@shared/types/objects'

import { FC, ReactNode } from 'react'
import { UTILS } from '@shared/utils'

export const LinkFormField: FC<{
    linkFormFieldButtons: ReactNode | undefined
    objects: IObject[]
    value: any | null
    onChange: any
}> = ({ value = null, linkFormFieldButtons, objects = [], onChange }) => {
    const options: (typeof Select)['options'] = objects.map((object: IObject) => {
        const objectProps = UTILS.Objects.getObjectAttributeProps(object)

        return {
            value: object.id,
            label: objectProps.label,
            disabled: false,
        }
    })

    return (
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
            <Col span={8} style={{ display: 'flex' }}>
                <Select
                    style={{ width: '100%', marginRight: 20 }}
                    className="list-input"
                    allowClear={true}
                    popupMatchSelectWidth={false}
                    options={options}
                    value={value}
                    onChange={onChange}
                />
                {/*
                <Forms.Select
                    options={objects.map( (object: IObject) => {
                        const objectProps = getObjectAttributeProps(object)

                        return {
                            id: object.id,
                            label: objectProps.label
                        }
                    })}
                    style={{ width: '400px' }}
                    value={linkValue}
                    onChange={ (value) => {setLinkValue(value)} }
                />
                */}
            </Col>
            <Col span={5}>{linkFormFieldButtons}</Col>
        </Row>
    )
}

export const LinkFormFieldButtons = ({ linkField, relation, index, isLast, onAdd, onDelete }) => {
    return (
        <Space>
            {linkField.isDeletable && (
                <ButtonDeleteRow
                    onClick={() => {
                        onDelete(relation.id, index)
                    }}
                />
            )}
            {linkField.isNextAddable && isLast && (
                <ButtonAddRow
                    onClick={() => {
                        onAdd(relation.id, index)
                    }}
                />
            )}
        </Space>
    )
}