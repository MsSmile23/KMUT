import { ILinkField } from '@shared/types/links'
import { IRelation, RelationWithDirect } from '@shared/types/relations'
import { Buttons } from '@shared/ui/buttons'
import { getObjectProps } from '@shared/utils/objects'
import { Col, Card, Space } from 'antd'
import { FC } from 'react'
import Paragraph from 'antd/es/typography/Paragraph'
import { IObject } from '@shared/types/objects'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { SortableList } from '@shared/ui/SortableList'

interface ILinkFields {
    onLinksChange: (linkFields: ILinkField[]) => void
    relation: RelationWithDirect
    linkFields: ILinkField[]
    toggleIsObjectShow: (
        linkFieldValue: number,
        classId: number | string,
        objectName: string,
        className: string
    ) => void
    modalOpenHandlerEditLink: (relation: IRelation, object_id?: IObject['id'], object_name?: IObject['name']) => void
    onLinkUnbind: (linkFieldValue: number, linkFieldName: string, linkId?: number) => void
}
const LinkFields: FC<ILinkFields> = ({
    relation,
    linkFields,
    toggleIsObjectShow,
    modalOpenHandlerEditLink,
    onLinkUnbind,
    onLinksChange
}) => {

    const getByIndex = useObjectsStore(selectObjectByIndex)

    const onChange = (array?: any) => {
        //*Сортируем массив нужных линков
        const sortedLinkFields = array.map((item, index) => {
            return { ...item, order: index + 1 }
        })

        //*Перебираем общие линки, чтобы заменить сортировку на новую

        const localLinkFields = [...linkFields]

        localLinkFields.forEach((link) => {
            const newItem = sortedLinkFields.find((item) => item.id == link.id)

            if (newItem) {
                link.order = newItem.order
            }
        })
        onLinksChange(localLinkFields)
    }

    return linkFields.length > 0 ? (
        <>
            <SortableList
                listStyle={{ gap: 0, margin: 0,  }}
                items={linkFields
                    .filter(
                        (linkField) =>
                            (linkField.relation_id == relation.id
                                || linkField?.originRelation?.id == relation?.id 
                                || linkField.relation.original_id == relation?.id ) &&
                        linkField.relation.relation_type !== 'dependency'
                    )
                    // .filter(linkField => getByIndex('id', linkField?.value) !== undefined)
                    .sort((a, b) => a.order - b.order)}               
                onChange={onChange}
                renderItem={(linkField) => (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>
                        <SortableList.Item
                            id={linkField.id}
                            customItemStyle={{ padding: 0, borderRadius: '8px', boxShadow: 'none' }}
                        >
                            <SortableList.DragHandle
                                customDragHandlerStyle={{
                                    width: '5%',
                                    padding: '15px 10px',
                                    alignSelf: 'baseline',
                                    marginTop: '5px',
                                }}
                            />
                            <Col key={linkField.id} style={{ width: '95%' }}>
                                <Card type="inner" style={{ marginTop: '5px' }} bodyStyle={{ padding: '7px 24px' }}>
                                    <Col
                                        style={{
                                            display: 'flex',
                                            minHeight: '10px',
                                        }}
                                    >
                                        <Col
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                width: '100%',
                                                alignItems: 'center',
                                            }}
                                        > 
                                            {`${linkField.object.data.id} 
                                            ${getObjectProps(linkField.object.data).name}`}
                                        </Col>

                                        <Col style={{ display: 'flex', justifyContent: 'flex-end', width: '20%' }}>
                                            <Space>
                                                {linkField.errors && (
                                                    <Col style={{ marginRight: 50 }}>
                                                        <Buttons.ButtonWarn
                                                            title={
                                                                linkField?.errors?.errors?.right_object_id
                                                                    ? `${linkField?.errors?.errors?.right_object_id[0]}`
                                                                    : linkField?.errors?.errors
                                                                        ? `${linkField?.errors?.errors}`
                                                                        : ''
                                                            }
                                                        />
                                                    </Col>
                                                )}
                                                <Buttons.ButtonLook
                                                    onClick={() =>
                                                        toggleIsObjectShow(
                                                            linkField.value,
                                                            linkField.object.data?.class_id,
                                                            linkField.object.data.name,
                                                            linkField.object.data.class.name
                                                        )}
                                                />
                                                <Buttons.ButtonEditRow
                                                    dir="#3465fd"
                                                    onClick={() => {
                                                        modalOpenHandlerEditLink(
                                                            relation,
                                                            linkField.object.data.id,
                                                            linkField.object.data.name
                                                        )
                                                    }}
                                                />
                                                <Buttons.ButtonUnlink
                                                    onClick={() => {
                                                        onLinkUnbind(linkField.value, linkField.name, linkField?.id)
                                                    }}
                                                        
                                                />
                                            </Space>
                                        </Col>
                                    </Col>
                                </Card>
                            </Col>

                        </SortableList.Item>
                        
                    </>
                )}
            />
            {/* {
            
                linkFields
                    .filter(
                        (linkField) =>
                            (linkField.relation_id == relation.id
                                || linkField?.originRelation?.id == relation?.id 
                                || linkField.relation.original_id == relation?.id ) &&
                        linkField.relation.relation_type !== 'dependency'
                    )
                    .filter(linkField => getByIndex('id', linkField?.value) !== undefined)
                    .map((linkField) => {
                        
                        return (
                            <Col key={linkField.id}>
                                <Card type="inner" style={{ marginTop: '5px' }}>
                                    <Col
                                        style={{
                                            display: 'flex',
                                            height: '10px',
                                        }}
                                    >
                                        <Col
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                width: '80%',
                                                alignItems: 'center',
                                            }}
                                        > 
                                            {`${linkField.object.data.id} 
                                            ${getObjectProps(linkField.object.data).name}`}
                                        </Col>

                                        <Col style={{ display: 'flex', justifyContent: 'flex-end', width: '20%' }}>
                                            <Space>
                                                {linkField.errors && (
                                                    <Col style={{ marginRight: 50 }}>
                                                        <Buttons.ButtonWarn
                                                            title={
                                                                linkField?.errors?.errors?.right_object_id
                                                                    ? `${linkField?.errors?.errors?.right_object_id[0]}`
                                                                    : linkField?.errors?.errors
                                                                        ? `${linkField?.errors?.errors}`
                                                                        : ''
                                                            }
                                                        />
                                                    </Col>
                                                )}
                                                <Buttons.ButtonLook
                                                    onClick={() =>
                                                        toggleIsObjectShow(
                                                            linkField.value,
                                                            linkField.object.data?.class_id,
                                                            linkField.object.data.name,
                                                            linkField.object.data.class.name
                                                        )}
                                                />
                                                <Buttons.ButtonEditRow
                                                    dir="#3465fd"
                                                    onClick={() => {
                                                        modalOpenHandlerEditLink(
                                                            relation,
                                                            linkField.object.data.id,
                                                            linkField.object.data.name
                                                        )
                                                    }}
                                                />
                                                <Buttons.ButtonUnlink
                                                    onClick={() => {
                                                        onLinkUnbind(linkField.value, linkField.name, linkField?.id)
                                                    }}
                                                        
                                                />
                                            </Space>
                                        </Col>
                                    </Col>
                                </Card>
                            </Col>
                        )
                    })
            } */}
        </>
    ) : (
        <Paragraph style={{ textAlign: 'center' }}>У объекта нет связи по этому отношению</Paragraph>
    )
}

export default LinkFields