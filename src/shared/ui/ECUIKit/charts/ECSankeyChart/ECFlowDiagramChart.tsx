/* eslint-disable max-len */
import { FC } from 'react'
import { CommonChart } from '@shared/ui/charts/highcharts/CommonChart';
import { IChartTypes } from '@shared/ui/charts/highcharts/types';
import Highcharts from 'highcharts';

const defaultOptions: Highcharts.Options = {
    credits: {
        enabled: false
    },
    navigator: {
        enabled: false
    },
    rangeSelector: {
        enabled: false
    }, 
    scrollbar: { 
        enabled: false 
    }
}

const mokupSankeyData = {
    nodes: [
        { id: 'A' },
        { id: 'B' },
        { id: 'C' },
        { id: 'I' }
    ],
    links: [
        ['A', 'B', 5],
        ['C', 'B', 1],
        ['I', 'B', 1],
    ]
};

export const ECFlowDiagramChart: FC = () => {

    return (
        <CommonChart
            seriesData={{
                type: 'sankey',
                data: mokupSankeyData.links,
                nodes: mokupSankeyData.nodes
            }}
            constructorType="chart"
            customOptions={defaultOptions}
            chartType={IChartTypes.SANKEY}       
        />
    )
}