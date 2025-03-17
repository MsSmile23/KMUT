/* eslint-disable max-len */
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ILocalTheme } from '@app/themes/types'
import ObjectAttributesAndChildStates, {
    IObjectAttributesAndChildStates,
} from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import { ObjectsInOutHistory } from '@entities/objects/ObjectsInOutHistory/ObjectsInOutHistory'
import { useTheme } from '@shared/hooks/useTheme'
import { useConfigStore } from '@shared/stores/config'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { sortObjectsByPriority } from '@shared/utils/objects'
// import { getPaddings } from '@shared/utils/Theme/theme.utils'
import { FC, useCallback, useState } from 'react'
import { jsonParseAsObject } from '@shared/utils/common'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useGetObjects } from '@shared/hooks/useGetObjects'

const getPaddings = (paddings, paddingMnemo: keyof Omit<ILocalTheme['paddings'], 'basePadding'>) => {
    if (paddings?.[paddingMnemo]?.isActive) {
        return paddings?.[paddingMnemo]?.value
    }

    return paddings?.basePadding
}

const MainDefault: FC = () => {
    const objects = useGetObjects()
    const buildings = objects.filter((obj) => obj.class_id == 10055)
    const buildingsByPrior = sortObjectsByPriority(buildings)
    //const theme = useTheme()
    const getPaddingsFromStore = useCallback(() => {
        const frontSettings = jsonParseAsObject(useConfigStore.getState().getConfigByMnemo('front_settings')?.value)

        return frontSettings?.paddings
    }, [])
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'

    // eslint-disable-next-line max-len
    const [paddings, setPaddings] = useState(getPaddingsFromStore())

    // useEffect(async () => {
    //     await useConfigStore.getState().fetchData()
    //     setPaddings(JSON.parse(useConfigStore.getState().store.data[8].value)?.paddings)
    // },)

    const objSections = {
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.classesGroups.favour,
            },
        },
        statusChartProps: {
            chartProps: forumThemeConfig.main.deviceStatuses.chart,
        },
    } as IObjectAttributesAndChildStates['sections']

    const mainSections = {
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.classesGroups.favourMain,
            },
        },
        statusChartProps: {
            chartProps: forumThemeConfig.main.statuses.chart,
        },
    } as IObjectAttributesAndChildStates['sections']

    const fiveInRowWidth = `calc((100% - 4 * ${getPaddings(paddings, 'horizontalWidgetPadding') * 2}px)/ 5)`

    //*Новый форум
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: `${getPaddings(paddings, 'verticalWidgetPadding') * 2}px`,
                paddingRight: `${getPaddings(paddings, 'verticalWidgetPadding')}px`,
                rowGap: `${getPaddings(paddings, 'verticalWidgetPadding') * 2}px`,
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: `${getPaddings(paddings, 'horizontalWidgetPadding') * 2}px`,
                    width: '100%',
                }}
            >
                <WrapperWidget
                    height={forumThemeConfig.main.clientIncidentsDynamics.height}
                    style={{
                        overflow: 'hidden',
                        width: fiveInRowWidth,
                        marginBottom: 0,
                        backgroundColor: backgroundColor,
                    }}
                >
                    <ObjectAttributesAndChildStates
                        labelsContainerHeight={forumThemeConfig.main.clientIncidentsDynamics.height}
                        labelsCount={6}
                        object={objects.find((obj) => obj.class_id == forumThemeConfig.forumClass)}
                        sections={mainSections}
                        mainObject
                        titleStyle={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 30,
                            fontSize: '14px !important',
                        }}
                    />
                </WrapperWidget>
                <WrapperWidget
                    style={{
                        flex: 1,
                        marginBottom: 0,
                        backgroundColor: backgroundColor,
                    }}
                    // title="Динамика одиночных инцидентов"
                    // titleStyle={{ fontSize: '16px' }}
                    height={forumThemeConfig.main.clientIncidentsDynamics.height}
                >
                    <ObjectsInOutHistory
                        sourceClass={forumThemeConfig.build.clientIncidentsDynamics.sourceClassId}
                        height={forumThemeConfig.main.clientIncidentsDynamics.height}
                    />
                </WrapperWidget>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    // gap: 16,
                    rowGap: `${getPaddings(paddings, 'verticalWidgetPadding') * 2}px`,
                    columnGap: `${getPaddings(paddings, 'horizontalWidgetPadding') * 2}px`,
                }}
            >
                {buildingsByPrior.map((build) => {
                    return (
                        <WrapperWidget
                            key={`build-${build.id}`}
                            style={{
                                width: fiveInRowWidth,
                                overflow: 'hidden',
                                marginBottom: 0,
                                backgroundColor: backgroundColor,
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
                                    fontSize: '14px !important',
                                }}
                            />
                        </WrapperWidget>
                    )
                })}
            </div>
        </div>

    //!Старый форум
    //     <Row gutter={16}>

    //!Старый форум
    //     <Row gutter={16}>

    //         <Col span={8}>
    //             <Row justify="center" gutter={8}>
    //                 <Col span={12}>
    //                     <WrapperWidget>
    //                         <ObjectCountContainer
    //                             filters= {{ mnemo: 'class_id', value: [] }}
    //                             title= "Общее количество объектов"
    //                             color= "#007BFF"
    //                             icon= "HomeOutlined"
    //                             textSize= "12"
    //                         />
    //                     </WrapperWidget>
    //                 </Col>
    //                 <Col span={12}>
    //                     <WrapperWidget>
    //                         <ObjectCountContainer
    //                             filters= {{ mnemo: 'class_id', value: [10001] }}
    //                             title= "Заявки"
    //                             color= "#FF4500"
    //                             icon="AlertOutlined"
    //                             textSize= "12"

    //                         />
    //                     </WrapperWidget>
    //                 </Col>
    //                 <Col span={12}>
    //                     <WrapperWidget>
    //                         <ObjectCountContainer
    //                             filters= {{ mnemo: 'class_id', value: [95] }}
    //                             title= "Школа"
    //                             color= "#5CB85C"
    //                             icon= "DesktopOutlined"
    //                             textSize= "12"
    //                         />
    //                     </WrapperWidget>
    //                 </Col>
    //                 <Col span={12}>
    //                     <WrapperWidget>
    //                         <ObjectCountContainer
    //                             filters= {{ mnemo: 'class_id', value: [10055] }}
    //                             title= "Здание"
    //                             color= "#FB00FF"
    //                             icon= "UngroupOutlined"
    //                             textSize= "12"
    //                         />
    //                     </WrapperWidget>
    //                 </Col>
    //             </Row>
    //         </Col>

    //         <Col span={16}>
    //             <WrapperWidget title="Объекты" height = {400}>
    //                 <ObjectsCountByAttribute
    //                     viewType= "progressBar"
    //                     filters= {{ mnemo: 'class_id', value: 1 }}
    //                     criteria= {{ mnemo: 'class', value: [] }}
    //                     sort= {{ sort: 'count', order: 'desc' }}
    //                     height = "350"
    //                 />
    //             </WrapperWidget>
    //         </Col>
    //         <Col span={24}>
    //             <WrapperWidget title="Кабельный журнал" style={{ textAlign: 'center' }} height={750}>
    //                 <ObjectCableTable
    //                     //cableClasses={[10022]}
    //                     cableClasses={[10064, 10066]}
    //                     //relationsCablePort={[10026]}
    //                     relationsCablePort={[10013, 10017]}
    //                     //relationsPortDevice={[10027, 10028]}
    //                     relationsPortDevice={
    //                         [
    //                             / eslint-disable-next-line max-len
    //                             10156, 10052, 10142, 10143, 10144, 10145, 10146, 10147, 10148, 10149, 10150, 10151, 10152, 10153, 10154, 10160, 10155, 10157, 10158, 10159,
    //                             // eslint-disable-next-line max-len
    //                             10071, 10015, 10057, 10058, 10059, 10060, 10061, 10062, 10063, 10064, 10065, 10066, 10067, 10068, 10069, 10075, 10070, 10072, 10073, 10074
    //                         ]
    //                     }
    //                     height={700}
    //                 />
    //             </WrapperWidget>
    //         </Col>
    //         <Col span={24}>
    //             <WrapperWidget
    //                 title=" Здания с помещениями и устройствами"
    //                 style={{ textAlign: 'center' }}
    //                 height = {400}
    //             >
    //                 <ObjectRoomsWithDevicesTable
    //                     buildingClassId={10055}
    //                     relationFloorBuildings={10007}
    //                     relationRoomFloor={10008}
    //                     relationStandRoom={10009}
    //                     relationStandUnit={10037}
    //                     relationsDevicesUnit={[10109, 10038, 10106, 10107, 10113, 10108, 10110, 10111, 10112]}
    //                     height = {350}
    //                 />
    //             </WrapperWidget>
    //         </Col>

    //     </Row>
    )
}

export default MainDefault