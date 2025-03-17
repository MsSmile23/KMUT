/* eslint-disable @typescript-eslint/no-unused-vars */
type TPrimitive = number | string | boolean | null | undefined

/**
 * Формирует строку запроса для получения данных с сервера
 * 
 * @param payload - объект для передачи в качестве body (может принимать массивы)
 * @returns строку вида "id=1&array[]=1&array[]=2"
 */
export const convertToSearchParams = (payload: Record<string, TPrimitive | number[] | string[]>) => {
    const entries = Object.entries(payload)
    const notArrays = entries.filter(([ _param, item ]) => !Array.isArray(item)) as [string, TPrimitive][]
    const arrays = entries.filter(([ _param, items ]) => Array.isArray(items)) as [string, number[] | string[]][]

    // ломается типизация после деструктуризации
    const objectParamsUrl = new URLSearchParams(notArrays.map(([ key, value ]) => [ key, `${value}` ])).toString()
    const arrayParamsUrl = arrays.map(([ arrKey, items ]) => items.map((id: string | number) => {
        return `&${arrKey}[]=${id}`
    }).join('')).join('')

    return objectParamsUrl + arrayParamsUrl
}