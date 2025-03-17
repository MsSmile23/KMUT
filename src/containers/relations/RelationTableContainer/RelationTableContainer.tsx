import { useOpen } from '@shared/hooks/useOpen'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { Col, Divider, Form, Popconfirm, Row, Space } from 'antd'
import { CSSProperties, FC, useEffect, useState } from 'react'
import RelationFormContainer from '../RelationFormContainer/RelationFormContainer'
import { relationsColumns, relationsPayload, relationsTranslation } from './relationsTableData'
import { deleteRelationById } from '@shared/api/Relations/Models/deleteRelationById/deleteRelationById'
import { getRelations } from '@shared/api/Relations/Models/getRelations/getRelations'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useApi2 } from '@shared/hooks/useApi2';
import { getRelationsForClassForm } from '@shared/utils/classes'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { getURL } from '@shared/utils/nav'
import { getClassFromClassesStore } from '@shared/utils/common'


const columns = [ ...relationsColumns ]

const RelationTableContainer: FC<{
    style?: CSSProperties,
    classId?: number,
    isModal?: boolean
    height?: number
}> = ({
    style,
    classId,
    isModal,
    height
}) => {
    const modal = useOpen()
    const open = modal.open
    const navigate = useNavigate()
    const [editedId, setEditedId] = useState(0)

    const relations = useApi2(getRelations, {
        state: [],
        payload: relationsPayload
    })

    const relationsToRender = getRelationsForClassForm(relations?.data, classId)

    const rows: any[] = [...relationsToRender].sort((a, b) => b.id - a.id)
        .map((relation, i) => {
            const lmplr = relation.left_multiplicity_right
            const rmplr = relation.right_multiplicity_right

            return {
                id: relation.id,
                key: `relation-${i}`,
                relType: relationsTranslation?.[relation.relation_type],
                relTypeFilterKey: relation.relation_type,
                source: getClassFromClassesStore(relation.left_class_id)?.name,
                sourceQual: relation.left_attribute?.name,
                sourceMult: `${relation.left_multiplicity_left ?? '-'}
                  / ${[null, 0].includes(lmplr) ? '*' : lmplr ?? '-'}`,
                aim: getClassFromClassesStore(relation.right_class_id)?.name,
                aimQual: relation.right_attribute?.name,
                aimMult: `${relation.right_multiplicity_left ?? '-'}
                  / ${[null, 0].includes(rmplr) ? '*' : rmplr ?? '-'}`,
                assClass: relation.assoc_class?.name,
                stereoType: relation?.relation_stereotype?.name,
                name: relation.name,
                actions: (
                    <Space>

                        <ButtonEditRow
                            onClick={() => {
                                isModal == true 
                                    ? setEditedId(relation.id) 
                                    : navigate(getURL(
                                        `${ROUTES.RELATIONS}/${ROUTES_COMMON.UPDATE}/${relation.id}`, 
                                        'constructor'
                                    ))}}
                            // : navigate(`/${ROUTES.RELATIONS}/${ROUTES_COMMON.UPDATE}/${relation.id}`)}}
                        />
                        <Popconfirm
                            title="Удаление"
                            description={`Удалить ${relation.name}?`}
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => {
                                deleteRelationById(`${relation.id}`).then(() => {
                                    relations.request(relationsPayload).then()
                                })
                            }}
                        >
                            <ButtonDeleteRow />
                        </Popconfirm>
                    </Space>
                ),
            }
        })
        .map((el) => Object.fromEntries(Object.entries(el).map(([k, v]) => [k, v || '-'])))
        .sort()


    const [form] = Form.useForm()

    useEffect(() => {
        if (!editedId) {
            return
        }

        open()
    }, [editedId, open])

    return (
        <>
            <EditTable
                tableId="relationsTable" 
                style={style}
                rows={rows}
                columns={columns as any[]}
                loading={relations.loading}
                buttons={{
                    left: [
                        <ButtonAdd
                            key="button-edit-relation-table"
                            shape="circle"
                            text={false}
                            onClick={() => { 
                                isModal 
                                    ? modal.open() 
                                    : navigate(getURL(
                                        `${ROUTES.RELATIONS}/${ROUTES_COMMON.CREATE}`, 
                                        'constructor'
                                    ))}}
                            // : navigate(`/${ROUTES.RELATIONS}/${ROUTES_COMMON.CREATE}`)}}
                        />
                    ]
                }}
                scroll={{ y: height }}
                pagination={height ? { position: ['bottomRight'], pageSize: 15  } : false}
            />

            <DefaultModal2
                open={modal.isOpen}
                onCancel={() => {
                    modal.close()
                    relations.request(relationsPayload).then()
                    setEditedId(0)
                }}
                title={editedId ? 'Редактирование связи' : 'Новая связь'}
                footer={null}
            >
                <Row gutter={[0, 12]}>
                    <Col xs={24}>
                        <Divider style={{ margin: 0 }} />
                    </Col>
                    <Col xs={24}>
                        <RelationFormContainer
                            form={form}
                            id={editedId}
                            classId={classId}
                            modal={isModal ? modal : undefined}
                            relations={relations}
                        />
                    </Col>
                </Row>
            </DefaultModal2>
        </>
    )
}

export default RelationTableContainer