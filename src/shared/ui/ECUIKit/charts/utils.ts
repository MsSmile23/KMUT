/**
 * 
 * @param params  - позиционирование легенды графика
 * @returns Возвращает два параметра положения легенды
 */

type TSetLegendPosition = (params: 'left' | 'right' | 'top' | 'bottom') => {
    align: Highcharts.LegendOptions['align'],
    verticalAlign: Highcharts.LegendOptions['verticalAlign']
}
export const setLegendPosition: TSetLegendPosition = (params) => {
    switch (params) {
        case 'left': {
            return {
                align: 'left',
                verticalAlign: 'middle'
            }
        }
        case 'right': {
            return {
                align: 'right',
                verticalAlign: 'middle'
            }
        }

        case 'top': {
            return {
                align: 'center',
                verticalAlign: 'top'
            }
        }
        case 'bottom': {
            return {
                align: 'center',
                verticalAlign: 'bottom'
            }
        }
        default: {
            return {
                align: 'left',
                verticalAlign: 'middle'
            }
        }
    }
}