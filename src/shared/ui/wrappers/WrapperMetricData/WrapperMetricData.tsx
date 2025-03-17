import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { ECUIKit } from '@shared/ui'
import { Select } from '@shared/ui/forms/Select/Select'
import { Button, Col, Row } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'

interface IWrapperMetricData {
    data: { content: any; time: any }[]
    setContentData: React.Dispatch<any>
    children?: any,
    allowDownload?: boolean
    objectAttribute?: any
}

type optionType = {
    label: string
    value: string
}

const formatText = (str) => {
    return str.replace(/[.: ]/g, '_')
}

const STARTING_POSITION_ELEMENT = 0

//Добавить loader
const WrapperMetricData: FC<IWrapperMetricData> = ({ data, setContentData, children, objectAttribute }) => {
    const [options, setOptions] = useState<optionType[]>([])
    const [valueDate, setValueDate] = useState<number>(0)


    const lastIndex = useMemo(() => data.lastIndexOf(data[data.length - 1]), [data])

    useEffect(() => {
        setOptions(data.map((item, index) => ({ 
            label: String(item?.time), 
            value: String(index), key: `option_${index}` 
        })))
        setContentData(null)
        setValueDate(data?.length - 1)
    }, [data, objectAttribute])

    //Выбор дат в селекте
    const onChangeDate = (value) => {
        setContentData(null)
        setValueDate(Number(value))      
    }

    //Следующая дата
    const prevDate = () => {
        if (valueDate < lastIndex) {
            setContentData(null)
            setValueDate((prev) => prev + 1)
        }
    }

    //Предыдущая дата
    const nextDate = () => {
        if (valueDate !== 0) {
            setContentData(null)
            setValueDate((prev) => prev - 1)
        }
    }

    const downloadData = () => {
        const currentData = data.filter((dataItem, index) => index === valueDate)[0]
        
        const content = `Метка времени: ${currentData.time}\nКонтент:\n${JSON.stringify(currentData.content, null, 4)}`

        const virtualDownloadElement = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });

        virtualDownloadElement.href = URL.createObjectURL(file);
        // eslint-disable-next-line max-len
        virtualDownloadElement.download = `Измерение_${formatText(objectAttribute?.oa?.attribute.name)}_${objectAttribute.id}_${formatText(currentData.time)}.txt`;
        document.body.appendChild(virtualDownloadElement);
        virtualDownloadElement.click();
        document.body.removeChild(virtualDownloadElement);     
    }

    useEffect(() => {
        if (data[valueDate]?.content !== undefined) {
            setContentData(data[valueDate]?.content)
        }
    }, [valueDate])

    return (
        <>
            <Row
                style={{
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    position: 'relative',
                    margin: 0
                }}
                justify="center"
                gutter={10}
            >
                <Col style={{ position: 'absolute', left: 0 }}>
                    <ECUIKit.common.ECButtonDownload format="txt" onClick={downloadData} />
                </Col>
                <Col className="logCharts__nav-bar_left-icon">
                    <Button
                        color={valueDate === 0 ? 'grey' : '52C41A'}
                        style={{
                            backgroundColor: valueDate === 0 ? '#CBCBCB' : '#52C41A',
                            borderColor: '#52C41A',
                            color: '#ffffff',
                        }}
                        shape="circle"
                        onClick={nextDate}
                        disabled={valueDate === 0}
                    >
                        <DoubleLeftOutlined />
                    </Button>
                </Col>
                <Col>
                    <Select
                        options={options}
                        placeholder="Дата"
                        onChange={onChangeDate}
                        value={String(valueDate) || undefined}
                        allowClear={false}
                        showSearch={true}
                    />
                </Col>
                <Col>
                    <Button
                        color={valueDate < lastIndex ? '#52C41A' : 'grey'}
                        shape="circle"
                        style={{
                            backgroundColor: valueDate < lastIndex ? '#52C41A' : '#CBCBCB',
                            borderColor: '#52C41A',
                            color: '#ffffff',
                        }}
                        onClick={prevDate}
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

export default WrapperMetricData