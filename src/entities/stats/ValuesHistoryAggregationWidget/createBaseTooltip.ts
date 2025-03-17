import { LegendValues } from './ValuesHistoryAggregationWidget'

/**
 * Формирует базовый туплтип для виджета "История значений" с учетом настроек легенды
 * @param showTime - показывать время или нет
 * @param legend - настройки легенды
 * @returns строку html
 */
export function createBaseTooltip(this: any, showTime = true, legend: LegendValues | undefined) {
    const dt = new Date(this.x).toLocaleString('ru', {
        day: '2-digit',
        month: 'short',                        
        ...(showTime ? ({
            hour: '2-digit',
            minute: '2-digit',
        }) : {})
    // заменяем запятую после даты
    }).replace(',', ' ')

    const sortedPoints = [...this.points.sort((a: any, b: any) => b.y - a.y)]
    const total = this.points.reduce((total: number, point: any) => {
        return total + point.y
    }, 0)

    return `<div style='background-color: #ffffff; border: 1px solid #000000; padding: 10px;'>
        ${
    sortedPoints.reduce((html: string, point: any) => {
        const color = typeof point.color === 'string'
            ? point.color
            : point.color.stops[0][1]

        const percentage = (point.percentage || (point.y / total) * 100).toFixed(1)

        // для абсолютных значений по умолчанию выбрано 'absolute' по умолчанию
        const getPointViewType = () => {
            const localePoint = Math.round(point.y).toLocaleString()
            const units = legend?.legendUnits || ''

            switch (legend?.legendTypeValues) {
                case 'percentage':
                    return `${percentage}%`
                case 'both':
                    return `${localePoint} ${units} (${percentage}%)`
                case 'absolute':
                    return `${localePoint} ${units}`
                default: 
                    return localePoint
                            
            }
        }

        return html + `
                    <div style="display:flex;gap:5px;marginTop:5px;">
                        <div style="backgroundColor: ${color};height:10px;width:10px"></div>
                        <div>${legend?.activeLabelLegend ? `${point.series.name}:` : ''}</div>
                        <div>${getPointViewType()}</div>
                    </div>
                `
        
    }, `<b>${dt}</b><br />`)
}
    </div>`
}