/**
 * Формирует опции для выпадающего списка. Дополнительно может фильтровать входные данные.
 * 
 * @param data - массив данных из api
 * @param compare - [поле/ключ итерируемого элемента, значение для сравнения]
 * @returns опции для компонента Select
 */
export const createOptions = (data: { id: number, name?: string | React.ReactNode }[], compare?: [any, any]) => {
    return data.filter((el) => {
        return (compare && (compare[0] in el)) ? el[compare[0]] === compare[1] : el
    }).map((el) => ({ value: el.id, label: el?.name || el.id })) 
}