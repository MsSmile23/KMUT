/* eslint-disable @typescript-eslint/no-unused-vars */
import AttributeHistoryChartContainer from '@containers/objects/AttributeHistoryChartContainer'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import Highcharts from 'highcharts/highstock'
import { HighchartsReact } from 'highcharts-react-official'
import { PieChartWrapper } from '@shared/ui/charts/highcharts/wrappers'
import { FC, useEffect, useState } from 'react'
import { Col, Popover, Select, Tooltip } from 'antd'
import { IPieProps, PieChart } from './pie'
import { Pie } from './testPie'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'

const piePoints: IPieProps['points'] = [
    {
        name: 'Chrome ChromeChrome',
        y: 61.41,
    }, {
        name: 'InternetExp Explorer',
        y: 11.84
    }, {
        name: 'Firefox',
        y: 10.85
    }, {
        name: 'Edge',
        y: 4.67
    }, {
        name: 'Safari',
        y: 4.18
    }, {
        name: 'Other',
        y: 7.05
    },
    {
        name: 'Chrome',
        y: 61.41,
    }, {
        name: 'Interne346 3 Explorer',
        y: 11.84
    }, {
        name: 'F 32 t5 353irefox',
        y: 10.85
    }, {
        name: 'Edge 23 1',
        y: 4.67
    }, {
        name: 'Saf a21 ri',
        y: 4.18
    }, {
        name: 'Othe35 6y 73r',
        y: 7.05
    }
]

export type ISizes = '300px' | '400px' | '500px' | '600px'
export const TestPieWrapper: FC = () => {
    const attributeIds = [236, 237, 238, 239]
    const fakeData = [
        {
            value: 'В работе',
            count: 3,
            id: 408,
            icon: 'CheckCircleOutlined'
        },
        {
            value: 'Зарегистрирована',
            count: 3,
            id: 407,
            icon: 'EditOutlined'
        },
        {
            value: 'Создана',
            count: 2,
            id: 406,
            icon: 'PlusCircleOutlined'
        },
        {
            value: 'В ожидании',
            count: 2,
            id: 409,
            icon: 'QuestionCircleOutlined'
        },
        {
            value: 'Объект 8 класса 65',
            count: 1,
            id: 424,
            icon: null
        }
    ]
    const [open, setOpen] = useState(false)
    const dimensionsSelectOptions = [
        {
            value: '300px',
            label: '300px'
        },
        {
            value: '320px',
            label: '320px'
        },
        {
            value: '340px',
            label: '340px'
        },
        {
            value: '360px',
            label: '360px'
        },
        {
            value: '380px',
            label: '380px'
        },
        {
            value: '400px',
            label: '400px'
        },
        {
            value: '420px',
            label: '420px'
        },
        {
            value: '440px',
            label: '440px'
        },
        {
            value: '460px',
            label: '460px'
        },
        {
            value: '480px',
            label: '480px'
        },
        {
            value: '500px',
            label: '500px'
        },
        {
            value: '520px',
            label: '520px'
        },
        {
            value: '540px',
            label: '540px'
        },
        {
            value: '560px',
            label: '560px'
        },
        {
            value: '580px',
            label: '580px'
        },
        {
            value: '600px',
            label: '600px'
        },
    ]
    const [dimensions, setDimensions] = useState<{
        width: ISizes,
        height: ISizes
    }>({
        width: '500px',
        height: '500px'
    })

    const changeWidth = (value: ISizes) => {
        setDimensions((state) => ({
            ...state,
            width: value
        })
        )
    }

    const changeHeight = (value: ISizes) => {
        setDimensions((state) => ({
            ...state,
            height: value
        })
        )
    }

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                gap: 16,
                width: '100%',
                padding: 5
            }}
        >
            <div style={{ position: 'absolute', top: 10, right: 10, }} >
                <ECTooltip title="Размеры контейнера">
                    <Popover
                        placement="right"
                        open={open}
                        onOpenChange={setOpen}
                        content={
                            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                <Select
                                    style={{ width: 100 }}
                                    placeholder="Ширина"
                                    defaultValue={dimensions.width}
                                    options={dimensionsSelectOptions}
                                    onChange={changeWidth}
                                />
                                <Select
                                    style={{ width: 100 }}
                                    placeholder="Высота"
                                    defaultValue={dimensions.height}
                                    options={dimensionsSelectOptions}
                                    onChange={changeHeight}
                                />
                            </div>
                        }
                    >
                        <ECIconView icon="SettingOutlined" />
                    </Popover>
                </ECTooltip>
            </div>
            <div 
                style={{ 
                    position: 'relative', 
                    width: dimensions.width,
                    height: dimensions.height
                }}
            >
                <Pie 
                    width={dimensions.width} 
                    height={dimensions.height} 
                    title="asf ;askhfoas fasf 'asf" 
                />
                <div style={{ width: 300, height: 300, backgroundColor: 'lightgrey' }}>
                    <PieChart 
                        settings={{}}
                        points={piePoints}
                    />
                </div>
            </div>
            
            {/* <PieChartWrapper data={fakeData} /> */}
            {/* <PieChartWrapper /> */}
            

        </div>
    )
}