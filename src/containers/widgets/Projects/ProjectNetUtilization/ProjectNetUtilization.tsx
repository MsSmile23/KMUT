import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { ECSimpleFilters } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/ECSimpleFilters'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { NetUtilizationTable } from './components/NetUtilizationTable'
import { Button, Col, Divider, Flex, Row } from 'antd'
import './ProjectNetUtilization.css'
import { useMemo } from 'react'

const ProjectNetUtilization = (props) => {
    const filterFields = useMemo(() => {
        return props?.settings?.widget?.fields || [];
    }, [props.settings]);

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    const backgroundColor2 = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'
    const textColor = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'

    return (
        <Flex vertical style={{ width: '100%' }}>
            <Row style={{ width: '100%', backgroundColor: backgroundColor2, padding: 24 }}>
                <Col span={24} >
                    <div>
                        <h1
                            style={{
                                paddingLeft: 130,
                                color: textColor,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                margin: 0,
                                paddingBottom: 24,
                            }}
                        >
                            Утилизация сети (измерения по загрузке каналов)
                        </h1>
                    </div>
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                            padding: 16,
                            width: '1780px',
                            borderRadius: 6,
                        }}
                    >
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                                className="ProjectNetUtilization_download"
                                style={{
                                    padding: '3px 9px',
                                    height: 37,
                                    borderRadius: 4,
                                    fontSize: 14,
                                    boxShadow: `
                                rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
                                rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
                                rgba(0, 0, 0, 0.12) 0px 1px 5px 0px
                            `,
                                    marginTop: 12,
                                    marginBottom: 4,
                                    border: 'none',
                                    width: 147,
                                    margin: '16px 8px',
                                }}
                            >
                                Скачать
                            </Button>
                        </div>
                        <div style={{ maxWidth: 1765, height: '100%' }}>
                            <ECSimpleFilters
                                align="horizontal"
                                mainClassId={10001}
                                fields={filterFields}
                                // onApplyClick={v => console.log('=>', v)}
                                onChange={v => console.log('c =>', v)}
                                onRefreshButtonClick={v => console.log('r =>', v)}
                            />

                            <div style={{ marginTop: 8 }}>
                                Всего записей: 1 240; Данные за 7 дней с 05.02.2025 по 11.02.2025
                            </div>

                            <Divider style={{ backgroundColor: '#ffffff22', margin: '16px 0' }} />

                            <div style={{ paddingBottom: 40 }}>
                                <span
                                    style={{
                                        color: '#FF0000',
                                        marginRight: 4,
                                        fontFamily: 'Arial',
                                        fontSize: 14,
                                        lineHeight: '10px',
                                    }}
                                >
                                    ⬆
                                </span>
                                - требует расширения канала
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row style={{ width: '100%', backgroundColor: backgroundColor2, padding: 24 }}>
                <Col span={24}>
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                            padding: 16,
                            marginBottom: 48,
                            borderRadius: 6,
                        }}
                    >
                        <NetUtilizationTable />
                    </div>
                </Col>
            </Row>
        </Flex>

    )
}

export default ProjectNetUtilization;