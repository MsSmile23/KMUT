import { getAttributeHistoryById }
    from '@shared/api/AttributeHistory/Models/getAttributeHistoryById/getAttributeHistoryById'
import { IObjectAttribute } from '@shared/types/objects'
import { Row, Col } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import base64 from 'base-64'
import DateTimePickerWithNav from '@shared/ui/pickers/DateTimePickerWithNav/DateTimePickerWithNav'
import { formatDataUTC } from '@shared/utils/objects'


const OAHistoryLog: FC<{
    height: number
    objectAttribute?: IObjectAttribute
}> = ({ height = 400, objectAttribute }) => {
    const [dataArr, setDataArr] = useState<any[]>([])
    const [contentData, setContentData] = useState<any>(null)

    // useEffect(() => {
    //     getAttributeHistoryById({ id: objectAttribute?.id }).then((resp) => {
    //         const data2 = resp?.data?.series[0]?.data

    //         // console.log('data', data, objectAttribute)
    //         // const data = [...formatDataUTC(data2)]

    //         // const localDataArr: any[] = []

    //         // data.forEach((item) => {
    //         //     const string = item[1]

    //         //     const time = item[0]
    //         //     const content = string

    //         //     localDataArr.push({ time: time, content: content })
    //         // })
    //         // setDataArr(localDataArr)
    //     })

    //     // setContentData(content)
    // }, [objectAttribute])

    ///&Тестовая 

    // useEffect(() => {


    //     const data = [...formatDataUTC(test3)]

    //     const localDataArr: any[] = []
    
    //     data.forEach((item) => {
    //         const string = item[1]
    
    //         const time = item[0]
    //         const content = string
    
    //         localDataArr.push({ time: time, content: content })
    //     })
    //     setDataArr(localDataArr)
    // }, [])
  

    ///&Тестовая 

    //Формирование текста

    const renderText = useMemo(() => {
        if (dataArr !== undefined) {
            const tmp = contentData

            try {
                let decoded = 'Расшифровываем данные...'

                if (tmp) {
                    try {
                        decoded = base64.decode(tmp)
                    } catch (e) {
                        //console.log('LogChart ERROR', e, tmp)
                    }
                }

                return decoded.split(/\r?\n|\r|\n/g)?.map((title) => {
                    return (
                        <>
                            {title}
                            <br />
                        </>
                    )
                })
            } catch (e) {
                console.error('Ошибка декодирования', e)

                return 'Не удалось расшифровать данные'
            
            }

            // return ''
        }
    }, [dataArr, contentData])

    //Скачивание файла

    return (
        <div className="logCharts" style={{ height: height ? '100%' : '', borderRadius: '0 0 16px 16px' }}>
            <Col span={24}>
                <DateTimePickerWithNav
                    dataArr={dataArr}
                    setContentData={setContentData}
                    objectAttribute={objectAttribute}
                    downloadButton
                >
                    <div className="logCharts__content">
                        <Row style={{ height: '100%' }}>
                            <Col
                                span={24}
                                className="logCharts__content_main_before"
                                style={{
                                    fontSize: '10px',
                                    height: height ?? '358px',
                                    borderRadius: '0 0 16px 16px',
                                    color: '#ffffff',
                                    background: '#000000',
                                    marginTop: '5px',
                                    padding: '10px',
                                }}
                            >
                                {renderText}
                            </Col>
                        </Row>
                    </div>
                </DateTimePickerWithNav>
            </Col>
        </div>
    )
}

export default OAHistoryLog