import { IRelation, RelationWithDirect } from '@shared/types/relations'
import { Buttons, ButtonCreatable } from '@shared/ui/buttons'
import { UTILS } from '@shared/utils'
import { Row, Col, Space } from 'antd'
import { FC } from 'react'
import { IObject } from '@shared/types/objects'
import { getClassFromClassesStore } from '@shared/utils/common'

interface IRelationHeader {
    relation: RelationWithDirect, 
    objectId?: number,
    relationByIdCounts: any
    modalOpenHandler: (relation: IRelation, object_id?: IObject['id']) => void
    showModal: () => void
    setIsOpenModalAnonForm: (value: React.SetStateAction<boolean>) => void
    setClassIdForModal: (value: React.SetStateAction<number>) => void
    setChosenRelation: (value: React.SetStateAction<IRelation>) => void
    object?: IObject

}
const RelationHeader: FC<IRelationHeader> = ({
    relation,
    objectId, 
    relationByIdCounts, 
    modalOpenHandler,
    showModal,
    setIsOpenModalAnonForm,
    setClassIdForModal,
    setChosenRelation, object }) => {

    const getRelationProps = () => {
        let localRelationProps: any

        if (relation.relation_type == 'association') {
            localRelationProps = object?.class_id == relation.left_class_id 
                ? {
                    classId: relation.right_class_id,
                    multiplicity_left: relation.right_multiplicity_left,
                    multiplicity_right: relation.right_multiplicity_right ?? Infinity,
                    name: relation.name || getClassFromClassesStore(relation.right_class_id)?.name || relation.id,
                    dirType: 'left',
                    direction: relation.direction, 
                    className: getClassFromClassesStore(relation.right_class_id)?.name,
                    anonym: getClassFromClassesStore(relation.right_class_id)?.has_anonymous_objects,
                }
                : {
                    classId: relation.left_class_id,
                    multiplicity_left: relation.left_multiplicity_left,
                    multiplicity_right: relation.left_multiplicity_right ?? Infinity,
                    name: relation.name ||  getClassFromClassesStore(relation.left_class_id)?.name || relation.id,
                    dirType: 'right',
                    direction: relation.direction,
                    className: getClassFromClassesStore(relation.left_class_id)?.name,
                    anonym: getClassFromClassesStore(relation.left_class_id)?.has_anonymous_objects,
                }
        }
        else {
            localRelationProps = UTILS.Relations.getRelationProps(relation)
        }
        
        return localRelationProps
    }
    const relationProps = getRelationProps()

    return (
        <Row
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Col span={12} style={{ whiteSpace: 'pre-line' }}>
                {relationProps.name}
            </Col>
            <Col span={8}>
                Кратность от: {relationProps.multiplicity_left} до:
                {relationProps.multiplicity_right === Infinity ? '*' : relationProps.multiplicity_right}
            </Col>
            <Space>
                <Space>

                    <ButtonCreatable
                        onClick={() => modalOpenHandler(relation)}
                        disabled={!objectId ||
                                relationProps.multiplicity_right === relationByIdCounts['' + relation.id]}
                        color="green"
                        shape="circle"
                        text={false}
                        tooltipText={!objectId ? 'Для добавления связей сохраните объект' : 'Добавить'}
                        size="small"
                        entity="objects"
                        buttonAdd={true}
                    />
                    {/* <Buttons.ButtonAdd
                        onClick={() => modalOpenHandler(relation)}
                        disabled={!objectId ||
                            relationProps.multiplicity_right === relationByIdCounts['' + relation.id]}
                        color="green"
                        shape="circle"
                        text={false}
                        tooltipText={!objectId ? 'Для добавления связей сохраните объект' : 'Добавить'}
                        size="small"
                    /> */}
                    <Buttons.ButtonLink
                        onClick={showModal}
                        disabled={!objectId ||
                            relationProps.multiplicity_right === relationByIdCounts['' + relation.id]}
                        tooltipText={!objectId ? 'Для привязки связей сохраните объект' : 'Привязать'}
                    />
                    {relationProps.anonym && (
                        <Buttons.ButtonCreateAnonObjects
                            style={{
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            text={false}
                            tooltipText="Создать анонимные объекты"
                            onClick={() => {
                                setIsOpenModalAnonForm(true)
                                setClassIdForModal(relationProps.classId)
                                setChosenRelation(relation)
                            }}
                        />
                    )}
                </Space>
            </Space>
        </Row>
    )
}

export default RelationHeader