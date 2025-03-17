import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { ECSimpleFilters } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/ECSimpleFilters'
import { Button, Col, Row } from 'antd'
import { selectAccount, useAccountStore } from '@shared/stores/accounts';
import { useTheme } from '@shared/hooks/useTheme';
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';
import ECGridMap from '@shared/ui/ECUIKit/maps';
import ECGridMapLegend from '@shared/ui/ECUIKit/maps/ECGridMap/ECGridMapLegend';
import { generalStore } from '@shared/stores/general';
import MarkoTop5Table from '@pages/dev/marko/MarkoDev/NewTable/MarkoTopTables.Components/MarkoTop5Table';
import MarkoAvaria from '@pages/dev/marko/MarkoDev/NewTable/MarkoAvaria';
import { TopRegionsMaxTrafficTable } from './components/TopRegionsMaxTrafficTable/TopRegionsMaxTrafficTable';
import { TopRegionsMinTrafficTable } from './components/TopRegionsMinTrafficTable/TopRegionsMinTrafficTable';
import { TopObjectSumTraffic } from './components/TopObjectSumTraffic/TopObjectSumTraffic';
import { TWidgetSettings } from '@shared/types/widgets';
import { ECSimpleFiltersFieldsProps } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/types';
import { useCallback, useMemo, useState } from 'react';
import { DefaultModal2 } from '@shared/ui/modals';
import UpArrow from '@shared/ui/icons/UpArrow';
import ProjectRegionalCard from '@pages/dev/marko/MarkoDev/Project/ProjectRegionalCard';
import { objectMock } from '../ProjectMain/ProjectMain';

const objects = [
    { id: 1, name: 'СПБ', color: '#98c667', x: 1, y: 1 },
    { id: 89, name: 'СВС', color: '#98c667', x: 2, y: 1 },
    { id: 2, name: 'МСК', color: '#98c667', x: 1, y: 2 },
    { id: 895, name: 'КНГ', color: '#98c667', x: 1, y: 4 },
    { id: 655, name: 'ЗО', color: '#cdcbcc', x: 2, y: 8 },
    { id: 644, name: 'ХО', color: '#cdcbcc', x: 2, y: 9 },
    { id: 5, name: 'ЛЕН', color: '#ffbf00', x: 5, y: 4 },
    { id: 633, name: 'КРАС', color: '#cdcbcc', x: 20, y: 5 },
    { id: 7, name: 'БУР', color: '#ffbf00', x: 14, y: 2 },
    { id: 8, name: 'ДАГ', color: '#cdcbcc', x: 15, y: 1 },
    { id: 9, name: 'ВОЛГ', color: '#ea7b7c', x: 5, y: 1 },
    { id: 276, name: 'КЧР', color: '#98c667', x: 5, y: 10 },
    { id: 89754455, name: 'КАБ', color: '#98c667', x: 5, y: 11 },

    { id: 8974343545, name: 'ЛЕН', color: '#98c667', x: 3, y: 3 },
    { id: 89754445, name: 'ПСК', color: '#ea7b7c', x: 3, y: 4 },
    { id: 8975345435454545, name: 'СМОЛ', color: '#98c667', x: 3, y: 5 },
    { id: 89543557545, name: 'БРЯ', color: '#98c667', x: 3, y: 6 },

    { id: 6444, name: 'ДНР', color: '#cdcbcc', x: 3, y: 8 },
    { id: 6333, name: 'КРЫМ', color: '#98c667', x: 3, y: 9 },

    { id: 14, name: 'НОВГ', color: '#98c667', x: 4, y: 3 },
    { id: 65, name: 'ТВЕР', color: '#ea7b7c', x: 4, y: 4 },
    { id: 76, name: 'КАЛУ', color: '#98c667', x: 4, y: 5 },
    { id: 323, name: 'ОРЛ', color: '#98c667', x: 4, y: 6 },
    { id: 897234234545, name: 'КУР', color: '#98c667', x: 4, y: 7 },
    { id: 89743545, name: 'ЛНР', color: '#cdcbcc', x: 4, y: 8 },
    { id: 822297545, name: 'АДЫГ', color: '#98c667', x: 4, y: 9 },
]
const legendData = [
    { text: 'от 50 ТБ', color: '#98c667' },
    { text: 'от 10 до 50 ТБ', color: '#ffbf00' },
    { text: 'до 10 ТБ', color: '#ea7b7c' },
    // { text: 'Данные отсутствуют', color: '#cdcbcc' },
]

interface IProjectsMapRegions {
    fields: ECSimpleFiltersFieldsProps[];
}

const ProjectsMapRegions = (props: TWidgetSettings<IProjectsMapRegions>) => {
    const filterFields = useMemo(() => {
        return props.settings.widget.fields || [];
    }, [props.settings]);

    const interfaceView = generalStore(st => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    const backgroundColor2 = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'
    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)
        : 'black'

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [selectedObject, setSelectedObject] = useState(null)

    const openObjectMunicipalitiesModal = useCallback((object_id) => {
        setIsModalVisible(true);
        setSelectedObject(objectMock.find(object => object.id === object_id));
    }, []);

    const modalStyles = useMemo(() => `
    .ant-modal-content {
        background-color: ${backgroundColor} !important;
        padding: 0 !important;
    }
    .ant-modal {
        padding: 0 !important;
    }
    .ag-body {
        background-color: ${backgroundColor} !important;
    }
`, [backgroundColor]);

    return (
        <div style={{ width: '100%', backgroundColor: backgroundColor2, padding: 24 }}>
            <Row
                style={{
                    flexWrap: 'nowrap', backgroundColor: backgroundColor, borderRadius: 24,
                }}
            >
                <Col style={{ width: 285 }}>
                    <div
                        style={{
                            padding: 24,
                            borderRadius: 0,
                            height: 500,
                        }}
                    >
                        <ECSimpleFilters
                            mainClassId={10001}
                            hideResetButton
                            fields={filterFields}
                            onApplyClick={v => console.log('=>', v)}
                            // onChange={v => console.log('c =>', v)}
                        />

                        <div style={{ color: textColor, margin: '16px 0' }}>
                            Суммарный трафик региона <br /> (входящий + исходящий)
                        </div>
                        <ECGridMapLegend data={legendData} />
                    </div>
                </Col>
                <Col style={{ flex: 1 }}>
                    <div
                        style={{
                            // backgroundColor: backgroundColor2,
                            borderRadius: 0,
                            height: 850,
                        }}
                    >
                        <h1
                            style={{
                                color: textColor,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                margin: 0,
                                paddingTop: 24,
                            }}
                        >
                            Потребление трафика. Визуализация по регионам
                        </h1>

                        <h4
                            style={{
                                color: textColor,
                                textAlign: 'center',
                                fontWeight: 500,
                                margin: 0,
                                padding: '40px 0 24px',
                            }}
                        >
                            Суммарный трафик (входящий + исходящий) за последние 30 дней составил 10 348.80 ТБ
                        </h4>
                        <div style={{ padding: 24 }}>
                            <div style={{ margin: 'auto', width: 'min-content' }}>
                                <ECGridMap objects={objects} onClick={openObjectMunicipalitiesModal} />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Col span={24} style={{ backgroundColor: backgroundColor2, paddingTop: 40, marginBottom: 30 }}>
                <Row gutter={[16, 0]} justify="space-evenly" style={{ flexWrap: 'nowrap' }}>
                    <Col style={{ minWidth: 700 }}>
                        <div
                            style={{
                                backgroundColor: backgroundColor,
                                padding: '0 16px',
                                paddingBottom: 16,
                                borderRadius: 24,
                            }}
                        >
                            <TopRegionsMaxTrafficTable />
                        </div>
                    </Col>
                    <Col style={{ minWidth: 700 }}>
                        <div
                            style={{
                                backgroundColor: backgroundColor,
                                padding: '0 16px',
                                borderRadius: 24,
                                paddingBottom: 16,
                            }}
                        >
                            <TopRegionsMinTrafficTable />
                        </div>
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <div
                    style={{
                        backgroundColor: backgroundColor,
                        padding: '0 16px',
                        minWidth: 1300,
                        borderRadius: 24,
                    }}
                >
                    <TopObjectSumTraffic />
                </div>
            </Col>

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
                width="60vw"
                height={650}
                style={{
                    backgroundColor: backgroundColor,
                    marginTop: -50,
                }}
                contentStyles={{
                    marginTop: 40,
                }}
            >
                <style>{modalStyles}</style>
                <ProjectRegionalCard row={selectedObject} closeModal={() => setIsModalVisible(false)} />
            </DefaultModal2>

        </div>
    )
}

export default ProjectsMapRegions;