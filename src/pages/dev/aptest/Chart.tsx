/* eslint-disable */
import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory'

const options = {
    title: {
        text: 'My stock chart'
    },
    series: [{
        data: [
            [new Date('01-01-2023').getTime(), 10], 
            [new Date('02-01-2023').getTime(), 20], 
            [new Date('03-01-2023').getTime(), 10]
        ]
    }]
}

const MyStockChart = () => {
    const [ ts, setTs ] = useState<any[]>([])

    useEffect(() => {
        SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById('17').then((r) => {
            const data = r?.data?.data.map(([ ts, v ]) => [ ts * 1000, v ])
            
            console.log(data)

            setTs(data)
        })
    }, [])

    return (
        <HighchartsReact
            highcharts={Highcharts}
            constructorType="stockChart"
            options={{ series: [{ data: ts }] }}
        />
    )
}

export default MyStockChart