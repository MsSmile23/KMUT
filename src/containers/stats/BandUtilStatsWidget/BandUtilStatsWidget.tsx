/* eslint-disable */
import { SERVICES_STATS } from "@shared/api/Stats"
import { Row, Col, Typography } from "antd"
import { FC, useEffect, useState } from "react"
import SpeedometerChart from "../SpeedometerChart/SpeedometerChart"
import UtilisationStatsChart from "../UtilisationStatsChart/UtilisationStatsChart"
import VerticalCylinderChart from "../VerticalCylinderChart/VerticalCylinderChart"

export interface IBandUtilStatsWidgetProps {
    dataWidget: {
        mnemo: {
            chartLoading: boolean
            limits: {
                id: number
                description: string
                colors: string
            }[]
            settings: {
                title: string
                updating: boolean,
                updatingInterval: number
                values: any,
                data_source: number,
                visual_representation: number,
                service_type: any,
                subject_type: any
            }
        },
        id: number
    }
}

export interface valueProps {
    value: number,
    status: number
}

export interface valuesProps {
    rcv: valueProps,
    trn: valueProps
}

const BandUtilStatsWidget: FC<IBandUtilStatsWidgetProps> = ({dataWidget}) => {
    // console.log('dataWidget', dataWidget)
    const initialTotal = {rcv: {value: 0, status: 0}, trn: {value: 0, status: 0}}
    const settings = dataWidget.mnemo?.settings
    const limits = dataWidget.mnemo?.limits

    const [values, setValues] = useState<valuesProps>(initialTotal)
    const [isError, setIsError] = useState(false)
    const requestData = () => {
        SERVICES_STATS.Services.renderSource(settings?.data_source)
            .then((response) => {
                // console.log('response', response)
                const {data, success} = response
                if (success && data?.total) {
                    setValues(data.total)
                    setIsError(false)
                } else {
                    setValues({
                        "rcv": {
                            "value": 25,
                            "status": 3
                        },
                        "trn": {
                            "value": 49,
                            "status": 2
                        }
                    })
                    setIsError(false)
                }
            })
    }

    useEffect(() => {
        if (settings?.updating) {
            const i = setInterval(() => {
                requestData()
            }, settings.updatingInterval * 1000)

            return () => {
                clearInterval(i)
            }
        }
    }, [settings?.updating, settings?.updatingInterval, settings?.data_source])

    useEffect(() => requestData(), [settings?.data_source])

    const renderChart = (key, title, value) => {
        switch (key) {
            case 1: {
                return <VerticalCylinderChart
                    value={value}
                    title={title}
                    values={settings?.values}
                    limits={limits}
                />
            }
            case 2: {
                return <SpeedometerChart
                    value={value}
                    title={title}
                    values={settings?.values}
                    limits={limits}
                />
            }
            case 3: {
                return <UtilisationStatsChart
                    value={value}
                    title={title}
                    values={settings?.values}
                    limits={limits}
                />
            }
        }
    }

    return (
        <>
            {isError && <h2 className="stats-widget-title">Ошибка загрузки данных</h2> ||
                <Row
                    style={{
                        marginRight: '2px !important',
                        maxHeight: 200,
                        height: '100%',
                        width: '100%',
                        paddingLeft: 10,
                        paddingRight: 5
                    }}
                    justify={'start'}
                    align={'middle'}
                >
                    <Col 
                        span={8} 
                        style={{
                            backgroundColor: 'white', 
                            whiteSpace: 'pre-line',
                        }}
                    >
                        <Typography.Title level={4}>{settings?.title}</Typography.Title>
                    </Col>
                    <Col
                        span={8}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: 300,
                            height: '100%'
                        }}
                    >
                        {renderChart(settings?.visual_representation, 'Приём', values.rcv)}
                    </Col>
                    <Col
                        span={8}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: 300,
                            height: '100%'
                        }}
                    >
                        {renderChart(settings?.visual_representation, 'Передача', values.trn)}
                    </Col>
                </Row>
            }
        </>
    );
};

export default BandUtilStatsWidget;