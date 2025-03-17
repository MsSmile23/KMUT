import { IRelation, IRelationsByTypeArrayItem, RelationWithDirect } from '@shared/types/relations'
import { Col, Collapse, Input, Modal } from 'antd'
import { FC, useEffect, useState } from 'react'
import RelationHeader from './RelationHeader'
import LinkFields from './LinkFields'
import { IObject } from '@shared/types/objects'
import { ILinkField } from '@shared/types/links'
import { LinksObjectModal } from '@features/links/LinkObjectsModal/LinkObjectsModal'
import { ObjectSelect } from './ObjectSelect'
import { DefaultModal2 } from '@shared/ui/modals'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { getRelationProps } from '@shared/utils/relations'
import { useOpen } from '@shared/hooks/useOpen'
import { ObjectModal } from '../ui/ObjectModal/ObjectModal'
import { ModalState } from './LinksRelationForm'
import { UTILS } from '@shared/utils'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'

interface IRelationContainer {
    relation: RelationWithDirect
    isOpenAllRelations: boolean
    objectId?: number
    relationByIdCounts: any

    linkFields: ILinkField[]
    toggleIsObjectShow: (
        linkFieldValue: number,
        classId: number | string,
        objectName: string,
        className: string
    ) => void

    onLinkUnbind: (linkFieldValue: number, linkFieldName: string) => void
    compState: {
        isLoading: boolean;
        relationsByType: IRelationsByTypeArrayItem[];
        objectsToRelation: Record<IRelation['id'], IObject[]>;
        errors: [{
            index: number;
            errors: {
                right_object_id: [string];
            };
        }];
    }
    onLinkAdd: (id: number, relation: IRelation, originRelation?: IRelation) => Promise<void>
    objects: IObject[]
    dataForObjectAddModal: IRelation[]
    onLinksChange: (linkFields: ILinkField[]) => void
    modalState: ModalState
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>
    onLinkUpdate: (object: any) => void
    editLinkTrue: boolean
    setEditLinkTrue: React.Dispatch<React.SetStateAction<boolean>>
    mainObjectClass?: number,
    currentObject?: IObject


}
const RelationContainer: FC<IRelationContainer> = ({
    relation,
    isOpenAllRelations,
    objectId,
    relationByIdCounts,
    linkFields,
    toggleIsObjectShow,
    onLinkUnbind,
    compState,
    onLinkAdd,
    objects,
    dataForObjectAddModal,
    onLinksChange,
    modalState,
    setModalState,
    onLinkUpdate,
    editLinkTrue,
    setEditLinkTrue,
    mainObjectClass,
    currentObject
    
}) => {
    const [activeKey, setActiveKey] = useState<string[]>([])
    const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false)
    const [isOpenModalAnonForm, setIsOpenModalAnonForm] = useState(false)
    const [objectsCount, setObjectsCount] = useState<number>(0)
    const [classIdForModal, setClassIdForModal] = useState<number>(0)
    const [chosenRelation, setChosenRelation] = useState<IRelation>(null)
    const modal = useOpen()
    // const object = objects.find(obj => obj.id == objectId) 

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const object = getObjectByIndex('id', objectId) || currentObject

    useEffect(() => {
        setActiveKey(isOpenAllRelations == true ? ['1'] : [])
    }, [isOpenAllRelations])

    const onChangeCollapse = (key) => {
        setActiveKey(key)
    }

    const modalOpenHandler = (relation: IRelation, object_id?: IObject['id']): void => {

        const relationProps = UTILS.Relations.getRelationProps(relation)

        setModalState({ 
            id: relation.id,
            relation,
            object_id,
            className: relationProps.className ?? relationProps.name,
            objectName: ''
        })
        modal.open()
    }

    const modalOpenHandlerEditLink = (
        relation: IRelation, 
        object_id?: IObject['id'],
        object_name?: IObject['name']): void => {
        setEditLinkTrue(true)
        const relationProps = UTILS.Relations.getRelationProps(relation)

        setModalState({ id: relation.id, relation, object_id, className: relationProps.name, objectName: object_name })
        modal.open()
    }

    const onManyLinkAdd = async (links: any[]) => {

        const localLinkFields = [...linkFields]
        let orderCount = localLinkFields?.length

        await Promise.all(links.map(async link => {
            const relationProps = getRelationProps(chosenRelation)
            const num = linkFields.filter((item) => item.relation_id === chosenRelation.id).length
            const obj = await SERVICES_OBJECTS.Models.getObjectById(link.id)
            const output: ILinkField = {
                id: 0,
                value: link.id,
                name: `${chosenRelation.id}_${num}`,
                relation_id: chosenRelation.id,
                relation: chosenRelation,
                isDeletable: !(num <= relationProps.multiplicity_left),
                isNextAddable: num < relationProps.multiplicity_right,
                isRequired: num <= relationProps.multiplicity_left,
                num: num,
                object: obj ?? null,
                originRelation: chosenRelation.original ?? null,
                order: orderCount + 1
            }
            
            localLinkFields.push(output)
            orderCount++
        }))
        onLinksChange(localLinkFields)
    }

    const createLinks = async (objectIds: number[]) => {

        const localLinkFields = [...linkFields]

        await Promise.all(objectIds.map(async id => {

            let obj = getObjectByIndex('id', id)

            //*При добавлении связи страхуемся на наличие объекта в случае, если вдруг в сторе нет 
            if (!obj) {
                const localObj = await SERVICES_OBJECTS.Models.getObjectById(id)

                obj = localObj?.data
            }

            // const rightClassId = objects.find((item) => item.id == id)?.class_id
            const rightClassId = obj?.class_id
            const realRelation = 

            dataForObjectAddModal.filter(item => item.left_class_id == rightClassId 
                || item.right_class_id == rightClassId )
                .find(item2 => item2.original_id == relation?.id)
                ?? relation

            const relationProps = getRelationProps(realRelation)
            const num = linkFields.filter((item) => item.relation_id === realRelation.id).length
            // const obj = await SERVICES_OBJECTS.Models.getObjectById(id)
      

            const output: ILinkField = {
                id: 0,
                value: id,
                name: `${realRelation.id}_${num}`,
                relation_id: realRelation.id,
                relation: realRelation,
                isDeletable: !(num <= relationProps.multiplicity_left),
                isNextAddable: num < relationProps.multiplicity_right,
                isRequired: num <= relationProps.multiplicity_left,
                num: num,
                object: obj ? { data: obj } : null,
                originRelation: relation ?? null,
                classId: obj?.class_id,
                order: localLinkFields?.length + 1

            }
            
            localLinkFields.push(output)
        }))

        onLinksChange(localLinkFields)
        setActiveKey(['1'])
        setIsLinkModalOpen(false)
    }
    const createManyObjectsHandler =   () => {
        SERVICES_OBJECTS.Models.createManyObjects({ class_id: classIdForModal, count: objectsCount })
            .then( async resp => {

                if (resp.success) {

                    if (resp.data !== undefined) {
                        await  onManyLinkAdd(resp.data)
                        setChosenRelation(null)
                        setClassIdForModal(0)
                        setActiveKey(['1'])
                        setIsOpenModalAnonForm(false)
                        Modal.success({
                            content: 'Связи успешно созданы',
                        })
                    
                    }
                }
                else {
                    Modal.warning({
                        content: `Ошибка в создании связей: ${resp.error}`,
                    })
                }
            })
    }

    return (
        <Col span={12}>  
            <Collapse
                activeKey={activeKey}
                collapsible="icon"
                onChange={onChangeCollapse}
                items={[
                    {
                        key: '1',
                        label: (
                            <RelationHeader
                                object={object}
                                relation={relation}
                                objectId={objectId}
                                relationByIdCounts={relationByIdCounts}
                                modalOpenHandler={modalOpenHandler}
                                showModal={() => {
                                    setIsLinkModalOpen(true)
                                }}
                                setIsOpenModalAnonForm={setIsOpenModalAnonForm}
                                setClassIdForModal={setClassIdForModal}
                                setChosenRelation={setChosenRelation}
                            />
                        ),
                        children: (
                            <LinkFields
                                onLinksChange={onLinksChange}
                                relation={relation}
                                linkFields={linkFields}
                                toggleIsObjectShow={toggleIsObjectShow}
                                modalOpenHandlerEditLink={modalOpenHandlerEditLink}
                                onLinkUnbind={onLinkUnbind}
                            />
                        ),
                    },
                ]}
            />
            <LinksObjectModal
                isModalVisible={isLinkModalOpen}
                onCancel={() => {
                    setIsLinkModalOpen(false)
                }}
                title="Выберите объект"
                key="linksObjectModalKey"
                onOk={() => {setActiveKey(['1'])}}
            >
                <ObjectSelect
                    dataForObjectModal = {dataForObjectAddModal}
                    linkFields={linkFields}
                    relation={relation}
                    objectId={objectId}
                    allObjects={compState.objectsToRelation}
                    objectsForSelect={objects}
                    /*показываем только не отображенные в линкфилд объекты*/
                    objects={
                        compState.objectsToRelation[relation.id].filter(
                            (item) =>
                                !linkFields.some(
                                    (linkfield) => linkfield.value === item.id && relation.id === linkfield.relation_id
                                )
                        ) ?? []
                    }
                    handleCancel={() => {
                        setIsLinkModalOpen(false)
                    }}
                    onSubmit={(objectIds) => {
                        createLinks(objectIds)
                    }}
                    classId = {mainObjectClass}
                    currentObject = {currentObject}
                />
            </LinksObjectModal>

            <DefaultModal2 
                onCancel={() => {setIsOpenModalAnonForm(false)}}
                open={isOpenModalAnonForm}
                tooltipText="Создание объектов"
                onOk={createManyObjectsHandler}
            >
                <Input
                    type="number" 
                    min={0}
                    onChange={(e) => {
                        setObjectsCount(Number(e.target.value))
                    }} 
                />

            </DefaultModal2>

            <ObjectModal
                mainObjectClass = {mainObjectClass}
                dataForObjectAddModal={dataForObjectAddModal}
                modal={modal}
                relation={modalState?.relation}
                id={modalState?.object_id}
                onLinkAdd={onLinkAdd}
                key="objectModalKey"
                editLinkTrue={editLinkTrue}
                setEditLinkTrue={setEditLinkTrue}
                className={modalState?.className}
                objectName={modalState?.objectName}
                setModalState={setModalState}
                onLinkUpdate={onLinkUpdate}
                setActiveKey={setActiveKey}
            />
        </Col>
    )
}

export default RelationContainer