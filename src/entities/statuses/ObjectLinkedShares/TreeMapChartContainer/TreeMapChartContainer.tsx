import { FC, useState, useEffect } from 'react'
import { TTreeMapChartContainer } from '@entities/statuses/ObjectLinkedShares/TreeMapChartContainer/types'
import { ECTreeMapChart } from '@shared/ui/ECUIKit/charts'


export const TreeMapChartContainer: FC<TTreeMapChartContainer> = ({
    data,
    height,
    width,
    valueDisplayType = 'absolute'
}) => {

    const [seriesDataTreemap, setSeriesDataTreemap] = useState<Highcharts.SeriesTreemapOptions['data']>(null)
    const [seriesTooltipTreemap, setSeriesTooltipTreemap] = useState<Highcharts.SeriesTreemapOptions['tooltip']>({
        pointFormat: '{point.name}<br />Количество: <b>{point.value} ({point.procent}%)</b>'
    })
    const [seriesLabelsTreemap, setSeriesLabelsTreemap] = useState<Highcharts.SeriesTreemapOptions['dataLabels']>([{
        align: 'center',
        format: '{point.name}<br /> Количество: {point.value} ({point.procent}%)'
    }])

    const [totalDataCount, setTotalDataCount] = useState<number>(0);

    useEffect(() => {

        setTotalDataCount(data.reduce((totalCount, currentValue) => {
            return totalCount + currentValue.count;
        }, 0))

        setSeriesDataTreemap(data.reduce((seriesData, dataAttr) => {

            const attributeValueInSeries = seriesData.find(item => item.name === dataAttr.value)

            if (!attributeValueInSeries) {
                seriesData.push({
                    name: `${dataAttr.value}`,
                    color: dataAttr.color,
                    value: dataAttr.count,
                    percent: Number((dataAttr.count / totalDataCount) * 100).toFixed(1)
                })
            }

            if (attributeValueInSeries) {
                const attributeValueInSeriesIndex = seriesData.findIndex(item => item.name === dataAttr.value)

                seriesData[attributeValueInSeriesIndex].value += dataAttr.count;
                seriesData[attributeValueInSeriesIndex].percent = 
                Number((seriesData[attributeValueInSeriesIndex].value / totalDataCount) * 100).toFixed(1)
            }

            return seriesData
        }, []))

    }, [data])

    useEffect(() => {
        if (valueDisplayType === 'absolute') {
            setSeriesLabelsTreemap([{
                align: 'center',
                format: '{point.name}<br /> Количество: {point.value}'
            }])
            setSeriesTooltipTreemap({
                pointFormat: '{point.name}<br />Количество: <b>{point.value}</b>'
            })
        }

        if (valueDisplayType === 'percent') {
            setSeriesLabelsTreemap([{
                align: 'center',
                format: '{point.name}<br /> Количество: {point.percent}%'
            }])
            setSeriesTooltipTreemap({
                pointFormat: '{point.name}<br />Количество: <b>{point.percent}%</b>'
            })
        }

        if (valueDisplayType === 'combine') {
            setSeriesLabelsTreemap([{
                align: 'center',
                format: '{point.name}<br /> Количество: {point.value} ({point.percent}%)'
            }])
            setSeriesTooltipTreemap({
                pointFormat: '{point.name}<br />Количество: <b>{point.value} ({point.percent}%)</b>'
            })
        }
    }, [data, valueDisplayType])

    // eslint-disable-next-line max-len
    return <ECTreeMapChart data={seriesDataTreemap} height={height} width={width} dataLabels={seriesLabelsTreemap} tooltip={seriesTooltipTreemap} />
}