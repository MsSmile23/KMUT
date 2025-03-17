export interface IIndicator {
    value: string
    label: string
    code: string
}

export const availableIndicatorsList: IIndicator[] = [
    { value: 'bollinger-bands', label: 'Полосы Боллинджера', code: 'bb' },
    { value: 'acceleration-bands', label: 'Полосы ускорения', code: 'abands' },
    { value: 'ema', label: 'Экспоненциальная скользящая средняя', code: 'ema' },
    { value: 'dema', label: 'Двойная экспоненциальная скользящая средняя', code: 'dema' },
    { value: 'tema', label: 'Тройная экспоненциальная скользящая средняя', code: 'tema' },
    { value: 'regressions', label: 'Линейная регрессия', code: 'linearRegression' },
    { value: 'pivot-points', label: 'Точки пивот', code: 'pivotpoints' },
    { value: 'price-channel', label: 'Ценовой канал', code: 'pc' },
    { value: 'price-envelopes', label: 'Конверты', code: 'priceenvelopes' },
    { value: 'sma', label: 'Простая скользящая средняя', code: 'sma' },
    { value: 'supertrend', label: 'Супертренд', code: 'supertrend' },
    { value: 'zigzag', label: 'Взвешенное скользящее среднее', code: 'zigzag' },
]