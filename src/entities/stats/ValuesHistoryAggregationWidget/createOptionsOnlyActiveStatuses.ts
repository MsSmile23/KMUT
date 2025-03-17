import { ILineChart } from './lineChartProps'

export const createOptionsForOnlyActiveStatuses = (o: ILineChart, modifiedSeries: any[]) => ({ 
    ...o, 
    series: modifiedSeries.map((serie) => {
        return {
            ...serie,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            data: serie.data.filter(([ _dt, y ]) => y > 0)
        }
    }).filter((serie) => serie.data.length > 0),
    plotOptions: {
        ...o.plotOptions,
        series: {
            ...o.plotOptions?.series,
            minPointLength: 4
        }
    }
    // todo: typing
}) as any