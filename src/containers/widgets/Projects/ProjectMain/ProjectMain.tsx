/* eslint-disable react/jsx-max-depth */
import ObjectsStatusList from '@entities/objects/ObjectsStatusList/ObjectsStatusList'
import MarkoAvaria from '@pages/dev/marko/MarkoDev/NewTable/MarkoAvaria'
import MarkoTop5Table from '@pages/dev/marko/MarkoDev/NewTable/MarkoTopTables.Components/MarkoTop5Table'
import ProjectRegionalCard from '@pages/dev/marko/MarkoDev/Project/ProjectRegionalCard'
import { getObjectsStatuses } from '@shared/api/Objects/Models/getObjectsStatuses/getObjectsStatuses'
import { SERVICES_VOSHOD } from '@shared/api/Voshod'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { IVoshodRegionStatus, IVoshodRegionStatuses } from '@shared/types/voshod'
import { ECSimpleFilters } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/ECSimpleFilters'
import ECGridMap from '@shared/ui/ECUIKit/maps'
import ECGridMapLegend from '@shared/ui/ECUIKit/maps/ECGridMap/ECGridMapLegend'
import { ECLoader } from '@shared/ui/loadings'
import { DefaultModal2 } from '@shared/ui/modals'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Col, Flex, Row, Typography } from 'antd'
import { Button } from 'antd/lib'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { aborted } from 'util'
const { Text, Link } = Typography;



// #98c667
// #cdcbcc
// #ffbf00
// #ea7b7c

const objects = [
    { id: 3, name: 'СПБ', color: '#98c667', x: 1, y: 1 },
    { id: 1, name: 'МУР', color: '#98c667', x: 5, y: 1 },
    { id: 6, name: 'СВС', color: '#98c667', x: 2, y: 1 },
    { id: 2, name: 'МСК', color: '#98c667', x: 1, y: 2 },
    { id: 4, name: 'КАР', color: '#98c667', x: 4, y: 2 },
    { id: 5, name: 'НЕН', color: '#98c667', x: 10, y: 2 },
    { id: 7, name: 'ЧУК', color: '#98c667', x: 17, y: 2 },
    { id: 8, name: 'КАМ', color: '#98c667', x: 18, y: 2 },

    { id: 9, name: 'ЛЕН', color: '#98c667', x: 3, y: 3 },
    { id: 10, name: 'НОВГ', color: '#98c667', x: 4, y: 3 },
    { id: 11, name: 'ВОЛ', color: '#98c667', x: 5, y: 3 },
    { id: 12, name: 'АРХ', color: '#98c667', x: 9, y: 3 },
    { id: 13, name: 'КОМИ', color: '#98c667', x: 10, y: 3 },
    { id: 14, name: 'ЯМАЛ', color: '#98c667', x: 11, y: 3 },
    { id: 15, name: 'КРАС', color: '#98c667', x: 14, y: 3 },
    { id: 16, name: 'ЯКУТ', color: '#98c667', x: 16, y: 3 },
    { id: 17, name: 'МАГ', color: '#98c667', x: 17, y: 3 },

    { id: 18, name: 'КНГ', color: '#98c667', x: 1, y: 4 },
    { id: 19, name: 'ПСК', color: '#98c667', x: 3, y: 4 },
    { id: 20, name: 'ТВЕР', color: '#98c667', x: 4, y: 4 },
    { id: 21, name: 'ЯРО', color: '#98c667', x: 5, y: 4 },
    { id: 22, name: 'ИВА', color: '#98c667', x: 6, y: 4 },
    { id: 23, name: 'КОС', color: '#98c667', x: 7, y: 4 },
    { id: 24, name: 'МАРИ', color: '#98c667', x: 8, y: 4 },
    { id: 25, name: 'КИР', color: '#98c667', x: 9, y: 4 },
    { id: 26, name: 'ПЕР', color: '#98c667', x: 10, y: 4 },
    { id: 27, name: 'ХАН', color: '#98c667', x: 11, y: 4 },
    { id: 28, name: 'ТЮМ', color: '#98c667', x: 12, y: 4 },
    { id: 29, name: 'ТОМ', color: '#98c667', x: 13, y: 4 },
    { id: 30, name: 'КЕМ', color: '#98c667', x: 14, y: 4 },
    { id: 31, name: 'ИРК', color: '#98c667', x: 15, y: 4 },
    { id: 32, name: 'АМУР', color: '#98c667', x: 16, y: 4 },
    { id: 33, name: 'ХАБ', color: '#98c667', x: 17, y: 4 },
    { id: 340, name: 'СХЛН', color: '#98c667', x: 19, y: 4 },

    { id: 344, name: 'СМОЛ', color: '#98c667', x: 3, y: 5 },
    { id: 35, name: 'КАЛУ', color: '#98c667', x: 4, y: 5 },
    { id: 36, name: 'МОС', color: '#98c667', x: 5, y: 5 },
    { id: 37, name: 'ВЛА', color: '#98c667', x: 6, y: 5 },
    { id: 38, name: 'НИЖ', color: '#98c667', x: 7, y: 5 },
    { id: 39, name: 'ЧУВ', color: '#98c667', x: 8, y: 5 },
    { id: 40, name: 'ТАТ', color: '#98c667', x: 9, y: 5 },
    { id: 41, name: 'УДМ', color: '#98c667', x: 10, y: 5 },
    { id: 42, name: 'СВЕР', color: '#98c667', x: 11, y: 5 },
    { id: 43, name: 'КУРГ', color: '#98c667', x: 12, y: 5 },
    { id: 44, name: 'НОВО', color: '#98c667', x: 13, y: 5 },
    { id: 45, name: 'ХАК', color: '#98c667', x: 14, y: 5 },
    { id: 46, name: 'БУР', color: '#ffbf00', x: 15, y: 5 },
    { id: 47, name: 'ЕВР', color: '#98c667', x: 16, y: 5 },

    { id: 48, name: 'БРЯ', color: '#98c667', x: 3, y: 6 },
    { id: 49, name: 'ОРЛ', color: '#98c667', x: 4, y: 6 },
    { id: 50, name: 'ТУЛ', color: '#98c667', x: 5, y: 6 },
    { id: 51, name: 'РЯЗ', color: '#98c667', x: 6, y: 6 },
    { id: 52, name: 'МОР', color: '#98c667', x: 7, y: 6 },
    { id: 53, name: 'УЛЬ', color: '#98c667', x: 8, y: 6 },
    { id: 54, name: 'САМ', color: '#98c667', x: 9, y: 6 },
    { id: 55, name: 'БШК', color: '#98c667', x: 10, y: 6 },
    { id: 56, name: 'ЧЕЛ', color: '#98c667', x: 11, y: 6 },
    { id: 57, name: 'ОМСК', color: '#98c667', x: 12, y: 6 },
    { id: 58, name: 'АЛ.К', color: '#98c667', x: 13, y: 6 },
    { id: 59, name: 'ТЫВА', color: '#98c667', x: 14, y: 6 },
    { id: 60, name: 'ЗАБ', color: '#98c667', x: 15, y: 6 },
    { id: 610, name: 'ПРИ', color: '#98c667', x: 17, y: 6 },

    { id: 613, name: 'КУР', color: '#98c667', x: 5, y: 7 },
    { id: 62, name: 'ЛИП', color: '#98c667', x: 6, y: 7 },
    { id: 63, name: 'ТАМ', color: '#98c667', x: 7, y: 7 },
    { id: 64, name: 'ПЕН', color: '#98c667', x: 8, y: 7 },
    { id: 65, name: 'САР', color: '#98c667', x: 9, y: 7 },
    { id: 66, name: 'ОРНБ', color: '#98c667', x: 10, y: 7 },
    { id: 67, name: 'АЛТ', color: '#ffbf00', x: 14, y: 7 },

    { id: 68, name: 'ЗО', color: '#cdcbcc', x: 2, y: 8 },
    { id: 69, name: 'ДНР', color: '#cdcbcc', x: 3, y: 8 },
    { id: 70, name: 'ЛНР', color: '#cdcbcc', x: 4, y: 8 },
    { id: 71, name: 'БЕЛ', color: '#98c667', x: 5, y: 8 },
    { id: 72, name: 'ВОР', color: '#98c667', x: 6, y: 8 },
    { id: 73, name: 'ВОЛГ', color: '#98c667', x: 7, y: 8 },

    { id: 74, name: 'ХО', color: '#cdcbcc', x: 2, y: 9 },
    { id: 75, name: 'КРЫМ', color: '#98c667', x: 3, y: 9 },
    { id: 76, name: 'АДЫГ', color: '#98c667', x: 4, y: 9 },
    { id: 77, name: 'КРДР', color: '#98c667', x: 5, y: 9 },
    { id: 78, name: 'РОС', color: '#98c667', x: 6, y: 9 },
    { id: 79, name: 'КАЛМ', color: '#98c667', x: 7, y: 9 },
    { id: 80, name: 'АСТ', color: '#98c667', x: 8, y: 9 },

    { id: 81, name: 'КЧР', color: '#98c667', x: 5, y: 10 },
    { id: 82, name: 'СТАВ', color: '#98c667', x: 6, y: 10 },
    { id: 83, name: 'ЧЕЧ', color: '#ffbf00', x: 7, y: 10 },
    { id: 84, name: 'ДАГ', color: '#98c667', x: 8, y: 10 },

    { id: 85, name: 'КАБ', color: '#98c667', x: 5, y: 11 },
    { id: 86, name: 'С.ОС', color: '#98c667', x: 6, y: 11 },
    { id: 87, name: 'ИНГ', color: '#ffbf00', x: 7, y: 11 },
]

export const objectMock = [
    {
        id: 1,
        name: 'Мурманская область',
        shortName: 'МУР',
        status: {
            color: '#98c667',
            label: '',
            mnemo: ''
        }, //Цвет региона + что ещё передать хотите
        dost: 99, //Доступность в процентах 
        municipalities: [
            {
                id: 1,
                name: 'Оленегорск',
                status: {
                    color: '#ea7b7c',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 76
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
            {
                id: 2,
                name: 'Овощегорск',
                status: {
                    color: '#98c667',
                    label: '',
                    mnemo: ''
                },
                statusCount: [1, 2, 0],
                dost: 120
            },
        ]
    }
]

const legendData = [
    { text: 'Менее 50% муниципалитетов региона с доступностью менее 98%', color: '#98c667' },
    { text: '50% и более муниципалитетов региона с доступностью менее 98%', color: '#ffbf00' },
    { text: 'Массовая авария в регионе', color: '#ea7b7c' },
    { text: 'Данные отсутствуют', color: '#cdcbcc' },
]
const ProjectMain = (props) => {

    const { settings } = props
    const { widget } = settings
    const direction = widget?.output_direction ?? 'vertical'

    const filterFields = useMemo(() => {
        return props.settings.widget.fields || [];
    }, [props.settings]);


    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = useMemo(() => {
        return createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    }, [theme, themeMode]);
    const backgroundColor2 = useMemo(() => {
        return createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'
    }, [theme, themeMode]);
    const color = useMemo(() => createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode),
        [theme, themeMode]);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [selectedObject, setSelectedObject] = useState(null)
    const [filters, setFilters] = useState<any[]>([])
    const [regionsStatuses, setRegionStatuses] = useState<IVoshodRegionStatus[]>([])


    const [statuses, setStatuses] = useState({})
    const [loading, setLoading] = useState(false)

    const [topFiveRegions, setTopFiveRegions] = useState<IVoshodRegionStatus[]>([])
    const [worstFiveRegions, setWorstFiveRegions] = useState<IVoshodRegionStatus[]>([])

    const openObjectMunicipalitiesModal = ((object_id) => {
        setIsModalVisible(true);
        setSelectedObject(regionsStatuses?.find(object => object?.id === object_id));
    });

    const modalStyles = useMemo(() => `
        .ant-modal-content {
            background-color: ${backgroundColor} !important;
            padding: 5 !important;
        }
        .ant-modal {
            padding: 0 !important;
        }
        .ag-body {
            background-color: ${backgroundColor} !important;
        }
    `, [backgroundColor]);

    const [currentDateTime, setCurrentDateTime] = useState(new Date());



    //*Объединенная функция получение данных для главной страницы
    const getData = () => {
        SERVICES_VOSHOD.Models.postRegionStatuses({ filters: filters }).then(resp => {
            if (resp?.success) {
                if (resp?.data) {
                    const data = [...resp.data]

                    data.sort((a, b) => b.dost - a.dost)

                    const highestFive = data.slice(0, 5)

                    const lowestFive = data.slice(-5).sort((a, b) => a.dost - b.dost)

                    setRegionStatuses(resp.data)
                    setTopFiveRegions(highestFive)
                    setWorstFiveRegions(lowestFive)
                }
            }

        })
        setLoading(true)

        getObjectsStatuses({
            'class_id': 10001,
            'codename': 'object_espd',
            filters
        })
            .then(resp => setStatuses(resp.data))
            .finally(() => setLoading(false))

    }

    // useEffect(() => {
    //     setLoading(true)

    //     getObjectsStatuses({
    //         'class_id': 10001,
    //         'codename': 'object_espd',
    //         filters
    //     })
    //         .then(resp => setStatuses(resp.data))
    //         .finally(() => setLoading(false))
    // }, [filters]) //TODo Делать запрос на каждый фильтр

    useEffect(() => {
        getData()
        // SERVICES_VOSHOD.Models.postRegionStatuses({ filters: filters }).then(resp => {
        //     if (resp?.success) {
        //         if (resp?.data) {
        //             const data = [...resp.data]

        //             data.sort((a, b) => b.dost - a.dost)

        //             const highestFive  = data.slice(0, 5)

        //             const lowestFive = data.slice(-5).sort((a, b) => a.dost - b.dost)

        //             setRegionStatuses(resp.data)
        //             setTopFiveRegions(highestFive)
        //             setWorstFiveRegions(lowestFive)
        //         }
        //     }

        // })
    }, [filters])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Обновляем каждую минуту (60000 миллисекунд)

        return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
    }, []);

    const formatDateTime = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} • ${hours}:${minutes}`;
    };

    return (
        <Col
            span={24}
            style={{
                background: backgroundColor2,
                width: '2796px',
            }}
        >
            <div style={{ width: '2796px', display: 'flex' }}>
                <div style={{ width: '300px', flexShrink: 0 }}>
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                            // padding: '28px 32px 16px',
                            width: '300px',
                            flexShrink: 0,
                            height: 1130,
                            borderRadius: '8px 0 8px 8px',
                            padding: '0px 15px',
                            boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px',
                        }}
                    >
                        <ECSimpleFilters
                            mainClassId={10001}
                            fields={filterFields}
                            onChange={setFilters}
                            onRefreshButtonClick={() => { getData() }}

                        />
                    </div>
                </div>
                <div style={{ width: '100%', background: backgroundColor2 }}>
                    <div
                        style={{
                            background: backgroundColor,
                            width: '100%',
                            height: 128,
                            marginBottom: 20,
                            paddingTop: 40,
                        }}
                    >
                        <Text
                            style={{
                                color: color,
                                fontSize: 28,
                                marginLeft: 70,
                            }}
                        >
                            Контроль состояния объектов в режиме реального времени
                        </Text>
                        <Text
                            style={{
                                color: '#999999',
                                fontSize: 16,
                                marginLeft: 70,
                                display: 'block'
                            }}
                        >
                            Обновлено: {formatDateTime(currentDateTime)}

                        </Text>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', marginLeft: 32 }}>
                        <WrapperWidget
                            height={982}
                            style={{
                                backgroundColor: backgroundColor,
                                padding: '28px 32px 16px',
                                width: '343px',
                                flexShrink: 0,
                            }}
                        >
                            {Object.keys(statuses)?.length > 0 && !loading
                                ? <ObjectsStatusList statuses={statuses} />
                                : <ECLoader />}

                        </WrapperWidget>
                        <WrapperWidget
                            height={982}
                            style={{
                                backgroundColor: backgroundColor,
                                padding: '32px 32px 16px',
                                width: '1014px',
                                flexShrink: 0,
                            }}
                        >
                            <Flex justify="center">
                                <div style={{ width: 170 }}>
                                    <ECSimpleFilters
                                        fields={[
                                            {
                                                type: 'attribute',
                                                attribute_id: 10005,
                                                isMultiSelect: false,
                                                tagCloud: false,
                                            }
                                        ]}
                                        mainClassId={10001}
                                        showHeader={false}
                                        onChange={v => console.log('чп чендж', v)}
                                    />
                                </div>
                            </Flex>

                            <ECGridMap
                                objects={regionsStatuses}
                                onClick={openObjectMunicipalitiesModal}
                            />
                            <ECGridMapLegend data={legendData} />
                        </WrapperWidget>
                        <div style={{ width: '985', flexShrink: 0 }}>
                            <WrapperWidget
                                height={400}
                                style={{
                                    backgroundColor: backgroundColor,
                                    padding: '0px 20px',
                                    width: '985px',
                                }}
                            >
                                <MarkoAvaria />
                            </WrapperWidget>
                            <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
                                <WrapperWidget
                                    height={550}
                                    style={{
                                        backgroundColor: backgroundColor,
                                        padding: '0px 20px',
                                        width: '477px',
                                    }}
                                >
                                    <MarkoTop5Table
                                        header="Топ-5 лучших регионов"
                                        onRowClicked={(value) => openObjectMunicipalitiesModal(value?.data?.regionId)}
                                        data={topFiveRegions}
                                        loadingRegions={loading}
                                    />
                                </WrapperWidget>
                                <WrapperWidget
                                    height={550}
                                    style={{
                                        backgroundColor: backgroundColor,
                                        padding: '0px 20px',
                                        width: '477px',
                                    }}
                                >
                                    <MarkoTop5Table
                                        onRowClicked={(value) =>
                                            openObjectMunicipalitiesModal(value?.data?.regionId)}
                                        header="Топ-5 худших регионов"
                                        data={worstFiveRegions}
                                        loadingRegions={loading}
                                    />
                                </WrapperWidget>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DefaultModal2
                closeIcon={null}
                title=""
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                }}
                destroyOnClose
                footer={
                    <div
                        style={{
                            backgroundColor: backgroundColor2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            height: 50,
                            marginTop: -12
                        }}
                    >
                        <Button
                            style={{
                                color: 'rgb(144, 202, 249)',
                                backgroundColor: backgroundColor2,
                                border: 'none',
                                fontSize: '16px',
                            }}
                            onClick={() => setIsModalVisible(false)}
                        >
                            Закрыть
                        </Button>
                    </div>
                }
                width={750}
                // height={650}
                style={{
                    background: '#293448',
                    marginTop: -50,
                    // padding: '0 24px'
                }}
                contentStyles={{
                    marginTop: 40,
                    background: '#293448',
                    padding: 5,

                }}
            // height={950}
            >
                <style>{modalStyles}</style>
                <ProjectRegionalCard row={selectedObject} closeModal={() => setIsModalVisible(false)} />
            </DefaultModal2>
        </Col>
    )
}

export default ProjectMain