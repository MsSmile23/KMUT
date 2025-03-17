/* eslint-disable max-len */
/* eslint-disable react/jsx-max-depth */
import { Alert, Card, Col, ConfigProvider, Empty, Row, Table } from 'antd'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IEditTableProps } from './types'
import { EditedColumnModal } from './EditedColumnModal'
import { useEditTableStore } from './tableStore'
import { ButtonDownload } from '@shared/ui/buttons/ButtonDownload/ButtonDownload'
import { EditTablePagination } from './EditTablePagination'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { TableRef } from 'antd/es/table'
import { useEditTableTheme, useHiddenPagination, useReversedTable, useTableHeight } from './hooks'
import { DropdownFilterElement } from './DropdownFilterElement'
import { createTableSelectionProps, handleFilter, handleHeaderClickSorting, sortRows } from './utils'
import { SortIcon } from './SortIcon'
import { FilterIcon } from './FilterIcon'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { EditObjectShowModal } from './EditObjectShowModal'
import { getURL } from '@shared/utils/nav'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { merge } from 'lodash'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
let inited = false

// todo: объединить server.request и server.filter в один запрос

/**
 * Основая таблица для отображения данных (расширяет стандартную таблицу Ant Design)
 *
 * ---
 * Настройки столбца:
 * @example
 * {
 *   key: 123 // обязательное поле для работы сохранения настроек таблицы
 *   dataIndex: 'id',
 *   disableFilter: true // по умолчанию false
 *   disableSort: true // по умолчанию false
 *   valueIndex: { // для сортировки и фильтрации ячеек, содержащих компоненту
 *     // значения ключей ниже затем указываем для каждого ряда
 *     filter: 'filter-key',
 *     sort: 'sort-key',
 *     print: 'print-key'
 *   },
 *   filterType: 'select', // по умолчанию указан 'text'
 *   // опции для фильтрации по селекту
 *   filterSelectOptions: data.map((el) => ({ value: el.id, label: el.name }))
 *   // ключ для фильтрации при включении серверной фильтрации
 *   serverFilterValueKey: 'id'
 * }
 *
 * Настройки ряда
 * @example
 * {
 *   id: 321
 *   'filter-key': // значение, по которому будет проводится фильтрация
 *   'sort-key': // значение, по которому будет проводится сортировка
 *   'print-key': // значение, которое будет выводится при скачивании таблицы
 * }
 * ---
 * @param columns - столбцы (по умолчанию включены сортировка и фильтрация по тексту в ячейке)
 * @param rows - ряды
 * @param tableId - ключ таблицы, по которому осуществляется доступ к сохраненным настройкам таблицы
 * @param buttons - объект с указанием компонентов для левой и правой части хедера таблицы
 * @param paginator - настройки кастомной пагинации для таблиц на витрине
 * @param paginator.page - стартовая страница таблицы
 * @param paginator.pageSize - количетство рядов на странице
 * @param paginator.enablePageSelector - включение отображение селекта для перехода на страницу
 * @param paginator.total - общее число страниц
 * @param currentTheme - настройки кастомной темы (если требуется перезаписать дефолтную тему)
 * @param onChange - аналог стандартного onChange от Ant Design Table
 * @param hideSettingsButton - включение скрытия кнопки настройки сортировки и размеров столбцов
 * @param customHeight - настриваемая высота таблицы (трtбуется проверка работоспособности)
 * @param initialPage - номер отображаемой страницы при загрузке таблицы (приоритетнее paginator.page)
 * @param server - функции для включения серверной пагинации, сортировки и фильтрации
 * @param server.request - функция для запроса данных таблицы
 * @param server.filter - функция для запроса данных таблицы после применения фильтрации
 * @param enableShowObjectModal - активировать открытие модального окна с объектом по клику на весь ряд
 */
export const EditTable: FC<Partial<IEditTableProps>> = ({
    columns = [],
    rows = [],
    tableId,
    buttons,
    paginator = { page: 1, pageSize: 10, enablePageSelector: false },
    currentTheme,
    onChange,
    hideSettingsButton = false,
    customHeight,
    forcePagination = false,
    initialPage = 1,
    server,
    enableShowObjectModal = false,
    showHeader = true,
    hideDownloadButton = false,
    enablePagination,
    hidePaginationHeader = false,
    ...props
}) => {
    let scrollX = 0
    // todo: доработать включение темы
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { editTable, themeName, theme } = useEditTableTheme(currentTheme)
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const [filteredAndSortedRows, setFilteredAndSortedRows] = useState<any[]>([])

    // текущее состояние сортировки столбца
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | ''>('')
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const isShowcase = interfaceView === 'showcase'
    // настройки пагинации
    const [page, setPage] = useState(initialPage ?? paginator?.page ?? 1)
    const [pageSize, setPageSize] = useState(paginator?.pageSize ?? 10)
    const [total, setTotal] = useState(paginator?.total || 0)
    const [lastPage, setLastPage] = useState(0)
    const [borderedTable, setBorderedTable] = useState<boolean>(false)

    useEffect(() => {
        setPage(1)
        setPageSize(paginator?.pageSize ?? 10)
        setTotal(paginator?.total ?? 0)
    }, [paginator.total, paginator.pageSize])

    //*Начальные настройки шапки таблички
    const [defaultTableHeaderStyle, setDefaultTableHeaderStyle] = useState<any>({
        ...editTable?.ButtonsCard?.bodyStyle,
        padding: '22px 16px',
        background: 'rgb(233, 247, 252)',
        borderRadius: '8px 8px 0px 0px',
        display: showHeader ? 'block' : 'none',
    })

    // текущее значение для фильтрации рядов
    const [filterValue, setFilterValue] = useState<any>()

    // полученные ключи при клики на чекбокс ряда
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([])
    const [filteredRows, setFilteredRows] = useState(rows.length)

    // колонка, к которой применяется сортировка
    const [sortedColumn, setSortedColumn] = useState('id')

    // параметры серверной фильтрации, которые будут преобразованы в search params
    const [filterParams, setFilterParams] = useState<Record<string, any>>({})

    const nav = useNavigate()

    // идентификатор для открытия модального окна с показом карточки объекта (или перехода на объект)
    const [id, setId] = useState(0)

    // переданные поля и значения формируются в поисковые параметры
    const updateFilter = (query: Partial<Record<string, any>>) => {
        setFilterParams((params) => ({ ...params, ...query }))
    }

    // реф таймера автообновления серверного запроса
    const serverRequestTimerId = useRef<any>(null)

    // колонки из localStorage с сохраненными настройками (порядок, ширина и т.д.)
    const accountColumns = useEditTableStore((st) => st.accountColumns?.[tableId] || [])
    const updateAccountColumns = useEditTableStore((st) => st.updateAccountColumns)
    // отключаем возможность использовать любые строковые значения для указания ширины столбцов

    //Добавляем в каждую таблицу виртуальную колонку
    if (!columns.find((value) => value?.key === 'virtualColumn')) {
        columns.push({
            title: null,
            dataIndex: 'virtualColumn',
            key: 'virtualColumn',
            disableSort: true,
            disableFilter: true,
            visible: false,
        })
    }

    if (props?.rowSelection && !props?.rowSelection?.columnWidth) {
        props.rowSelection['columnWidth'] = 50
    }

    const noStringWidthColumns = columns
        .map((col) => {
            if (typeof col?.width === 'string') {
                scrollX += 200

                return { ...col, width: 100 }
            }

            if (!col?.width || col?.width === null) {
                scrollX += 100

                return { ...col, width: 200 }
            }

            scrollX += col?.width

            return col
        })
        .reduce((acc, col) => {
            if (col.dataIndex) {
                const idx = acc.findIndex((accCol) => accCol.dataIndex === col.dataIndex)

                if (idx < 0) {
                    acc.push(col)
                }
            }

            return acc
        }, [])

    // формируем колонки на основе сохраненных пользовательских данных
    const comparedColumns = useMemo(() => {
        const cols = noStringWidthColumns.map((initialCol) => {
            const modifiedCol = accountColumns.find((acol) => {
                return acol.key === initialCol.key
            })

            return modifiedCol
                ? {
                    ...initialCol,
                    visible: modifiedCol.visible,
                    width: modifiedCol.width,
                }
                : initialCol
        })

        const sortedColumns =
            accountColumns.length === 0
                ? noStringWidthColumns
                : accountColumns.map((acol) => cols.find((col) => col.key === acol.key))

        const filteredByVisibility = sortedColumns.filter((col: any) => {
            return col?.visible === true || col?.visible === undefined
        })

        return filteredByVisibility
    }, [noStringWidthColumns, accountColumns])

    /**
     * Устанавливает интервал обновления данные при наличии пропса server.autoUpdate
     *
     * @param updateFunсtion - функция для запроса по queryParams и обновления стейтов компонента
     * @returns функцию обновления данных
     *
     */
    const updateServerDataAuto = useCallback(
        async (updateFuntion: (...args: any) => Promise<void>) => {
            if (server?.autoUpdate) {
                clearInterval(serverRequestTimerId.current)

                await updateFuntion()

                serverRequestTimerId.current = setInterval(async () => {
                    await updateFuntion()
                }, server.autoUpdate)
            } else {
                await updateFuntion()
            }
        },
        [server?.autoUpdate]
    )

    // добавляем в получившиеся колонки серверную пагинацию, сортировку и фильтрацию
    const resultColumns = useMemo(() => {
        return (
            comparedColumns
                .map((col) => ({
                    ...col,
                    width: col?.width === null ? undefined : col?.width,
                    //todo: разобраться с фильтрацией в children
                    ...(col?.key === 'actions' || (typeof col?.key === 'string' && col?.key.includes('attr'))
                        ? undefined
                        : // формирование настроек фильтрации для каждой колонки
                        col?.disableFilter || (server?.filter && !col?.serverFilterValueKey)
                            ? {}
                            : {
                                filterDropdown: (props: FilterDropdownProps) => {
                                    return (
                                        <DropdownFilterElement
                                            elementType={col?.filterType}
                                            options={col?.filterSelectOptions}
                                            onConfirm={async () => {
                                                // запрос для фильтрации при наличии серверной пагинации
                                                if (server?.filter) {
                                                    // ключ для фильтрации, указывается в статических настройках столбца
                                                    const key = col?.serverFilterValueKey
                                                    // TODO уйти от хардкода даты
                                                    const update = async () => {
                                                        const createDateFilters = (key: string) => {
                                                            if (col?.filterType !== 'date') {
                                                                return
                                                            }

                                                            if (key === 'started_at') {
                                                                return {
                                                                    ['filter[started_after]']:
                                                                      props.selectedKeys?.[0] || undefined,
                                                                    ['filter[started_before]']:
                                                                      props.selectedKeys?.[1] || undefined,
                                                                }
                                                            }

                                                            if (key === 'finished_at') {
                                                                return {
                                                                    ['filter[finished_after]']:
                                                                      props.selectedKeys?.[0] || undefined,
                                                                    ['filter[finished_before]']:
                                                                      props.selectedKeys?.[1] || undefined,
                                                                }
                                                            }

                                                            // if (key === 'date') {
                                                            //     return {
                                                            //         ['filter[date_from]']: props.selectedKeys?.[0] || undefined,
                                                            //         ['filter[date_to]']: props.selectedKeys?.[1] || undefined,
                                                            //     };
                                                            // }

                                                            return {
                                                                [`filter[${key}_from]`]:
                                                                  props.selectedKeys?.[0] || undefined,
                                                                [`filter[${key}_to]`]:
                                                                  props.selectedKeys?.[1] || undefined,
                                                            }
                                                        }

                                                        const dateFilters = createDateFilters(key)

                                                        const response = await server.filter({
                                                            ...filterParams,
                                                            // ...((key && key !== 'started_at' && key !== 'finished_at' && key !== 'date')
                                                            ...(key && col?.filterType !== 'date'
                                                                ? { [`filter[${key}]`]: props.selectedKeys?.[0] }
                                                                : {}),
                                                            ...dateFilters,
                                                            page: 1,
                                                            pageSize,
                                                            // todo: хардкод для системного журнала
                                                            value: col?.key?.includes('host')
                                                                ? props.selectedKeys?.[0]
                                                                : undefined,
                                                            sort: `${sortOrder === 'ascend' ? '' : '-'}${sortedColumn}`,
                                                        })

                                                        if (col?.key?.includes('host')) {
                                                            setFilterValue(props.selectedKeys?.[0])
                                                        }

                                                        setPage(1)
                                                        setTotal(response?.meta?.total || 0)

                                                        if (key) {
                                                            updateFilter(dateFilters)

                                                            // if (key !== 'started_at' && key !== 'finished_at' && key !== 'date') {
                                                            if (col?.filterType !== 'date') {
                                                                updateFilter({
                                                                    [`filter[${key}]`]: props.selectedKeys?.[0],
                                                                })
                                                            }
                                                        }
                                                    }

                                                    await updateServerDataAuto(update)
                                                }
                                            }}
                                            {...props}
                                        />
                                    )
                                },
                                onFilter: !server?.filter
                                    ? (value: any, record: any) => handleFilter(col, value, record)
                                    : undefined,
                                filterIcon: <FilterIcon color={defaultTableHeaderStyle.color} />,
                            }),
                    sorter:
                        col?.disableSort || (server?.filter && !col?.serverFilterValueKey)
                            ? undefined
                            : (a: any, b: any) => {
                                if (server) {
                                    return 0
                                }

                                return sortRows(col, a, b)
                            },
                    sortIcon: ({ sortOrder: order }) => (
                        <SortIcon color={color} sortOrder={server?.request ? sortOrder : order} />
                    ),
                    onHeaderCell:
                        col?.disableSort || (server?.filter && !col?.serverFilterValueKey)
                            ? () => ({
                                style: {
                                    background: interfaceView == 'showcase' ? backgroundTableContent : 'transparent',
                                    color: interfaceView == 'showcase' ? defaultTableHeaderStyle.color : 'auto',
                                },
                            })
                            : () => ({
                                onClick: async () => {
                                    handleHeaderClickSorting(sortOrder, setSortOrder)

                                    setSortedColumn(col?.key)
                                },
                                style: {
                                    background: interfaceView == 'showcase' ? backgroundTableContent : 'transparent',
                                    color: interfaceView == 'showcase' ? defaultTableHeaderStyle.color : 'auto',
                                },
                            }),
                }))
                .reduce((acc, col) => {
                    if (col.dataIndex) {
                        const idx = acc.findIndex((accCol) => accCol.dataIndex === col.dataIndex)

                        if (idx < 0) {
                            acc.push(col)
                        }
                    }

                    return acc
                }, [])
                // .filter((col) => col.dataIndex)
                .map((col) => ({
                    ...col,
                    render(value: any, record: any) {
                        return (
                            <div
                                onClick={(ev) => {
                                    if (record?.id && enableShowObjectModal) {
                                        if (ev.ctrlKey) {
                                            nav(
                                                getURL(
                                                    `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${record.id}`,
                                                    'showcase'
                                                )
                                            )
                                            // nav(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${record.id}`)

                                            return
                                        }

                                        setId(record.id)
                                    }
                                }}
                            >
                                {value}
                            </div>
                        )
                    },
                }))
        )
    }, [comparedColumns, defaultTableHeaderStyle])

    // отключения повторного запроса при инициализации таблицы
    useEffect(() => {
        if (inited) {
            (async () => {
                if (server?.filter) {
                    await server.filter({
                        ...filterParams,
                        page,
                        pageSize,
                        value: filterValue,
                        sort: `${sortOrder === 'ascend' ? '' : '-'}${sortedColumn}`,
                    })
                }
            })()
        }

        inited = true
    }, [sortOrder])

    const backgroundTableContent = useMemo(() => {
        return createColorForTheme(theme?.table?.content?.background, theme?.colors, themeMode)
    }, [theme, themeMode])
    const color = isShowcase
        ? createColorForTheme(theme?.table?.header?.textColor, theme?.colors, themeMode)
        : '#000000'

    useEffect(() => {
        if (interfaceView == 'showcase') {
            //*Узнаем, есть ли настройки для таблицы и цвета

            if (theme?.table && theme.colors) {
                const tableStyle = theme.table

                if (theme?.table?.net?.show) {
                    setBorderedTable(true)
                }

                const backgroundColor = createColorForTheme(theme?.table?.header?.background, theme?.colors, themeMode)
                const color = createColorForTheme(theme?.table?.header?.textColor, theme?.colors, themeMode)

                const borderRadius = theme?.table?.borders?.radius
                const borderWidth = theme?.table?.borders?.width
                const borderColor = createColorForTheme(theme?.table?.borders?.color, theme?.colors, themeMode)

                const newBodyStyle = {
                    padding: `
                    ${tableStyle?.header?.paddingUp ?? 22}px 
                    ${tableStyle?.header?.paddingRight ?? 16}px
                    ${tableStyle?.header?.paddingDown ?? 22}px
                    ${tableStyle?.header?.paddingLeft ?? 16}px
                    `,
                    background: backgroundColor ?? '#E9F7FC',
                    color: color,
                    borderRadius: `${borderRadius ?? '8'}px ${borderRadius ?? '8'}px 0px 0px`,
                    borderColor: borderColor ?? 'transparent',
                    borderStyle: borderWidth ? 'solid' : 'none',
                    borderWidth: borderWidth ? `${borderWidth}px ${borderWidth}px 0 ${borderWidth}px` : 0,
                }

                const newStyle = merge({ ...editTable?.ButtonsCard?.bodyStyle }, newBodyStyle)

                setDefaultTableHeaderStyle(newStyle)
            }
        }
    }, [theme, themeMode, interfaceView])

    useEffect(() => {
        if (interfaceView == 'showcase') {
            if (columns && theme && borderedTable) {
                const table = document?.querySelector('.editTable')
                const thArray = table?.querySelectorAll('.ant-table-cell')
                const netColor =
                    createColorForTheme(theme?.table?.net?.color, theme?.colors, themeMode) ?? 'rgba(0,0,0,0.1)'
                const netWidth = theme?.table?.net?.width ?? '1'

                thArray?.forEach((item: any) => {
                    if ('style' in item) {
                        item.style.border = `${netWidth}px solid ${netColor}`
                    }
                })
            }
        }
    }, [theme, columns, interfaceView])

    useEffect(() => {
        if (rows?.length == 0) {
            const thArray = document?.querySelectorAll('.ant-table-cell')

            thArray?.forEach((item: any) => {
                if ('style' in item) {
                    item.style.backgroundColor = interfaceView == 'showcase' ? backgroundTableContent : 'transparent'
                    item.style.color = `${color || '#000000'} !important` //color
                }
            })
        }
    }, [rows, backgroundTableContent, themeMode])
    // скрываем встроенную пагинацию, но все равно передаем в нее актуальные данные,
    // чтобы таблица работала со всем массивом рядов (сортировка + фильтрация)
    const tableRef = useRef<TableRef>(null)

    // useReversedTable(tableRef)
    useHiddenPagination(tableRef, editTable)

    // const tableContainer = useTableHeight({ rows, customHeight, theme: themeName, clientHeight: window.innerHeight })

    useEffect(() => {
        setFilteredRows(rows.length)
    }, [rows.length])
    // props = { ...props, scroll: { y: tableContainer.height, x: scrollX } }

    //Перехват пагинации и подписка на change pageSize компонента. Из-за того, что пагинация приходит из контейнеров
    if (props.pagination) {
        props.pagination = {
            ...props.pagination,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
                setPageSize(pageSize)
            },
        }
    }

    return (
        <Alert.ErrorBoundary>
            <ConfigProvider
                theme={{
                    components: {
                        Table: editTable?.Table?.design,
                    },
                }}
            >
                <Card
                    style={
                        interfaceView == 'showcase'
                            ? { border: 'none', background: 'transparent' }
                            : Object.assign(editTable?.TableCard?.style)
                    }
                    bodyStyle={
                        interfaceView == 'showcase'
                            ? { overflow: 'initial', padding: 0 }
                            : editTable?.TableCard?.bodyStyle
                    }
                >
                    {theme?.table?.tablePaginator !== 'down' && (
                        <>
                
                            {!hidePaginationHeader &&
                        <Card
                            bodyStyle={defaultTableHeaderStyle}
                            style={
                                interfaceView == 'showcase'
                                    ? { background: 'transparent', overflow: 'initial', border: 'none' }
                                    : editTable?.ButtonsCard?.style
                            }
                            // data-table-id={tableContainer.id}
                        >
                            <Row justify="space-between" align="middle" gutter={[8, 8]}>
                                <Col className="leftGroup" style={{ flexGrow: 1 }}>
                                    <Row gutter={[8, 8]} justify="start">
                                        {buttons?.left?.map((btn, i) => (
                                            <Col key={`left-btn-${i}`}>{btn}</Col>
                                        ))}
                                    </Row>
                                </Col>
                                <Col className="rightGroup" style={{ flexGrow: 1 }}>
                                    <Row gutter={[8, 8]} justify="end" align="middle">
                                        {paginator !== null && (editTable?.Paginator?.enabled || forcePagination || enablePagination) && (
                                            <Col>
                                                <EditTablePagination
                                                    defaultHeaderTableStyle={defaultTableHeaderStyle}
                                                    themeMode={themeMode}
                                                    theme={theme}
                                                    total={total || filteredRows}
                                                    initialPage={page}
                                                    pageSize={{
                                                        default: pageSize,
                                                        values: [10, 20, 30, 40, 50, 100, 500],
                                                    }}
                                                    lastPage={lastPage}
                                                    enablePageSelector={Boolean(paginator?.enablePageSelector)}
                                                    onChange={async (page, size) => {
                                                        if (server?.request) {
                                                            const payload = {
                                                                ...filterParams,
                                                                filterValue,
                                                                page,
                                                                per_page: size,
                                                                sort: `${
                                                                    sortOrder === 'ascend' ? '' : '-'
                                                                }${sortedColumn}`,
                                                            } as any

                                                            for (const param in payload) {
                                                                if (payload[param] === undefined) {
                                                                    delete payload[param]
                                                                }
                                                            }

                                                            const update = async () => {
                                                                const response = await server.request?.(payload)

                                                                setPage(response?.meta?.current_page)
                                                                setPageSize(Number(response?.meta?.per_page))
                                                                setTotal(response?.meta?.total)
                                                                setLastPage(response?.meta?.last_page || 0)
                                                            }

                                                            if (server?.autoUpdate) {
                                                                clearInterval(serverRequestTimerId.current)

                                                                serverRequestTimerId.current = setInterval(() => {
                                                                    update()
                                                                }, server.autoUpdate)
                                                            } else {
                                                                update()
                                                            }

                                                            // updateServerDataAuto(update) //! Раскомментировать, если что-то сломается >:)

                                                            return
                                                        }

                                                        setPage(page)
                                                        setPageSize(size)
                                                        setTotal(filteredRows)
                                                    }}
                                                />
                                            </Col>
                                        )}
                                        {buttons?.right?.map((btn, i) => (
                                            <Col key={`right-btn-${i}`}>{btn}</Col>
                                        ))}

                                        {(editTable?.Buttons?.downloadEnabled ||
                                        editTable?.Buttons?.downloadEnabled == undefined) && !hideDownloadButton   ? (
                                                <ConfigProvider
                                                    theme={{
                                                        components: {
                                                            Button: {
                                                                defaultBg: editTable?.Buttons?.downloadBg as string,
                                                                // eslint-disable-next-line max-len
                                                                defaultColor: editTable?.Buttons?.downloadBorder as string,
                                                                // eslint-disable-next-line max-len
                                                                defaultShadow: editTable?.Buttons?.downloadShadow as string,
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ButtonDownload
                                                        icon={editTable?.Buttons?.downloadIcon as string}
                                                        rows={rows} //TODO сделать чтобы сюда залетали фильтрованные строки
                                                        columns={resultColumns}
                                                        buttonStyle={{
                                                            color: defaultTableHeaderStyle.color,
                                                            background:
                                                            themeMode == 'dark' && interfaceView == 'showcase'
                                                                ? defaultTableHeaderStyle.background
                                                                : '#ffffff',
                                                        }}
                                                        size="middle"
                                                    />
                                                </ConfigProvider>
                                            ) : null}
                                        {(editTable?.Buttons?.columnsEnabled ?? true) && !hideSettingsButton && (
                                            <Col>
                                                <EditedColumnModal
                                                    columns={noStringWidthColumns}
                                                    tableId={tableId}
                                                    onSave={(cols) => updateAccountColumns(tableId, cols)}
                                                    onReset={() => updateAccountColumns(tableId, noStringWidthColumns)}
                                                    icon={editTable?.Buttons?.columnsIcon}
                                                    buttonStyle={{
                                                        color: defaultTableHeaderStyle.color,
                                                        background:
                                                            themeMode == 'dark' && interfaceView == 'showcase'
                                                                ? defaultTableHeaderStyle.background
                                                                : '#ffffff',
                                                    }}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </Card>}
                        </>
                    )}

                    <Table
                        locale={{
                            emptyText: <Empty description={<span style={{ color: color }}>Нет данных</span>}></Empty>,
                        }}
                        bordered={borderedTable}
                        className={`table_${isShowcase ? themeMode : ''} editTable ${interfaceView}`}
                        ref={tableRef}
                        dataSource={rows}
                        columns={resultColumns}
                        pagination={
                            editTable?.Paginator?.enabled
                                ? {
                                    pageSize: pageSize,
                                    current: page,
                                    position: ['bottomRight'],
                                }
                                : editTable?.Pagination?.enabled
                        }
                        // pagination={
                        //     {
                        //         pageSize: pageSize,
                        //         current: page,
                        //         position: ['bottomRight'],
                        //     }
                        // }
                        virtual={true}
                        height={5000}
                        width="max-content"
                        // scroll={{ y: tableContainer.height, x: scrollX }}
                        style={
                            interfaceView !== 'showcase'
                                ? editTable?.Table?.style
                                : {
                                    background: 'transparent',
                                    borderRadius: theme?.table?.borders?.radius
                                        ? `0px 0px ${theme?.table?.borders?.radius + 'px'} ${
                                            theme?.table?.borders?.radius + 'px'
                                        }`
                                        : 0,
                                    borderColor: defaultTableHeaderStyle?.borderColor ?? 'transparent',
                                    borderStyle: defaultTableHeaderStyle?.borderWidth ? 'solid' : 'none',
                                    borderWidth: defaultTableHeaderStyle?.borderWidth
                                        ? `0px 
                                    ${theme?.table?.borders?.width}px 
                                    ${theme?.table?.borders?.width}px
                                    ${theme?.table?.borders?.width}px
                                    `
                                        : 0,
                                }
                        }
                        rowSelection={createTableSelectionProps({ rows, selectedRows, setSelectedRows })}
                        onChange={(pagination, filter, sorter, extra) => {
                            setFilteredRows(extra.currentDataSource.length)
                            setFilteredAndSortedRows(extra.currentDataSource) // Сохраняем отфильтрованные и отсортированные данные
                            onChange?.(pagination, filter, sorter, extra)
                        }}
                        onHeaderRow={() => ({
                            style: {
                                background: interfaceView == 'showcase' ? backgroundTableContent : 'transparent',
                                color: interfaceView == 'showcase' ? defaultTableHeaderStyle.color : 'auto',
                                // background: 'purple'
                            },
                        })}
                        onRow={(record: any) => ({
                            style: {
                                background: interfaceView == 'showcase' ? backgroundTableContent : 'transparent',
                                color: interfaceView == 'showcase' ? defaultTableHeaderStyle.color : 'auto',
                              
                            },
                            onClick: (ev) => {
                                if (record?.id && enableShowObjectModal) {
                                    if (ev.ctrlKey) {
                                        nav(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${record.id}`)

                                        return
                                    }

                                    setId(record.id)
                                }
                            },
                        })}
                        {...(props as any)}
                    />
                    {theme?.table?.tablePaginator == 'down' && (
                        <Card
                            bodyStyle={defaultTableHeaderStyle}
                            style={
                                theme?.table && interfaceView == 'showcase'
                                    ? { background: 'transparent', overflow: 'initial', border: 'none' }
                                    : editTable?.ButtonsCard?.style
                            }
                        >
                            <Row justify="space-between" align="middle" gutter={[8, 8]}>
                                <Col className="leftGroup" style={{ flexGrow: 1 }}>
                                    <Row gutter={[8, 8]} justify="start">
                                        {buttons?.left?.map((btn, i) => (
                                            <Col key={`left-btn-${i}`}>{btn}</Col>
                                        ))}
                                    </Row>
                                </Col>
                                <Col className="rightGroup" style={{ flexGrow: 1 }}>
                                    <Row gutter={[8, 8]} justify="end" align="middle">
                                        {paginator !== null && editTable?.Paginator?.enabled && (
                                            <Col>
                                                <EditTablePagination
                                                    defaultHeaderTableStyle={defaultTableHeaderStyle}
                                                    themeMode={themeMode}
                                                    theme={theme}
                                                    total={total || filteredRows}
                                                    initialPage={page}
                                                    pageSize={{
                                                        default: pageSize,
                                                        values: [10, 20, 30, 40, 50, 100, 500],
                                                    }}
                                                    lastPage={lastPage}
                                                    enablePageSelector={Boolean(paginator?.enablePageSelector)}
                                                    onChange={async (page, size) => {
                                                        if (server?.request) {
                                                            const payload = {
                                                                ...filterParams,
                                                                filterValue,
                                                                page,
                                                                per_page: size,
                                                                sort: `${
                                                                    sortOrder === 'ascend' ? '' : '-'
                                                                }${sortedColumn}`,
                                                            } as any

                                                            for (const param in payload) {
                                                                if (payload[param] === undefined) {
                                                                    delete payload[param]
                                                                }
                                                            }
                                                            const update = async () => {
                                                                const response = await server.request?.(payload)

                                                                setPage(response?.meta?.current_page)
                                                                setPageSize(Number(response?.meta?.per_page))
                                                                setTotal(response?.meta?.total)
                                                                setLastPage(response?.meta?.last_page || 0)
                                                            }

                                                            if (server?.autoUpdate) {
                                                                clearInterval(serverRequestTimerId.current)

                                                                serverRequestTimerId.current = setInterval(() => {
                                                                    update()
                                                                }, server.autoUpdate)
                                                            } else {
                                                                update()
                                                            }

                                                            updateServerDataAuto(update)

                                                            return
                                                        }

                                                        setPage(page)
                                                        setPageSize(size)
                                                        setTotal(filteredRows)
                                                    }}
                                                />
                                            </Col>
                                        )}
                                        {buttons?.right?.map((btn, i) => (
                                            <Col key={`right-btn-${i}`}>{btn}</Col>
                                        ))}

                                        {editTable?.Buttons?.downloadEnabled ||
                                        editTable?.Buttons?.downloadEnabled == undefined ? (
                                                <ConfigProvider
                                                    theme={{
                                                        components: {
                                                            Button: {
                                                                defaultBg: editTable?.Buttons?.downloadBg as string,
                                                                // eslint-disable-next-line max-len
                                                                defaultColor: editTable?.Buttons?.downloadBorder as string,
                                                                // eslint-disable-next-line max-len
                                                                defaultShadow: editTable?.Buttons?.downloadShadow as string,
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ButtonDownload
                                                        icon={editTable?.Buttons?.downloadIcon as string}
                                                        rows={filteredAndSortedRows || rows}
                                                        columns={resultColumns}
                                                        buttonStyle={{
                                                            color: defaultTableHeaderStyle.color,
                                                            background: defaultTableHeaderStyle.background,
                                                        }}
                                                    />
                                                </ConfigProvider>
                                            ) : null}
                                        {(editTable?.Buttons?.columnsEnabled ?? true) && !hideSettingsButton && (
                                            <Col>
                                                <EditedColumnModal
                                                    columns={noStringWidthColumns}
                                                    tableId={tableId}
                                                    onSave={(cols) => updateAccountColumns(tableId, cols)}
                                                    onReset={() => updateAccountColumns(tableId, noStringWidthColumns)}
                                                    icon={editTable?.Buttons?.columnsIcon}
                                                    buttonStyle={{
                                                        color: defaultTableHeaderStyle.color,
                                                        background:
                                                            themeMode == 'dark' && interfaceView == 'showcase'
                                                                ? defaultTableHeaderStyle.background
                                                                : '#ffffff',
                                                    }}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Card>
                <EditObjectShowModal id={id} onChangeId={setId} />
            </ConfigProvider>
        </Alert.ErrorBoundary>
    )
}