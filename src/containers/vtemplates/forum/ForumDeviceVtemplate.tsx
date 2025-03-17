/* eslint-disable max-len */
/* eslint-disable react/jsx-max-depth */
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { IObject } from '@shared/types/objects'
import { FC } from 'react'
import { Row, Col } from 'antd'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { ObjectStateHistory } from '@entities/states/ObjectStateHistory/ObjectStateHistory'
import { ObjectOAttrsWithAggregationTable } from '@containers/object-attributes/ObjectOAttrsWithAggregationTable/ObjectOAttrsWithAggregationTable'
import { ObjectOAttrStateWithAggregation } from '@containers/object-attributes/ObjectOAttrStateWithAggregation/ObjectOAttrStateWithAggregation'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'

const ForumDeviceVtemplate: FC<{ object: IObject }> = ({ object }) => {
    const isIBPServerZondClass = [
        forumThemeConfig.classIBP,
        forumThemeConfig.classServer,
        forumThemeConfig.classZond
    ].includes(object.class_id)
    
    const isSpecificDevice = ({
        mnemo,
        classId
    }): {
        mnemo: 'servers' | 'zonds' | 'ibps'
        classId: IClass['id']
    } => {
        return forumThemeConfig.classesGroups?.[mnemo]?.includes(classId) ?? false
    }
    
    

    return (
        <Row gutter={16}>
            <Col span={10} className="gutter-row">
                <WrapperWidget
                    title="Атрибуты"
                    height={forumThemeConfig.device.attributes.height}
                    titleStyle={{ fontSize: '16px' }}
                >
                    <ObjectOAttrs
                        objectId={object.id}
                        showLinks
                        height={420}
                        linkedObjects={{
                            targetClasses: [
                                {
                                    class_id: 10082,
                                    showClassName: true,
                                },
                                {
                                    class_id: 10058,
                                    showClassName: true,
                                },
                                {
                                    class_id: 10105,
                                    showClassName: true,
                                },
                                {
                                    class_id: 10056,
                                    showClassName: true,
                                },
                                {
                                    class_id: 10055,
                                    showClassName: true,
                                },
                            ],
                            connectingClasses: [10082, 10058, 10105, 10056, 10055],
                        }}
                    />
                </WrapperWidget>
            </Col>
            <Col span={14} className="gutter-row">
                <WrapperWidget
                    title="История статусов"
                    height={isIBPServerZondClass 
                        ? forumThemeConfig.build.favorHealth.height
                        : forumThemeConfig.device.attributes.height}
                    titleStyle={{ fontSize: '16px' }}
                >
                    <ObjectStateHistory settings={{ entityId: object.id, targetEntity: 'object' }} />
                </WrapperWidget>

                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <ObjectOAttrStateWithAggregation
                                    objectAttribute={
                                        isSpecificDevice({ mnemo: 'ibps', classId: object.class_id })
                                            ? object.object_attributes.find(
                                                (attr) =>
                                                    attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.IBP[0]
                                            )
                                            : isSpecificDevice({ mnemo: 'servers',  classId: object.class_id })
                                                || isSpecificDevice({ mnemo: 'zonds',  classId: object.class_id })
                                                ? object.object_attributes.find(
                                                    (attr) =>
                                                        attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.zondAndServer[0]
                                                )
                                                : undefined
                                    }
                                    value={{
                                        aggregation: 'current',
                                        enabled: true,
                                    }}
                                    maxWidth
                                    customStyle={{
                                        height: '60px',
                                        alignItems: 'center',
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <ObjectOAttrStateWithAggregation
                                    objectAttribute={
                                        object.class_id == forumThemeConfig.classIBP
                                            ? object.object_attributes.find(
                                                (attr) =>
                                                    attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.IBP[1]
                                            )
                                            : isSpecificDevice({ mnemo: 'servers',  classId: object.class_id }) ||
                                              object.class_id == forumThemeConfig.classZond
                                                ? object.object_attributes.find(
                                                    (attr) =>
                                                        attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.zondAndServer[1]
                                                )
                                                : undefined
                                    }
                                    value={{
                                        aggregation: 'current',
                                        enabled: true,
                                    }}
                                    maxWidth
                                    customStyle={{
                                        height: '60px',
                                        alignItems: 'center',
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                {}
                                <ObjectOAttrStateWithAggregation
                                    objectAttribute={
                                        object.class_id == forumThemeConfig.classIBP
                                            ? object.object_attributes.find(
                                                (attr) =>
                                                    attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.IBP[2]
                                            )
                                            : isSpecificDevice({ mnemo: 'servers',  classId: object.class_id }) ||
                                              object.class_id == forumThemeConfig.classZond
                                                ? object.object_attributes.find(
                                                    (attr) =>
                                                        attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.zondAndServer[2]
                                                )
                                                : undefined
                                    }
                                    value={{
                                        aggregation: 'current',
                                        enabled: true,
                                    }}
                                    maxWidth
                                    customStyle={{
                                        height: '60px',
                                        alignItems: 'center',
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <ObjectOAttrStateWithAggregation
                                    objectAttribute={
                                        object.class_id == forumThemeConfig.classIBP
                                            ? object.object_attributes.find(
                                                (attr) =>
                                                    attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.IBP[3]
                                            )
                                            : isSpecificDevice({ mnemo: 'servers',  classId: object.class_id }) ||
                                              object.class_id == forumThemeConfig.classZond
                                                ? object.object_attributes.find(
                                                    (attr) =>
                                                        attr.attribute_id ==
                                                      forumThemeConfig.device.attributesForDevicePage.zondAndServer[3]
                                                )
                                                : undefined
                                    }
                                    value={{
                                        aggregation: 'current',
                                        enabled: true,
                                    }}
                                    maxWidth
                                    customStyle={{
                                        height: '60px',
                                        alignItems: 'center',
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Col span={24} className="gutter-row">
                <WrapperWidget
                    title="Таблица Метрик"
                    height={forumThemeConfig.build.deviceStatuses.chart.height}
                    overflow="auto"
                    titleStyle={{ fontSize: '16px' }}
                >

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

export default ForumDeviceVtemplate