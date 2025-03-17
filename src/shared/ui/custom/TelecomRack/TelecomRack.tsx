import { FC, ReactElement, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Card, Col, Divider, Progress, Row, Skeleton, Space, Tag, Typography } from 'antd'
import { UnitRackConditions } from '@shared/ui/custom/TelecomRack/UnitRackConditions/UnitRackConditions'
import { UnitRackTable } from '@shared/ui/custom/TelecomRack/UnitRackTable/UnitRackTable'
import { green } from '@ant-design/colors'
import './TelecomRack.css'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
import { selectObjectStateEntity, useStateEntitiesStore } from '@shared/stores/state-entities'
import { getStateViewParamsWithDefault } from '@shared/utils/states'

export interface ITelecomRackInterface {
    parentObjectId: number
    rackName: string
    rackSize: number
    temperature?: number
    humidity?: number
    currentPower?: number
    maxPower?: number
    placementsWithDevices: {
        id: number
        name: string
        devices: {
            id: number
            name: string
            size: number
            order: number
            placementId: number
            component?: ReactElement
        }[]
    }[]
    backgroundColor?: string
    loading?: boolean
    width?: number
    unitsDirection?: 'direct' | 'reverse'
    onDeviceClick?: (deviceId: number) => void
}

export const TelecomRack: FC<ITelecomRackInterface> = (props) => {
    const {
        parentObjectId,
        rackName,
        rackSize,
        temperature,
        humidity,
        currentPower,
        maxPower,
        placementsWithDevices,
        loading,
        width,
        unitsDirection,
        onDeviceClick,
    } = props
    // TODO получать viewParams из стейта объекта
    const getObjState = useStateEntitiesStore(selectObjectStateEntity)
    const objState = getObjState(parentObjectId)

    const stateStyle = getStateViewParamsWithDefault(objState)

    // const theme = useTheme()
    // const accountData = useAccountStore(selectAccount)
    // const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    // const interfaceView = generalStore(st => st.interfaceView)
    // const isShowcase = interfaceView === 'showcase'

    // const color = isShowcase
    //     ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
    //     : '#000000'
    // const background = isShowcase
    //     ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || '#ffffff'
    //     : 'white'

    //Цвета для стойки
    const colors = useMemo(
        () => ({
            border: stateStyle.border,
            background: stateStyle.fill,
            textColor: stateStyle.textColor,
        }),
        [stateStyle]
    )

    const [rackWidth, setRackWidth] = useState(0)
    const rackRef = useRef<HTMLDivElement | null>(null)
    const enoughWidth = (Number(width) || rackWidth) >= 450 && rackName?.length <= 30

    //Проверяем значения на isNan (для отображения мощности, влажности и т.д.)
    const isNumber = (value) => !Number.isNaN(Number(value))

    useLayoutEffect(() => {
        setRackWidth(rackRef.current?.getBoundingClientRect?.()?.width || 0)
    }, [])

    return (
        <div className="rack-container">
            {placementsWithDevices?.map((obj, index) => (
                <div key={index} style={{ flex: '1 1', width: 260, paddingBottom: 20 }} className="rack-custom-table">
                    {obj?.name && (
                        <p
                            style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            {obj?.name}
                        </p>
                    )}
                    <Row
                        ref={rackRef}
                        gutter={[0, 8]}
                        className="rack"
                        style={{
                            border: `1px solid ${colors?.border}`,
                            background: colors?.background,
                            width,
                        }}
                    >
                        <Col xs={24}>
                            <Row align="middle" justify="space-between">
                                <Col flex="1 0" className="rack-name" style={{ color: colors?.textColor }}>
                                    {loading ? 'Загрузка...' : rackName}
                                </Col>

                                {temperature !== undefined && humidity !== undefined && enoughWidth && (
                                    <Col flex="0 1">
                                        <UnitRackConditions
                                            temperature={{ color: 'green', value: temperature }}
                                            humidity={{ color: 'orange', value: humidity }}
                                            loading={loading}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Col>

                        {maxPower !== undefined &&
                            isNumber(maxPower) &&
                            currentPower !== undefined &&
                            isNumber(currentPower) && (
                            <>
                                <Col xs={24} className="rack-power-title">
                                    {loading ? (
                                        <Skeleton.Button active block size="small" />
                                    ) : (
                                        <Space>
                                            <Typography.Text style={{ color: 'inherit' }}>
                                                    Потребление мощности:
                                            </Typography.Text>
                                            <Tag color="green">
                                                {Math.round((currentPower / maxPower) * 100) || 0}%
                                            </Tag>
                                        </Space>
                                    )}
                                </Col>
                                <Col xs={24} className="rack-power-bar">
                                    {loading ? (
                                        <Skeleton.Button active block />
                                    ) : (
                                        <Progress
                                            format={(percent) => <Tag color={green[6]}>{`${percent} %`}</Tag>}
                                            style={{ margin: 0, padding: 4 }}
                                            size={[rackWidth - 30, 20]}
                                            strokeColor={green[6]}
                                            percent={Math.round((currentPower / maxPower) * 100)}
                                            showInfo={false}
                                        />
                                    )}
                                </Col>
                            </>
                        )}

                        <Divider style={{ margin: 2, backgroundColor: 'white' }} />
                        <Col xs={24}>
                            <Card bodyStyle={{ padding: 2 }}>
                                <UnitRackTable
                                    rackSize={Number(rackSize)}
                                    devices={obj.devices}
                                    loading={loading}
                                    unitsDirection={unitsDirection}
                                    onDeviceClick={onDeviceClick}
                                />
                            </Card>
                        </Col>
                        <Col xs={24}>
                            <div style={{ textAlign: 'center', color: colors?.textColor }}></div>
                        </Col>
                    </Row>
                </div>
            ))}
        </div>
    )
}