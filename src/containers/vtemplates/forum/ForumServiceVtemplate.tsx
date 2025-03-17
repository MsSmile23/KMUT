import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectOAttrsWithAggregationTable } from '@containers/object-attributes/ObjectOAttrsWithAggregationTable/ObjectOAttrsWithAggregationTable'
import { ObjectOAttrState } from '@containers/objects/ObjectOAttrState/ObjectOAttrState'

import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { ObjectsLinkedTable } from '@entities/objects/ObjectsLinkedTable/ObjectsLinkedTable'
import { ObjectStateHistory } from '@entities/states/ObjectStateHistory/ObjectStateHistory'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { useRelationsStore } from '@shared/stores/relations'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'
interface IForumServiceVtemplate {
    object: IObject
}
const ForumServiceVtemplate: FC<IForumServiceVtemplate> = ({ object }) => {
    const allRelationIds = useRelationsStore((st) => st.store.data.map(({ id }) => id))

    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget height={400} title="Описание устройства">
                    <ObjectOAttrs
                        objectId={object.id}
                        showLinks
                        height={350}
                        {...forumThemeConfig.service.objectAttributes}
                    />
                </WrapperWidget>
            </Col>
            <Col span={16}>
                <WrapperWidget title="История статусов" style={{ textAlign: 'center' }} height={400}>
                    <ObjectStateHistory settings={{ entityId: object.id, targetEntity: 'object' }} />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget title="Статусы оборудования" height={400}>
                    <ObjectLinkedShares {...forumThemeConfig.main.statuses.chart} parentObject={object} />
                </WrapperWidget>
            </Col>
            <Col span={16}>
                <WrapperWidget title="Статусы услуг" height={400}>
                    <ObjectOAttrState
                        object={object}
                        representationType="horizontalTags"
                        oslProps={{
                            object_id: object.id,
                            classes_id: forumThemeConfig.classesGroups.favor,
                            childClsIds: [],
                            labelWidth: '200px',
                            linkedObjects: {
                                linksClsIds: forumThemeConfig.classesGroups.favor,
                                linksDirection: 'parents',
                            },
                        }}
                    />
                    {/* <TestObjectStateContainer /> */}
                </WrapperWidget>
            </Col>
            <Col span={24}>
                <WrapperWidget title="Таблица Оборудования">
                    <ObjectsLinkedTable
                        tableId="forum-service-devices-table"
                        parentObjectId={object.id}
                        parentObject={object}
                        relationIds={allRelationIds}
                        targetClasses={{
                            ids: forumThemeConfig.classesGroups.devices,
                            attributeIds: [],
                            //filterByAttributes: (a) => a.readonly && a.history_to_db
                        }}
                        parentClasses={[
                            { id: 10097, showObjectProps: ['name'], attributeIds: [] },
                            { id: 10082, showObjectProps: ['name'], attributeIds: [] },
                            { id: 10058, showObjectProps: ['name'], attributeIds: [] },
                            { id: 10105, showObjectProps: ['name'], attributeIds: [] },
                            { id: 10056, showObjectProps: ['name'], attributeIds: [] },
                            { id: 10058, showObjectProps: ['name'], attributeIds: [] },
                            { id: 10055, showObjectProps: ['name'], attributeIds: [] },
                        ]}
                        statusColumn="Состояние оборудования"
                        classColumn="Тип оборудования"
                        columnsOrder={[
                            'id',
                            'object__name',
                            'parent_class_10055', // Здание
                            'parent_class_10056', // Этаж
                            'parent_class_10105', // Помещение
                            'parent_class_10058', // Стоечно-коммутационное оборудование
                            'parent_class_10082', // Юнит
                            'parent_class_10097', // Вариант размещения в юните
                        ]}
                        scroll={{ x: 2000 }}
                    />
                </WrapperWidget>
            </Col>
            <Col span={24}>
                <WrapperWidget title="Таблица Метрик" overflow="auto">

                    <ObjectOAttrsWithAggregationTable 
                        objectId={object.id}
                        aggregations={['current', 'max', 'min', 'average']}
                        viewType="table"
                    />
                </WrapperWidget>
            </Col>
        </Row>
    )
}

export default ForumServiceVtemplate