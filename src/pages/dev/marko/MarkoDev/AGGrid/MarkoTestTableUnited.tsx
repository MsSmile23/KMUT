import { Button, Col, Row, Space } from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
    AllCommunityModule,
    ModuleRegistry,
    themeAlpine,
    themeBalham,
    themeQuartz,
    GridApi,
    ClientSideRowModelModule,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { ECTooltip } from '@shared/ui/tooltips'
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons'
import { EditTablePagination } from '@shared/ui/tables/ECTable2/EditTable/EditTablePagination'
import MarkoTestButtonDownload from '../MarkoTestButtonDownload'
import MarkoTestThemeSelection from './MarkoTestThemeSelection'
import { IMarkoTestTableServer } from '../IMarkoTest'
import { markoTestPagination } from '../MarkoTestData'
import { useEditTableTheme } from '@shared/ui/tables/ECTable2/EditTable/hooks'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { merge } from 'lodash'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useEditTableStore } from '@shared/ui/tables/ECTable2/EditTable/tableStore'
import { MarkoTestCopyEditedCom } from '../MarkoTestCopyEditedCom'
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule])

const MarkoTestTableUnited: FC<IMarkoTestTableServer> = ({
    ButtonAction,
    tableRow,
    columns,
    tableStyle,
    server,
    pagination,
    autoUpdate,
    currentTheme,
    tableId,
}) => {
    const themes = [
        { id: 'Quartz', theme: themeQuartz },
        { id: 'Balham', theme: themeBalham },
        { id: 'Alpine', theme: themeAlpine },
    ]
    const [mainTheme, setBaseTheme] = useState(themes[0])
    const { editTable, themeName, theme } = useEditTableTheme(currentTheme)
    const [colDefs, setColDefs] = useState(columns)
    const accountData = useAccountStore(selectAccount)
    const updateAccountColumns = useEditTableStore((st) => st.updateAccountColumns)
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const isShowcase = interfaceView === 'showcase'
    const accountColumns = useEditTableStore((st) => st.accountColumns?.[tableId] || [])
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [paginStatus, setPaginStatus] = useState(true)
    const [sort, setSort] = useState('')
    const [loading, setLoading] = useState(false)
    const [filterRow, setFilter] = useState({})
    const [borderedTable, setBorderedTable] = useState<boolean>(false)
    const gridRef = useRef()
    const sortRef = useRef(sort)
    const previousFilters = useRef(filterRow)
    const [defaultTableHeaderStyle, setDefaultTableHeaderStyle] = useState<any>({
        ...editTable?.ButtonsCard?.bodyStyle,
        padding: '22px 16px',
        background: 'rgb(233, 247, 252)',
        borderRadius: '8px 8px 0px 0px',
        display: 'flex',
        justifyContent: 'space-between',
    })

    const defaultColDef = {
        filter: true,
        icons: {
            filter: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 32 32">
                    <title>filter</title>
                    <path d="M26 8.184c-0.066 2.658-4.058 5.154-6.742 7.974-0.168 0.196-0.252 0.424-0.258 
                    0.682v3.66l-6 4.5c0-2.74 0.066-5.482-0.002-8.222-0.018-0.234-0.102-0.442-0.256-0.62-2.716-2.854-6.682-5.548-6.742-7.974v-2.184h20v2.184zM8 
                    8c0 0.304 0.060 0.612 0.258 0.842 2.716 2.854 6.682 5.548 6.742 7.974v4.184l2-1.5v-2.684c0.066-2.658 
                    4.058-5.154 6.742-7.974 0.198-0.23 0.258-0.538 0.258-0.842h-16z" fill={${defaultTableHeaderStyle.color}} />
                    </svg>`,
        },
    }

    const mergeColumns = (originalColumns, savedColumns) => {
        return originalColumns.map((col) => {
            const savedCol = savedColumns.find((savedCol) => savedCol.key === col.key)
            return savedCol ? { ...col, ...savedCol } : col
        })
    }

    useEffect(() => {
        setLoading(true)
        const initialColumns = mergeColumns(colDefs, accountColumns)
        setColDefs(initialColumns)
        setLoading(false)
    }, [])

    const noStringWidthColumns = colDefs
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
            if (col.field) {
                const idx = acc.findIndex((accCol) => accCol.field === col.field)

                if (idx < 0) {
                    acc.push(col)
                }
            }

            return acc
        }, [])

    function onFilterChanged(event) {
        if (server) {
            const filterModel = event.api.getFilterModel()

            const isFilterRowEmpty = Object.keys(filterRow).length === 0
            const isFilterModelEmpty = Object.keys(filterModel).length === 0

            if (isFilterRowEmpty && isFilterModelEmpty) {
                setFilter({})
            }

            if (JSON.stringify(filterRow) !== JSON.stringify(filterModel)) {
                setFilter({ ...filterModel })
            }
        }
    }

    const onGridReady = async (params) => {
        {
            server && setLoading(true)
            const payload = {
                'filter[object_id]': '',
                'page': currentPage,
                'per_page': pageSize,
            }
            try {
                const response = await server?.request(payload)
                tableRow = response
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                return setLoading(false)
            }
        }
    }

    const backgroundTableContent = useMemo(() => {
        return createColorForTheme(theme?.table?.content?.background, theme?.colors, themeMode)
    }, [theme, themeMode])

    const onPageChange = (page) => {
        return setCurrentPage(page)
    }

    const onPageSizeChange = (size) => {
        return setPageSize(size)
    }

    const serverUpdate = async (page, pgsize) => {
        if (loading) return
        setLoading(true)
        const payload = {
            page: page,
            per_page: pgsize,
            sort: sort,
        }

        if (Object.keys(filterRow).length > 0) {
            for (const [key, filter] of Object.entries(filterRow)) {
                const filterKey = `filter[${key}]`
                payload[filterKey] = `${filter.filter}`
            }
        } else {
            payload['filter[object_id]'] = ''
        }
        try {
            const response = await server?.request(payload)
            tableRow = response
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            return setLoading(false)
        }
    }

    const onSortChanged = (event) => {
        let newSort = ''
        const sortedColumns = event?.columns.slice(-1)[0]
        if (sortedColumns.sort === 'asc') {
            newSort = sortedColumns.colId
        } else if (sortedColumns.sort === 'desc') {
            newSort = `-${sortedColumns.colId}`
        }
        if (newSort !== sort) {
            setSort(newSort)
        }
    }

    useEffect(() => {
        if (
            (sort && server && sort !== sortRef.current) ||
            JSON.stringify(previousFilters.current) !== JSON.stringify(filterRow)
        ) {
            serverUpdate(currentPage, pageSize)
            sortRef.current = sort
            previousFilters.current = filterRow
        }
        const intervalId = setInterval(() => {
            if (autoUpdate && server) {
                serverUpdate(currentPage, pageSize)
            }
        }, 20000)

        return () => clearInterval(intervalId)
    }, [sort, currentPage, pageSize, server, filterRow])

    useEffect(() => {
        if (interfaceView == 'showcase') {
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

    // console.log('Сами колонны', colDefs)
    const tableTheme = useMemo(() => {
        return themeQuartz.withParams({
            wrapperBorder: borderedTable,
            borderRadius: theme?.table?.borders?.radius
                ? `2px 2px ${theme?.table?.borders?.radius + 'px'} ${theme?.table?.borders?.radius + 'px'}`
                : 2,
            headerRowBorder: {
                style: defaultTableHeaderStyle?.borderWidth ? 'solid' : 'none',
                color: defaultTableHeaderStyle?.borderColor ?? 'transparent',
                width: defaultTableHeaderStyle?.borderWidth
                    ? `2px 
                ${theme?.table?.borders?.width}px 
                ${theme?.table?.borders?.width}px
                ${theme?.table?.borders?.width}px
                `
                    : '3px',
            },
            columnBorder: {
                style: defaultTableHeaderStyle?.borderWidth ? 'solid' : 'none',
                color: defaultTableHeaderStyle?.borderColor ?? 'transparent',
                width: defaultTableHeaderStyle?.borderWidth
                    ? `2px 
            ${theme?.table?.borders?.width}px 
            ${theme?.table?.borders?.width}px
            ${theme?.table?.borders?.width}px
            `
                    : '3px',
            },
        })
    }, [borderedTable, backgroundTableContent, theme])

    const classGridOptions = {
        defaultColDef,
        theme: tableTheme,
        onFilterChanged: onFilterChanged,
    }

    return (
        <div style={tableStyle}>
            <Row style={{ ...defaultTableHeaderStyle, display: 'flex', justifyContent: 'space-between' }}>
                <Col>
                    <Space>
                        {paginStatus ? (
                            <ECTooltip title="Включить визуализацию">
                                <Button
                                    shape="circle"
                                    style={{
                                        backgroundColor: '#188EFC',
                                        color: '#ffffff',
                                        width: '40px',
                                        height: '40px',
                                    }}
                                    type="primary"
                                    onClick={() => {
                                        setPaginStatus(!paginStatus)
                                    }}
                                    icon={<ArrowsAltOutlined />}
                                />
                            </ECTooltip>
                        ) : (
                            <ECTooltip title="Включить пагинацию">
                                <Button
                                    shape="circle"
                                    style={{
                                        backgroundColor: '#188EFC',
                                        color: '#ffffff',
                                        width: '40px',
                                        height: '40px',
                                    }}
                                    type="primary"
                                    onClick={() => {
                                        setPaginStatus(!paginStatus)
                                    }}
                                    icon={<ShrinkOutlined />}
                                />
                            </ECTooltip>
                        )}
                        {ButtonAction && <ButtonAction />}
                        Выбор темы:{' '}
                        <MarkoTestThemeSelection options={themes} value={mainTheme} setValue={setBaseTheme} />
                    </Space>
                </Col>
                <Col>
                    <Space>
                        {paginStatus && (
                            <EditTablePagination
                                total={pagination ? pagination : tableRow.length}
                                themeMode={themeMode}
                                theme={theme}
                                initialPage={currentPage}
                                pageSize={{
                                    default: pageSize,
                                    values: markoTestPagination,
                                }}
                                onChange={(page, size) => {
                                    onPageChange(page)
                                    onPageSizeChange(size)
                                    server
                                        ? serverUpdate(page, size)
                                        : gridRef?.current?.api?.paginationGoToPage(page - 1)
                                }}
                            />
                        )}
                        <MarkoTestButtonDownload
                            buttonStyle={{ height: '35px', width: '35px' }}
                            columns={colDefs}
                            rows={tableRow}
                        />
                        <MarkoTestCopyEditedCom
                            buttonStyle={{ height: '35px', width: '35px' }}
                            columns={noStringWidthColumns}
                            tableId={tableId}
                            onSave={(cols) => updateAccountColumns(tableId, cols)}
                            onReset={() => updateAccountColumns(tableId, noStringWidthColumns)}
                            gridApiRef={gridRef}
                            setColDefs={setColDefs}
                            originalTable={columns}
                        />
                    </Space>
                </Col>
            </Row>
            <AgGridReact
                onGridReady={onGridReady}
                gridOptions={classGridOptions}
                rowData={tableRow}
                ref={gridRef}
                columnDefs={colDefs}
                pagination={paginStatus}
                paginationPageSize={pageSize}
                paginationPageSizeSelector={markoTestPagination}
                suppressPaginationPanel={true}
                // theme={mainTheme.theme}
                rowSelection={'multiple'}
                onSortChanged={onSortChanged}
                loading={loading}
            />
        </div>
    )
}

export default MarkoTestTableUnited
