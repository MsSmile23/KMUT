/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */

import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { deleteObjectById } from '@shared/api/Objects/Models/deleteObjectById/deleteObjectById'
import { useOpen } from '@shared/hooks/useOpen'
import { IClass } from '@shared/types/classes'
import { ILink, ILinkField } from '@shared/types/links'
import { IObject } from '@shared/types/objects'
import { IRelation, IRelationsByTypeArrayItem, RelationWithDirect, relationsTypes } from '@shared/types/relations'
import { UTILS } from '@shared/utils'
import { getObjectLinks } from '@shared/utils/objects'
import { getRelationProps, getRelationsForObjectForm } from '@shared/utils/relations'
import { Card, Col, Collapse, Input, Row, message } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { objectsStore, selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { Select, Switch } from '@shared/ui/forms'
import RelationContainer from './RelationContainer'
import { Typography } from 'antd';
import { ENTITY } from '@shared/config/entities'
import { API } from '@shared/lib/ApiSPA'

import ObjectLinksTree from '@entities/objects/ObjectLinksTree/ObjectLinksTree'
import { useGetObjects } from '@shared/hooks/useGetObjects'


const { Text } = Typography;


export interface ModalState {
    id: undefined | number
    relation: IRelation
    object_id: IObject['id']
    className: string | number
    objectName: string | number
}

const relationTypesData =   [ {
    value: 'association',
    label: 'Ассоциация',
},
{
    value: 'aggregation',
    label: 'Агрегация',
},
{
    value: 'composition',
    label: 'Композиция',
},
{
    value: 'generalization',
    label: 'Генерализация',
},
{
    value: 'dependency',
    label: 'Зависимость',
},
]

const LinksRelationForm: FC<{
    objectId: IObject['id']
    classId: IClass['id']
    onLinksChange: (linkFields: ILinkField[]) => void
    linkFields: ILinkField[]
    errors: [{index: number, errors: {right_object_id: [string]}}]
    setExtractedData: React.Dispatch<React.SetStateAction<any>>;
    setIsObjectShow: React.Dispatch<React.SetStateAction<any>>;
    isObjectShow: any;
    setObjShowStatus: any;
    objShowStatus: any
    setIsLoadingLinks: any
    isLoadingLinks: boolean
    isLoadingForm: boolean
    isLoadingAttrs: boolean
    setUnresolvedObjectLinks?: React.Dispatch<React.SetStateAction<ILink[]>>
    currentObject?: IObject


}> = ({ objectId, classId, onLinksChange, linkFields, errors, setExtractedData,
    setIsObjectShow, setObjShowStatus, objShowStatus, isObjectShow, setIsLoadingLinks, isLoadingLinks, isLoadingForm,
    isLoadingAttrs, setUnresolvedObjectLinks, currentObject }) => {
    const [compState, setCompState] = useState<{
        isLoading: boolean
        relationsByType: IRelationsByTypeArrayItem[]
        objectsToRelation: Record<IRelation['id'], IObject[]>
        errors: [{index: number, errors: {right_object_id: [string]}}]
    }>({
        isLoading: true,
        relationsByType: [
            { type: relationsTypes.association, relations: [] },
            { type: relationsTypes.aggregation, relations: [] },
            { type: relationsTypes.composition, relations: [] },
            { type: relationsTypes.generalization, relations: [] },
            { type: relationsTypes.dependency, relations: [] },
        ],
        objectsToRelation: {},
        errors: [{ index: null, errors: { right_object_id: [''] } }]
    })

    const modal = useOpen()



    const [modalState, setModalState] = useState<ModalState>({
        id: undefined,
        relation: null,
        object_id: undefined,
        className: null,
        objectName: null,
    })


    const relations = useRelationsStore(selectRelations)
    const objects = useGetObjects()
    const [relationByIdCounts, setRelationByIdCounts] = useState(null)
    const [linkFieldValue, setLinkFieldValue] = useState<number>(null)
    const [editLinkTrue, setEditLinkTrue] = useState(false)
    const [dataForObjectAddModal, setDataForObjectAddModal] = useState<IRelation[]>([])
    const [allRelations, setAllRelations] = useState<RelationWithDirect[]>([])
    const [isOpenUpRelations, setIsOpenUpRelations] = useState<boolean>(false)
    const [isOpenDownRelations, setIsOpenDownRelations] = useState<boolean>(false)
    const [isOpenHorizontalRelations, setIsOpenHorizontalRelations] = useState<boolean>(false)
    const [chosenRelationsTypes, setChosenRelationsTypes] = useState<string[]>([])
    const [relationsForRender, setRelationsForRender] = useState<RelationWithDirect[]>([])
    const [relationsNameFilter, setRelationsNameFilter] = useState<string>('')
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    // const object = getObjectByIndex('id', objectId)



    // useEffect(() => {console.log('Линки', linkFields, objects)}, [linkFields])
    const [activeKeyUp, setActiveKeyUp] = useState<string[]>([])
    const [activeKeyDown, setActiveKeyDown] = useState<string[]>([])
    const [activeKeyHorizontal, setActiveKeyHorizontal] = useState<string[]>([])

    const onChangeCollapseUp = (key) => {  
        setActiveKeyUp(key)
    }

    const onChangeCollapseDown = (key) => {
        setActiveKeyDown(key)
    }
    const onChangeCollapseHorizontal = (key) => {
        setActiveKeyHorizontal(key)
    }
    const onLinkAdd = async (id: number, relation: IRelation, originRelation?: IRelation) => {
        if (!id) {
            return
        }
        const relationProps = getRelationProps(relation, classId)
        const num = linkFields.filter((item) => item.relation_id === relation.id).length
        const obj = await SERVICES_OBJECTS.Models.getObjectById(id)
        // const obj2 = getObjectByIndex('id', id)
        const output: ILinkField = {
            id: 0,
            value: id,
            name: `${relation.id}_${num}`,
            relation_id: relation.id,
            relation: relation,
            isDeletable: !(num <= relationProps.multiplicity_left),
            isNextAddable: num < relationProps.multiplicity_right,
            isRequired: num <= relationProps.multiplicity_left,
            num: num,
            object: obj ?? null,
            originRelation: originRelation,
            classId: obj?.data?.class_id,
            order: linkFields.length + 1
        }

        onLinksChange([...linkFields, ...[output]])
    }

    const onLinkUpdate = (object) => {
        const localLinkFields = [...linkFields]

        const updatedLinkFields = localLinkFields.map((item) => {
            if (item.value == object.id) {
                return {
                    ...item,
                    object: {
                        ...item.object,
                        data: {
                            ...item.object.data,
                            name: object.name,
                        },
                    },
                }
            } else {
                return item
            }
        })

        onLinksChange(updatedLinkFields)
    }

    const onLinkUnbind = (linkFieldValue: number, linkFieldName: string, linkId?: number) => {

        const filteredLinkFields = linkFields.filter((link) => (linkId !== link.id))

        onLinksChange([...filteredLinkFields])
    }

    const onObjectDelete = async (linkFieldObject: any) => {

        const object_id: number = linkFieldObject.data.id

        // const payload: {
        //     object_id: number;
        //     links: ILink[];
        //   } = { object_id, links: [] };

        // const filteredLinkFields = linkFields.filter((link) => link.object.data.id !== object_id)


        try {
            // await SERVICES_LINKS.Models.postLinksSyncObjects(payload)

            const response = await deleteObjectById(object_id)

            if (response.success && response.data.statusText === 'Deleted') {
                onLinksChange([...linkFields.filter((link) => link.value !== object_id)])
            } else {
                throw Error
            }
        } catch {
            message.error('Не удалось удалить объект')
        } finally {
            // setTableLoading(false)
        }
    }


    const getData = async () => {
        const relationsByTypes = await  getRelationsForObjectForm(classId, true, relations)

        // const relationsByTypes = await SERVICES_RELATIONS.Services.getRelationsByClassGroupByType({ classId })
        // const object1 = getObjectByIndex('id', objectId)
        const object = currentObject

        const objectLinks: ILink[] = getObjectLinks(object).map(obj => {return ({ ...obj, objectId: objectId })})


       
        //*Создаем массивы с айдишниками объектов, что нет в сторе, и с айди ллинков, связанных с этим объектами
        const linksWithoutObjectsInStoreIds: number[] = []
        let objectsNotInStore: IObject[] = []
        let finedObjectsIds: number[] = []

        //*Ищем объекты, недоступные пользователю и сохраняем для дальнейшей отправки на бек
        let objectLinksForbiddenObjects = objectLinks.filter(
            (link) =>
                getObjectByIndex(
                    'id',
                    link.objectId == link.right_object_id ? link.left_object_id : link.right_object_id
                ) == undefined)

        if (objectLinksForbiddenObjects?.length > 0) {

            //*Собираем айдишники объектов, которые попросим у бэка

            // console.log('forbiden', objectLinksForbiddenObjects)

            objectLinksForbiddenObjects.forEach(link => {
                linksWithoutObjectsInStoreIds.push(link.objectId == link.right_object_id ? link.left_object_id : link.right_object_id)
            })

            //*Получаем объекты по тем айди, у которых есть связь, но их нет в сторе
            if (linksWithoutObjectsInStoreIds?.length > 0) {

                const objectsFromBack = await API.apiGetAsArray<IObject[]>({
                    endpoint: {
                        method: 'GET',
                        url: ENTITY.OBJECT.API_ROUTE + `?filter[id]=${linksWithoutObjectsInStoreIds.join(',')}`
                    },
                    payload: ''
                })

                if (objectsFromBack?.success) {
                    if (objectsFromBack?.data) {
                        objectsNotInStore = objectsFromBack?.data
                        finedObjectsIds = objectsFromBack?.data.map(item => item.id)
                        

                        //*Фильтруем связи с запрещенными объектами, чтобы не отправить лишнего или дублирущего
                        objectLinksForbiddenObjects = objectLinksForbiddenObjects.filter(link => finedObjectsIds.includes(link?.left_object_id) == false && finedObjectsIds.includes(link?.right_object_id))
                    }

                }

            }
        }
        let linkFields: ILinkField[] = []
        const objectsToRelation: Record<IRelation['id'], IObject[]> = {}
        const relationIDs = []
        const relationTypes = relationsByTypes?.relationTypes ?? []

        if (relationsByTypes?.relationTypes !== undefined) {
            for (const relationType of relationTypes) {

                await Promise.all(
                    relationType.relations.map(async (relation) => {

                        relationIDs.push(relation.id)
                        const relationProps = UTILS.Relations.getRelationProps(relation, classId)

                        objectsToRelation[relation.id] = objects.filter(
                            (object) => object?.class_id === relationProps.classId
                        )

                        const objectLinksWithoutForbiddenObjects = objectLinks.filter(
                            (link) =>
                                getObjectByIndex(
                                    'id',
                                    link.objectId == link.right_object_id ? link.left_object_id : link.right_object_id
                                ) !== undefined
                        )

                    

                        const relationLinks = objectLinks.filter((link) => link.relation_id === relation.id)
                        const linksFields = await UTILS.Relations.getLinksFields(relation, relationLinks, getObjectByIndex, objectsNotInStore)

                        linkFields = [...linkFields, ...linksFields]
                    })
                )
            }
        }

        if (relationsByTypes?.virtualRelations !== undefined) {

            await Promise.all(
                relationsByTypes.virtualRelations.map( async relation => {

                    relationIDs.push(relation.id)
                    const relationProps = UTILS.Relations.getRelationProps(relation, classId)

                    objectsToRelation[relation.original.id] 
                    = [...objectsToRelation[relation.original.id], ...([...objects].filter(
                            (object) => object?.class_id === relationProps.classId
                        ))]

                    const objectLinksWithoutForbiddenObjects = objectLinks.filter(
                        (link) =>
                            getObjectByIndex(
                                'id',
                                link.objectId == link.right_object_id ? link.left_object_id : link.right_object_id
                            ) !== undefined
                    )

               
                    const relationLinks = objectLinks.filter((link) => link.relation_id === relation.id)
                    const linksFields = await UTILS.Relations.getLinksFields(relation, relationLinks, getObjectByIndex, objectsNotInStore)

                    linkFields = [...linkFields, ...linksFields]

                
                })
            )
        }
        const filteredObjects = objectLinks.filter(item => !relationIDs.includes(item.relation_id));

        const extractedData = filteredObjects.map(item => {
            return {
                id: item.id,
                left_object_id: item.left_object_id,
                right_object_id: item.right_object_id,
                relation_id: item.relation_id,
                order: item?.order

            };
        });

        setExtractedData(extractedData)

        setDataForObjectAddModal(relationsByTypes?.virtualRelations ?? [])
        setCompState({
            ...compState,
            isLoading: false,
            relationsByType: relationsByTypes.relationTypes,
            objectsToRelation,
        })
        setUnresolvedObjectLinks(objectLinksForbiddenObjects)


        //*Отправялем линки, объекты которых есть в сторе, либо найдены по запросу к серверу ранее
        onLinksChange(linkFields.filter(linkField => getObjectByIndex('id', linkField?.value) !== undefined || finedObjectsIds.includes(linkField?.value)))
        setIsLoadingLinks(false) 
    
    }


    useEffect(() => {
        // if (currentObject) {
        getData().then()
        
    }, [currentObject])

    useEffect(() => {
        let localAllRelations: any[] = []

        compState.relationsByType.forEach(item => {

            if (item.relations?.length > 0) {
                localAllRelations = [...localAllRelations, ...item.relations]
            }
        })
        setAllRelations(localAllRelations)
        setRelationsForRender(localAllRelations)
    }, [compState?.relationsByType])


    useEffect(() => {
        if (chosenRelationsTypes.length > 0) {
            const localRelations = [...allRelations]

            setRelationsForRender(localRelations.filter(rl => chosenRelationsTypes.includes(rl.relation_type)))
        }
        else {
            setRelationsForRender(allRelations) 
        }

    }, [chosenRelationsTypes])


    useEffect(() => {
        if (relationsNameFilter !== '') {
            const localRelations = [...allRelations]

            setRelationsForRender(localRelations.filter(rl => rl.name.toLowerCase().includes(relationsNameFilter)))
        }
        else {
            setRelationsForRender(allRelations) 
        }
    }, [relationsNameFilter])



    const relationIdCounts = {};

    useEffect(() => {
        linkFields.forEach((linkField) => {
            const relationId = linkField.relation_id;

            if (!relationIdCounts[relationId]) {
                relationIdCounts[relationId] = 1;
            } else {
                relationIdCounts[relationId]++;
            }
        });
        setRelationByIdCounts(relationIdCounts)
    }, [linkFields])

    const toggleIsObjectShow = (linkFieldValue: number, classId: number | string, objectName: string, className: string) => {

        setLinkFieldValue(linkFieldValue)
        const addKeyToObjectIfNotExists = (obj: any, newKey: number) => {
            if (!(newKey in obj)) {
                return {
                    ...obj,
                    [newKey]: true,
                };
            } else if ((newKey in obj)) {
                const updatedValue = obj[newKey] = !obj[newKey];

                return {
                    ...obj,
                    updatedValue
                };
            }

            return obj;
        };

        setIsObjectShow({ ...isObjectShow, status: true, id: linkFieldValue, classId: classId, objectName: objectName, className: className })

        const obj = addKeyToObjectIfNotExists(objShowStatus, linkFieldValue)

        setObjShowStatus({ ...objShowStatus, ...obj });

    }

    return (

        <Col span={24}>

            {(!isLoadingLinks && !isLoadingAttrs && !isLoadingForm) &&
            <>
            
                <Card style={{ marginBottom: '10px' }}>
                    <Row
                        justify="end"
                        style={{ marginBottom: '10px' }}
                        gutter={8}
                        align="middle"
                    >

                
                        <Col span={4}>
                            <Input
                                placeholder="Введите название связи"
                                type="text"
                                onChange={(e) => {
                                    setTimeout(() => {
                                        setRelationsNameFilter(e.target.value)
                                    }, 1000);
                                }}
                            />
                        </Col>
                        <Col span={4}>
                            <Select
                                onClear={() => {setChosenRelationsTypes([])}}
                                onChange={(e) => {
                                    setChosenRelationsTypes(e)
                                }}
                                placement = "topRight"
                                style={{ width: '100%' }}
                                mode="multiple"
                                data={relationTypesData}
                                placeholder="Выберите типы связи"
                            />
                        </Col>
                        <Col>
                            <Switch
                                checkedChildren="Все связи открыты"
                                unCheckedChildren="Все связи закрыты"
                                onChange={(e) => {setIsOpenUpRelations(e)
                                    setIsOpenHorizontalRelations(e)
                                    setIsOpenDownRelations(e)
                                    setActiveKeyUp(e == true ? ['1'] : [])
                                    setActiveKeyDown(e == true ? ['1'] : [])
                                    setActiveKeyHorizontal(e == true ? ['1'] : [])
                                }}
                            />
                        </Col>
                        <Col>
                            <Switch
                                checkedChildren="Верхние связи открыты"
                                unCheckedChildren="Верхние связи закрыты"
                                onChange={(e) => {setIsOpenUpRelations(e)
                                    setActiveKeyUp(e == true ? ['1'] : [])}}
                            />
                        </Col>
                        <Col>
                            <Switch
                                checkedChildren="Нижние связи открыты"
                                unCheckedChildren="Нижние связи закрыты"
                                onChange={(e) => {setIsOpenDownRelations(e)
                                    setActiveKeyDown(e == true ? ['1'] : [])}}
                            />
                        </Col>
                        <Col>
                            <Switch
                                checkedChildren="Горизонтальные связи открыты"
                                unCheckedChildren="Горизонтальные связи закрыты"
                                onChange={(e) => {setIsOpenHorizontalRelations(e)
                                    setActiveKeyHorizontal(e == true ? ['1'] : [])}}
                            />
                        </Col>
                    </Row>
    
    
                    <Collapse
                        onChange={onChangeCollapseUp}
                        activeKey={activeKeyUp}
                        style={{ marginBottom: '20px' }}
                        items={[{ key: '1',
                            label: 'Связи наверх', 
                            children:
    
                        <Row gutter={[8, 8]}>{
                            relationsForRender.filter(rl => (rl.direction == 'up' && rl.relation_type !== 'association')).map(item => {
                            
                                return (
                                    // <RelationTypeRender isOpenUpRelations = {isOpenUpRelations} key={`key_${item.id}`} relationType={item} />
                                    <RelationContainer
                                        objectId={objectId}
                                        relationByIdCounts={relationByIdCounts}
                                        onLinksChange={onLinksChange}
                                        linkFields={linkFields}
                                        toggleIsObjectShow={toggleIsObjectShow}
                                        relation={item}
                                        isOpenAllRelations={isOpenUpRelations}
                                        onLinkUnbind={onLinkUnbind}
                                        key={`key_${item.id}`}
                                        objects={objects}
                                        onLinkAdd={onLinkAdd}
                                        dataForObjectAddModal={dataForObjectAddModal}
                                        compState={compState} 
                                        setModalState={setModalState}
                                        onLinkUpdate={onLinkUpdate}
                                        editLinkTrue={editLinkTrue}
                                        setEditLinkTrue={setEditLinkTrue} 
                                        modalState={modalState}
                                        mainObjectClass={classId}
                                        currentObject= {currentObject}
                                    />
                                )
                            })
                        }
                        </Row>
                    
                        }]}
                    />

                    <Collapse
                        onChange={onChangeCollapseDown}
                        activeKey={activeKeyDown}
                        style={{ marginBottom: '20px' }}
                        items={[{ key: '1', label: 'Связи вниз', children:
                        
                        <Row gutter={[8, 8]}>{
                            relationsForRender.filter(rl => (rl.direction == 'down' && rl.relation_type !== 'association')).map(item => {
                            
                                return (
                                    // <RelationTypeRender isOpenDownRelations = {isOpenDownRelations} key={`key_${item.id}`} relationType={item} />
                                    <RelationContainer
                                        objectId={objectId}
                                        relationByIdCounts={relationByIdCounts}
                                        onLinksChange={onLinksChange}
                                        linkFields={linkFields}
                                        toggleIsObjectShow={toggleIsObjectShow}
                                        relation={item}
                                        isOpenAllRelations={isOpenDownRelations}
                                        onLinkUnbind={onLinkUnbind}
                                        key={`key_${item.id}`}
                                        objects={objects}
                                        onLinkAdd={onLinkAdd}
                                        dataForObjectAddModal={dataForObjectAddModal}
                                        compState={compState} 
                                        setModalState={setModalState}
                                        onLinkUpdate={onLinkUpdate}
                                        editLinkTrue={editLinkTrue}
                                        setEditLinkTrue={setEditLinkTrue} 
                                        modalState={modalState}
                                        mainObjectClass={classId}
                                        currentObject= {currentObject}
                                    />
                                )
                            })
                        }
                        </Row> }]}
                    />

                    <Collapse
                        onChange={onChangeCollapseHorizontal}
                        activeKey={activeKeyHorizontal}
                        style={{ marginBottom: '20px' }}
                        items={[{ key: '1',
                            label: 'Горизонтальные связи', 
                            children:
    
                        <Row gutter={[8, 8]}>{
                            relationsForRender.filter(rl => ( rl.relation_type == 'association')).map(item => {
                            
                                return (
                                    // <RelationTypeRender isOpenUpRelations = {isOpenUpRelations} key={`key_${item.id}`} relationType={item} />
                                    <RelationContainer
                                        objectId={objectId}
                                        relationByIdCounts={relationByIdCounts}
                                        linkFields={linkFields}
                                        toggleIsObjectShow={toggleIsObjectShow}
                                        relation={item}
                                        isOpenAllRelations={isOpenHorizontalRelations}
                                        onLinkUnbind={onLinkUnbind}
                                        key={`key_${item.id}`}
                                        objects={objects}
                                        onLinkAdd={onLinkAdd}
                                        dataForObjectAddModal={dataForObjectAddModal}
                                        compState={compState}
                                        onLinksChange={onLinksChange}
                                        modalState={modalState}
                                        setModalState={setModalState}
                                        onLinkUpdate={onLinkUpdate}
                                        editLinkTrue={editLinkTrue}
                                        setEditLinkTrue={setEditLinkTrue}
                                        mainObjectClass={classId} 
                                        currentObject= {currentObject}
                                    />
                                )
                            })
                        }
                        </Row>
                    
                        }]}
                    />
                </Card>
            </>}

        </Col>
    )
}

export default LinksRelationForm