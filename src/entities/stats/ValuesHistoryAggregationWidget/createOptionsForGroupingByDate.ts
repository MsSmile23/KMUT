import { LegendValues } from './ValuesHistoryAggregationWidget';
import { createBaseTooltip } from './createBaseTooltip';
import { ILineChart } from './lineChartProps';

export const createOptionsForGroupingByDate = (o: ILineChart, data?: any, legend?: LegendValues) => ({
    ...o,
    legend: {
        ...o.legend,
        enabled: legend?.activeLegend ?? true,
    },
    yAxis: {
        ...o.yAxis,
        crosshair: false,
    },
    xAxis: {
        ...o.xAxis,
        crosshair: false,
        tickInterval: data?.groupBy === 'day' ? 1000 * 60 * 60 * 24 : undefined,
    },
    tooltip: {
        ...o.tooltip,
        //shape: "rect",
        // eslint-disable-next-line space-before-function-paren
        formatter: function (this: any) {
            return createBaseTooltip.call(this, Boolean(data?.groupBy !== 'day'), legend);
        },
    },
});