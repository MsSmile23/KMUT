type TData = {
    value: number, // Значение по оси X
    categoryNameXAxis: string // Категория по оси X, например: Устройство 1
}

type TIntervalColors = {
    range: {
        start: number, // От какого значения
        end: number // До какого значения
    }
    activeColor: string // Основной цвет колонки заливки
    inactiveColor: string // Цвет полупрозрачных элементов заливки
}

export type TSeriesDataForPlatesColumnChart = {
    unit: string, // Значение отображения например: % или оставить пустым.
    step: number, // Шаг интервала
    renderWithTransparentColumn: boolean, // Отображать ли полупрозрачные колонки?
    YAxisName: string, // Название графика по оси Y
    interval: {
        start: number, // Интервал начало
        end: number // Интервал конец
    },
    data: TData[] // См. описание типа
    intervalColors?: TIntervalColors[] // См. описание типа
}

export type TECPlatesColumnChart = {
    data: TSeriesDataForPlatesColumnChart[]
    color?: string
    height?: number
    width?: number
    dataLabels?: Highcharts.SeriesColumnOptions['dataLabels']
    tooltip?: Highcharts.SeriesColumnOptions['tooltip']
    categories?: string[]
    pointHeight?: number
    pointWidth?: number
    inverted?: boolean
    fontSize?: number
    onlyActiveColor: boolean
}