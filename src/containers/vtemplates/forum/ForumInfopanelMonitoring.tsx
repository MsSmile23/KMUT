import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import ObjectAttributesAndChildStates, { IObjectAttributesAndChildStates } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { sortObjectsByPriority } from '@shared/utils/objects'
import { Col, Row } from 'antd'
import { FC } from 'react'


const MAIN_BUILDINGS = [10001, 10002, 10003, 10005, 12438]

const ForumInfopanelMonitoring: FC = () => {
    const objects = useGetObjects()
    const buildings = objects.filter(obj => obj.class_id == 10055)
    const buildingsByPrior = sortObjectsByPriority(buildings)
    const buildingsOnMainSection = buildings.filter(obj =>
        //obj.id === 10001 || obj.id === 10002
        MAIN_BUILDINGS.includes(obj.id)
    )

    const objSections = {
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.classesGroups.favour
            }
        },
        statusChartProps: {
            chartProps: {
                ...forumThemeConfig.main.deviceStatuses.chart,
                legendSettings: {
                    ...forumThemeConfig.main.deviceStatuses.chart.legendSettings,
                    chartRatio: 0.3,
                    legendRatio: 0.6
                }
            }
        }
    } as IObjectAttributesAndChildStates['sections']

    const mainSections = {
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.classesGroups.favourMain
            }
        },
        statusChartProps: {
            chartProps: {
                ...forumThemeConfig.main.statuses.chart,
                height: 210, 
                legendSettings: {
                    ...forumThemeConfig.main.statuses.chart.legendSettings,
                    chart: {
                        ...forumThemeConfig.main.statuses.chart.legendSettings.chart,
                        height: 205
                    },
                    chartRatio: 0.3,
                    legendRatio: 0.6
                }

            }
        }
    } as IObjectAttributesAndChildStates['sections']

    const sixInRowWidth = 'calc((100% - 5 * 16px)/ 5)'
    


    //*Новый форум
    return (
        <>
            
            <Row gutter={[16, 16]} style={{ marginBottom: '40px' }} >
                <Col span={8}>
                    <WrapperWidget
                        height={278}
                        title="Все объекты Фестиваля"
                        style={{ 
                            overflow: 'hidden', 
                            width: '100%',
                            marginBottom: 0,
                            paddingTop: 0
                        }}
                    >
                        <ObjectAttributesAndChildStates
                            maxWidth={false}
                            labelsContainerHeight={250}
                            labelsCount={6}
                            object={objects.find(obj =>  obj.class_id ==  forumThemeConfig.forumClass )}
                            sections={mainSections}
                            mainObject
                            titleStyle={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: 37,
                                fontSize: '14px !important'
                            }}
                        />

                    </WrapperWidget>
                </Col>
                {buildingsOnMainSection.map((build) => {
                    return (
                        <Col span={8} key={`build-${build.id}`}>
                            <WrapperWidget 
                                style={{ 
                                    width: '100%',
                                    overflow: 'hidden',
                                    marginBottom: 0 
                                // marginBottom: lastItemCondition ? 0 : 15 
                                }}
                                height={278}
                            >
                                <ObjectAttributesAndChildStates
                                    maxWidth={false}
                                    labelsContainerHeight={250}
                                    labelsCount={6}
                                    onClickTransition 
                                    object={build} 
                                    sections={objSections}
                                    titleStyle={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        height: 37, 
                                        fontSize: '14px !important'
                                    }}
                                />
                            </WrapperWidget>
                        </Col>
                    )
                })}
            </Row>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 20,
                    justifyContent: 'flex-start'
                }}
            >
                {buildingsByPrior.filter(bl => MAIN_BUILDINGS.includes(bl.id) == false).map((build) => {
                    return (
                        <WrapperWidget 
                            key={`build-${build.id}`}
                            style={{ 
                                width: sixInRowWidth,
                                overflow: 'hidden',
                                marginBottom: 0 
                                // marginBottom: lastItemCondition ? 0 : 15 
                            }}
                            height={278}
                        >
                            <ObjectAttributesAndChildStates
                                labelsContainerHeight={250}
                                labelsCount={6}
                                onClickTransition 
                                object={build} 
                                sections={objSections}
                                titleStyle={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    height: 37, 
                                    fontSize: '14px !important'
                                }}
                            />
                        </WrapperWidget>
                    )
                })}
            </div>
           
        </>
    )
}

export default ForumInfopanelMonitoring