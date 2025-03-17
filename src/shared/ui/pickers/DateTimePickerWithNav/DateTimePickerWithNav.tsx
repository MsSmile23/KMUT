import { Row, Col, Button, Select } from 'antd'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { IObjectAttribute } from '@shared/types/objects'
import base64 from 'base-64'
import { DoubleLeftOutlined, DoubleRightOutlined, DownloadOutlined } from '@ant-design/icons'
type optionType = {
    label: string
    value: string
}
interface IMetricDataLogWrapper {
    dataArr: any[]
    setContentData: any
    children: React.ReactNode
    objectAttribute?: IObjectAttribute
    downloadButton?: boolean
}

const DateTimePickerWithNav: FC<IMetricDataLogWrapper> = ({
    dataArr,
    setContentData,
    objectAttribute,
    downloadButton = false,
    children,
}) => {
    const [options, setOptions] = useState<optionType[]>([])
    const [valueDate, setValueDate] = useState<number>(0)

    const lastIndex = useMemo(() => dataArr.lastIndexOf(dataArr[dataArr.length - 1]), [dataArr])

    useEffect(() => {
        dataArr.forEach((item, index) => {
            setOptions((prev: optionType[]) => [...prev, { label: String(item?.time), value: String(index) }])
        })

        if (setContentData !== undefined) {
            setContentData(null)
        }

        setValueDate(lastIndex)
    }, [dataArr])

    const exportFile = useCallback(() => {
        if (dataArr !== undefined) {
            let data = `Атрибут №${objectAttribute?.id}\n${objectAttribute?.attribute?.name}\n\n`

            dataArr.forEach((item) => {
                let decoded = 'Не удалось расшифровать данные'

                try {
                    decoded = base64.decode(item?.content)
                } catch (e) {
                    //console.log('LogChart ERROR', e, item)
                }
                data += `Дата: ${item?.time}\n${decoded}\n\n`
            })
            const blob = new Blob([data], { type: 'text/plain', endings: 'native' })
            const url = URL.createObjectURL(blob)
            const nameFile = `metric_${objectAttribute?.id}_data_${options[0]?.label}-${options[lastIndex]?.label}.txt`

            return {
                url,
                nameFile,
            }
        }
    }, [dataArr, objectAttribute, options])

    //Выбор дат в селекте
    const onChangeDate = (value) => {
        setContentData(null)
        setValueDate(Number(value))
    }

    //Сдулеющая дата
    const nextDate = () => {
        if (valueDate < lastIndex) {
            if (setContentData !== undefined) {
                setContentData(null)
            }
            setValueDate((prev) => prev + 1)
        }
    }

    //Предыдущая дата
    const prevDate = () => {
        if (valueDate !== 0) {
            if (setContentData !== undefined) {
                setContentData(null)
            }
            setValueDate((prev) => prev - 1)
        }
    }

    useEffect(() => {
        if (dataArr[valueDate]?.content !== undefined) {
            if (setContentData !== undefined) {
                setContentData(dataArr[valueDate]?.content)
            }
        }
    }, [valueDate])

    return (
        <>
            <Row style={{ backgroundColor: '#ffffff' }} justify="center" gutter={10} className="logCharts__nav-bar">
                {downloadButton && (
                    <Button
                        href={exportFile()?.url}
                        download={exportFile()?.nameFile}
                        icon={<DownloadOutlined />}
                        size="middle"
                        shape="circle"
                        color="green"
                        style={{ position: 'absolute', left: 10, background: '#52C41A', color: '#ffffff' }}
                    />
                )}

                <Col span={5} className="logCharts__nav-bar_left-icon">
                    <Button
                        shape="round"
                        style={{
                            backgroundColor: valueDate !== 0 ? '#52C41A' : '#bfbfbf',
                            borderColor: valueDate !== 0 ? '#52C41A' : '#bfbfbf',
                            color: valueDate !== 0 ? '#ffffff' : 'grey',
                            width: '100%',
                            borderRadius: '16px',
                        }}
                        onClick={prevDate}
                        disabled={valueDate === 0}
                    >
                        <DoubleLeftOutlined />
                    </Button>
                </Col>
                <Col span={6} className="logCharts__nav-bar_date">
                    <Select
                        options={options}
                        placeholder="Дата"
                        className="logCharts__nav-bar_date_select"
                        onChange={onChangeDate}
                        value={String(valueDate) || undefined}
                        style={{ width: '100%', textAlign: 'center' }}
                    />
                </Col>
                <Col span={5} className="logCharts__nav-bar_right-icon">
                    <Button
                        style={{
                            backgroundColor: valueDate < lastIndex ? '#52C41A' : '#bfbfbf',
                            borderColor: valueDate < lastIndex ? '#52C41A' : '#bfbfbf',
                            color: valueDate < lastIndex ? '#ffffff' : 'grey',
                            width: '100%',
                            borderRadius: '16px',
                        }}
                        shape="round"
                        onClick={nextDate}
                        disabled={valueDate === lastIndex}
                    >
                        <DoubleRightOutlined />
                    </Button>
                </Col>
            </Row>

            {children}
        </>
    )
}

export default DateTimePickerWithNav