import { TableProps } from 'antd'
import { IEditTableProps } from './types'

// todo: нигде не используется, можно удалить
export const findObjectValueByPath = (path: string, iniitalObject: Record<string, any>) => {
    if (!path.includes('.')) {
        return ''
    }

    return path.split('.').reduce((obj, field) => typeof obj === 'object' ? obj[field] : obj, iniitalObject)
}

/**
 * Фильтрует ряды на основании значения указанном в DropdownFilterElement.
 * Учитывает тип инпута (текстовый или селект).
 * 
 * @param column - фильтруемый столбец
 * @param value - значение в фильтре 
 * @param record - ряд
 * @returns подходит ли ряд по условию или нет
 */
export const handleFilter = (column: IEditTableProps['columns'][number], value: any, record: any) => {

    let filterValue = typeof value === 'string' 
        ? value 
        : record?.[column?.filterValueKey ?? column.key as (string | number)]

    if (column?.filterType === 'select' || column?.filterType === 'multiselect') {
        filterValue = value
    }

    switch (true) {
        case !isNaN(Number(value)) && column?.filterType !== 'select' && column?.filterType !== 'multiselect': {
            return `${record?.[column?.key]}`.includes(value)
        }
        case typeof filterValue === 'boolean': {
            return filterValue.toString() === value                
        }
        default: {
            const key: any = column?.filterValueKey || column?.dataIndex || column?.key
            const cell = record[key]
            const label = column?.filterSelectOptions?.find(({ value }) => value === filterValue)?.label
            const searchValue = record[column?.valueIndex?.filter] || record?.[column?.key]

            if (column?.filterType === 'multiselect') {
                return searchValue.includes(value)
            }

            return (typeof cell === 'string' ? cell : `${searchValue}`)
                .toLowerCase()
                .includes((((column?.filterType === 'select' ? label : value) as string) ?? '').toLowerCase())
        }
    }   
}

/**
 * Сортирует ряды таблицы по содержимому в ячейке.
 * 
 * Для сортировки ячеек, которые представляют собой компоненты, столбец должен содержать поле valueIndex.sort
 * 
 * Не работает при наличии серверной сортировки
 * 
 * @param column - столбец для сортировки
 * @param left - первый элемент сравнения (a)
 * @param right - второй элемент сравнения (b)
 * @returns -1 | 0 | 1
 */
export const sortRows = (column: IEditTableProps['columns'][number], left: any, right: any) => {
    let a = left?.[column?.key] || ''
    let b = right?.[column?.key] || ''

    if (column?.valueIndex?.sort) {
        a = left?.[column.valueIndex.sort]
        b = right?.[column.valueIndex.sort]
    }

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b
    }

    if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b)
    }

    return 0
}

/**
 * Функция изменения состояния сортировки (управление кликом на хедер). 
 * Последовательно включает сортировку по возрастанию,
 * затем по убыванию и на третий клик включается дефолтная сортировка
 * 
 * @param value - текущее значение сортировка
 * @param onChange - экшн для обновления состояния сортировки 
 */
export const handleHeaderClickSorting = (
    value: '' | 'ascend' | 'descend', 
    onChange: (v: '' | 'ascend' | 'descend') => void
) => {
    switch (value) {
        case 'ascend': 
            onChange('')

            return '-'
        case 'descend': 
            onChange('ascend')
            
            return ''
        default:
            onChange('descend')

            return ''
    }
}

/**
 * Позволяет выбрать все ряды во всей таблице и отключить ненужные.
 * Оригинальный выбор рядов позволяет выбрать ряды, которые отображаются только на конкретной странице,
 * даже если отметить все
 * 
 * @param rows - ряды таблицы
 * @param selectedRows - выделенные ряды таблицы
 * @param setSelectedRows - функция для обновления выделенных рядов
 * @returns объект для использования в пропсе rowSelection таблицы Ant Design
 */
export const createTableSelectionProps = ({ 
    rows, 
    selectedRows,
    setSelectedRows 
}: {
    rows: Array<{ key?: React.Key, dataIndex?: string }>,
    selectedRows: React.Key[],
    setSelectedRows: (value: React.SetStateAction<React.Key[]>) => void,
}): Partial<TableProps<any>['rowSelection'] > => ({
    columnWidth: 50,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange(selectedRowKeys, _selectedRows, info) {
        if (info?.type === 'all') {
            const allRows = rows.map((row) => row?.key || row?.dataIndex)

            setSelectedRows(selectedRows.length === 0 
                ? allRows
                : (selectedRows.length === rows.length ? [] : allRows))

            return
        }

        setSelectedRows(selectedRowKeys)
    },
    selectedRowKeys: selectedRows.filter(Boolean),
    onSelect: (record) => {
        if (selectedRows.length > 0) {
            const recordKey = record?.key || record?.dataIndex
            const selectedKey = selectedRows.find((key) => key === recordKey)

            setSelectedRows((rows) => {
                return selectedKey ? rows.filter((key) => key === selectedKey) : rows.concat(recordKey)
            })
        }
    },

})