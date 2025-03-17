/* eslint-disable max-len */
import { FC, useState, useEffect } from 'react'
import WrapperMetricData from '@shared/ui/wrappers/WrapperMetricData/WrapperMetricData';
import { ECColorfulText } from '@shared/ui/text/ECColorfulText/ECColorfulText';
import { getAttributeHistoryById } from '@shared/api/AttributeHistory/Models/getAttributeHistoryById/getAttributeHistoryById';
import { formatDataUTC } from '@shared/utils/objects';
import { IObjectAttribute } from '@shared/types/objects'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';
import { IAttributeHistoryDateIntervalForGet } from '@shared/types/attribute-history'

type TOAttrWrapper = {
    objectAttribute: IObjectAttribute,
    height?: number,
    dateInterval?: IAttributeHistoryDateIntervalForGet
    limit?: number
}

export const OAttrHistoryText: FC<TOAttrWrapper> = ({ objectAttribute, height, dateInterval, limit }) => {
    const limitPayload = limit ? { limit } : {}
    
    const [data, setData] = useState<any[]>([])
    const [contentData, setContentData] = useState<any>([])
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

    useEffect(() => {
        getAttributeHistoryById({ id: objectAttribute.id, ...limitPayload }).then((resp) => {
            const data2 = resp?.data?.series[0]?.data

            const data = [...formatDataUTC(data2)]

            const localDataArr: any[] = []

            data.forEach((item) => {
                const string = item[1]

                const time = item[0]
                const content = string

                localDataArr.push({ time: time, content: content })
            })
            setData(localDataArr)
            setIsLoadingData(false)
        })
    }, [objectAttribute])

    useEffect(() => {
        if (dateInterval && dateInterval[0] && dateInterval[1]) {
            getAttributeHistoryById({ id: objectAttribute.id, start: dateInterval[0], end: dateInterval[1], ...limitPayload }).then((resp) => {
                const data2 = resp?.data?.series[0]?.data

                const data = [...formatDataUTC(data2)]

                const localDataArr: any[] = []

                data.forEach((item) => {
                    const string = item[1]

                    const time = item[0]
                    const content = string

                    localDataArr.push({ time: time, content: content })
                })
                setData(localDataArr)
            })
        }
    }, [dateInterval])


    if (!data || isLoadingData) {
        return (
            <div
                style={{
                    maxHeight: `${height || 400}px`,
                    height: '100%',
                    minHeight: `${height || 400}px`,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff'
                }}
            >
                <CustomPreloader size="default" />
            </div>
        )
    }

    if (data.length < 1 && !isLoadingData) {
        return (
            <div
                style={{
                    maxHeight: `${height || 400}px`,
                    height: '100%',
                    minHeight: `${height || 400}px`,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff'
                }}
            >
                <div>Нет данных за период</div>
            </div>
        )
    }

    return (
        <div style={{ maxHeight: `${height || 400}px`, height: '100%', minHeight: `${height || 400}px`, position: 'relative' }}>
            {data && data.length > 0 && (
                <WrapperMetricData setContentData={setContentData} data={data} objectAttribute={objectAttribute}>
                    {contentData && (
                        <div style={{ maxHeight: `calc(${height || 400}px - 52px)`, overflowY: 'auto', overflowX: 'auto', backgroundColor: '#000' }}>
                            <ECColorfulText backgroundColor="#000" textColor="#fff" format="json" content={contentData} />
                        </div>
                    )}
                </WrapperMetricData>
            )}
        </div>
    )
}