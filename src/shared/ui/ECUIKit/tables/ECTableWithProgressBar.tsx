import { FC, useLayoutEffect, useRef, useState } from 'react'
import { Col, Progress, Row, Spin, Typography } from 'antd'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

/* 
Входящие параметры:
- data - массив объектов с данными для отображения;
- rightFromTitleView - проценты или абсолютное значение показывать справа от заголовка;
- rightFromProgressBarView - проценты или абсолютное значение показывать справа от ProgressBar;
- precentType - тип отображения процентов: absolute - передаваемый в data (если в data передается поле percent), 
    calculated - вычисляемое значение (по-умолчанию);
- iconColor - цвет иконок;
*/

type TProgressBarData = {
    id: number,
    icon?: IECIconView['icon'],
    count: number,
    value: string,
    percent?: number,
}

interface ITableWithProgressBar {
    data: TProgressBarData[]
    height?: string
    loading?: boolean
    rightFromTitleView?: 'absolute' | 'percent'
    rightFromProgressBarView?: 'absolute' | 'percent'
    precentType?: 'absolute' | 'calculated'
    iconColor?: string
    labelMargin?: number,
    barColor?: string,
    barBackgroundColor?: string
    textColor?: string
}
export const ECTableWithProgressBar: FC<ITableWithProgressBar> = ({
    data,
    height,
    loading,
    rightFromTitleView = 'percent',
    rightFromProgressBarView = 'absolute',
    precentType = 'calculated',
    iconColor = '#FF4E00',
    labelMargin = '16',
    barBackgroundColor,
    barColor,
    textColor,
}) => {
    const sum = data?.reduce(function(acc, obj) {
        return acc + obj.count
    }, 0)

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)

    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])

    return (
        <Col
            span={24}
            style={
                height
                    ? {
                        padding: '5px',
                        height: `${height}px`,
                        overflowY: clientHeight > Number(height) ? 'scroll' : 'auto',
                        overflowX: clientHeight > Number(height) ? 'clip' : 'auto',
                        textAlign: 'center',
                    }
                    : { padding: '5px', textAlign: 'center' }
            }
        >
            {loading && <Spin />}
            <Col ref={ref}>
                {data.map((item, index) => {
                    return (
                        <Row
                            gutter={8}
                            key={`TableWithProgress${index}`}
                            align="middle"
                            style={{ marginBottom: labelMargin + 'px' }}
                        >
                            <Col span={rightFromProgressBarView ? 18 : 24}>
                                <Row justify="space-between" align="middle">
                                    <Typography.Text
                                        style={{
                                            margin: '0',
                                            textAlign: 'left',
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            lineHeight: '9.68px',
                                            color: textColor
                                        }}
                                    >
                                        {item?.icon && (
                                            <ECIconView
                                                style={{ color: iconColor, marginRight: '10px' }}
                                                icon={item.icon}
                                            />
                                        )}
                                        {item?.value}
                                    </Typography.Text>

                                    {rightFromTitleView !== undefined && (
                                        <Typography.Text
                                            style={{
                                                margin: '0',
                                                color: textColor,
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                lineHeight: '9.68px',
                                            }}
                                        >
                                            {rightFromTitleView === 'absolute'
                                                ? item.count
                                                : precentType == 'absolute' && item?.percent
                                                    ? `${item?.percent}%`
                                                    : `${Math.round((item.count * 100) / sum)}%`}
                                        </Typography.Text>
                                    )}
                                </Row>
                                <Progress
                                    size={['100%', 16]}
                                    percent={item?.percent ?? (item.count * 100) / sum}
                                    showInfo={false}
                                    strokeColor={{
                                        '0%': barColor ? barColor : '#2E75FF',
                                        '100%': barColor ? barColor : '#2E75FF',
                                    }}
                                    trailColor={
                                        barBackgroundColor
                                            ? barBackgroundColor
                                            : '#C9EAF8'
                                    }
                                    style={{ margin: 0 }}
                                />
                            </Col>
                            {rightFromProgressBarView !== undefined && (
                                <Col span={6}>
                                    <Typography.Title
                                        level={4}
                                        style={{ margin: '0', color: textColor, fontSize: '16px' }}
                                    >
                                        {rightFromProgressBarView === 'absolute'
                                            ? item.count
                                            : precentType == 'absolute' && item?.percent
                                                ? `${item?.percent}%`
                                                : `${Math.round((item.count * 100) / sum)}%`}
                                    </Typography.Title>
                                </Col>
                            )}
                            {/* <Divider style={{ margin: '5px 0 5px' }} /> */}
                        </Row>
                    )
                })}
            </Col>
        </Col>
    )
}