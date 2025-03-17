import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectsLinkedTable } from '@entities/objects/ObjectsLinkedTable/ObjectsLinkedTable'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { ObjectStateHistory } from '@entities/states/ObjectStateHistory/ObjectStateHistory'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { useRelationsStore } from '@shared/stores/relations'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

interface IForumFavourVtemplateProps {
    object: IObject
}

export const ForumProjectFavourVtemplate: FC<IForumFavourVtemplateProps> = ({ object }) => {
    const allRelationIds = useRelationsStore((st) => st.store.data.map(({ id }) => id))
    const chartProps = {
        ...forumThemeConfig.main.statuses.chart,
        classesIds: forumThemeConfig.classesGroups.devices,
        childClsIds: [...forumThemeConfig.classesGroups.favour, ...forumThemeConfig.classesGroups.services],
    }

    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget height={250} title="Описание">
                    <ObjectOAttrs objectId={object.id} showLinks height={350} />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget title="История статусов" style={{ textAlign: 'center' }} height={250}>
                    <ObjectStateHistory settings={{ entityId: object.id, targetEntity: 'object' }} />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget title="Статусы оборудования" height={250}>
                    <ObjectLinkedShares {...chartProps} parentObject={object} />
                </WrapperWidget>
            </Col>
            <Col span={24}>
                <WrapperWidget title="Таблица связанного оборудования">
                    <ObjectsLinkedTable
                        tableId="forum-favour-devices-table"
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
                        childClsIds={[
                            ...forumThemeConfig.classesGroups.favour,
                            ...forumThemeConfig.classesGroups.services,
                        ]}
                        scroll={{ x: 2000 }}
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
                    />
                </WrapperWidget>
            </Col>
        </Row>
    )
}