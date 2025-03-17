import { Select } from '@shared/ui/forms'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Row } from 'antd'
import { FC, useEffect, useState } from 'react'

interface IECSelectColorsFromScheme {
    colors: { mnemo: string; name: string; color: string; colors?: any[] }[]
    value?: string
    onChange?: any
}

const ECSelectColorsFromScheme: FC<IECSelectColorsFromScheme> = ({ colors, value, onChange }) => {
    // const [chosenColor, setChosenColor] = useState<string>('')
    const [options, setOptions] = useState<{ label: string; value: any }[]>([])

    // useEffect(() => {
    //     if (value) {
    //         setChosenColor(value)
    //     }
    // }, [])

    // useEffect(() => {
    //     onChange(chosenColor)
    // }, [chosenColor])
    useEffect(() => {
        const localOptions: any[] = []

        colors?.forEach((item) => {
            localOptions.push({
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {item.name}
                        <div style={{ display: 'flex' }}>
                            {item?.colors?.map((color) => {
                                return (
                                    <ECTooltip title={color.name} key={color.mnemo}>
                                        <div
                                            style={{
                                                // borderRadius: '20px',
                                                background: color.color,
                                                width: '20px',
                                                border: '1px solid rgba(0, 0, 0, 0.14)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '20px',
                                                marginRight: '5px',
                                            }}
                                        >
                                        </div>
                                    </ECTooltip>
                                )
                            })}
                        </div>
                    </div>
                ),
                value: item.mnemo,
            })
            setOptions(localOptions)
        })
    }, [colors])

    return (
        <Row align="middle" gutter={8}>
            <Col span={24}>
                <Select
                    onClear={() => {
                        onChange('')
                    }}
                    value={value}
                    style={{ marginRight: '10px' }}
                    options={options}
                    onChange={(e) => {
                        onChange(e ?? '')
                    }}
                />
            </Col>
        </Row>
    )
}

export default ECSelectColorsFromScheme