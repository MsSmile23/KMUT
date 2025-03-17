/* eslint-disable @typescript-eslint/no-unused-vars */
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FC, useEffect, useState } from 'react'

interface ILegendSettings {
    units: string
    typeValues: 'both' | 'absolute' | 'percentage'
    isEnabled: boolean
    showNames: boolean
    orientation: 'left' | 'right' | 'top' | 'bottom'
    type: 'callout' | 'horizontal' | 'vertical'
    width: number | string
}

export interface IPieProps {
    settings?: {
        legend?: ILegendSettings
        title?: string
        icon?: IECIconView['icon']
        color?: string
        height?: number
        width?: number
    }
    points: {
        name: string
        y: number
        icon?: IECIconView['icon']
        color?: string
    }[]
} 

export const PieChart: FC<IPieProps> = ({
    settings,
    points
}) => {
    
    const pieOptions: Highcharts.Options = {
        chart: {
            type: 'pie',
        },
        legend: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top',
            layout: 'vertical',
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            type: 'pie',
            data: points
        }]
    }

    return (
        <HighchartsReact 
            highcharts={Highcharts} 
            options={pieOptions}
        />
    )
} 