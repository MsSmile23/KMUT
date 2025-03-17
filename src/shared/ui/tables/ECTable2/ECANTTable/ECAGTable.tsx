/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */

import { Button, Card, Col, Empty, Row, Space } from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
    ClientSideRowModelModule,
    themeAlpine,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { ECTooltip } from '@shared/ui/tooltips'
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons'
import { EditTablePagination } from '@shared/ui/tables/ECTable2/EditTable/EditTablePagination'
import { useEditTableTheme } from '@shared/ui/tables/ECTable2/EditTable/hooks'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { merge } from 'lodash'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useEditTableStore } from '@shared/ui/tables/ECTable2/EditTable/tableStore'
import ECAGButtonDownload from './ECAGComponents/ECAGButtonDownload'
import { ECAGEditedColumnModal } from './ECAGComponents/ECAGEditedColumnModal'
import { IECAGTable } from './ecag'
import './ECAGCSS/ecag.css'
import { rowStyles } from '@containers/widgets/WidgetActivePortsFromAttribute/utils';
import Title from 'antd/es/typography/Title';
import { NoRowsOverlayComponent } from 'ag-grid-community/dist/types/src/rendering/overlays/noRowsOverlayComponent';
import ECAGHeaderTooltip from './ECAGComponents/ECAGHeaderTooltip';
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule ]);


interface IFilterRow {
    filter: number
    filterType: string
    type: string
}

const ECAGTable: FC<IECAGTable> = ({
    buttons,
    tableRow = [],
    columns = [],
    server,
    showHeader = true,
    pagination = { page: 1, pageSize: 10 },
    paginAdditional,
    tableCSS,
    autoUpdate,
    currentTheme,
    gridOptions,
    tableId,
    initialPage = 1,
    hideSettingsButton = false,
    header,
    headerCSS,
    additionalInfo,
    supressHorizScroll = false,
    classes,
    onRowClicked,
    useTheme = true,
    emptyText = 'Отображать нечего',
    agGridCSS,
    getExportRowStyle
}) => {
    const paginConfig = {
        status: true,
        button: true,
        suppress: true,
        layout: true,
        ...paginAdditional, // Переданные значения перезапишут дефолтные
    };
    const { editTable, themeName, theme } = useEditTableTheme(currentTheme)
    const [colDefs, setColDefs] = useState(columns)
    const accountData = useAccountStore(selectAccount)
    const updateAccountColumns = useEditTableStore((st) => st.updateAccountColumns)
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const isShowcase = interfaceView === 'showcase'
    const accountColumns = useEditTableStore((st) => st.accountColumns?.[tableId] || [])
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const [currentPage, setCurrentPage] = useState(initialPage ?? pagination?.page ?? 1)
    const [pageSize, setPageSize] = useState(pagination?.pageSize ?? 10)
    const [paginStatus, setPaginStatus] = useState(paginConfig.status ?? true)
    const [sort, setSort] = useState('')
    const [loading, setLoading] = useState(false)
    const [filterRow, setFilter] = useState<object | IFilterRow>({})
    const [borderedTable, setBorderedTable] = useState<boolean>(false)
    const gridRef = useRef<AgGridReact>(null)
    const sortRef = useRef(sort)
    const previousFilters = useRef(filterRow)
    const [defaultTableHeaderStyle, setDefaultTableHeaderStyle] = useState<any>({
        ...editTable?.ButtonsCard?.bodyStyle,
        padding: '22px 16px',
        background: 'rgb(233, 247, 252)',
        borderRadius: tableCSS?.borderRadius ? tableCSS?.borderRadius : '8px 8px 0px 0px',
        display: showHeader ? 'block' : 'none',
        justifyContent: 'space-between',
    })
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
            let scrollX = 0

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
        if (loading) {
            return
        }
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
            setLoading(false)
        }
    }

    const onSortChanged = (event) => {
        let newSort = '';
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

    const colorText = `${interfaceView == 'showcase' ? defaultTableHeaderStyle.color : 'auto'}`

    const netColor =
                createColorForTheme(theme?.table?.net?.color, theme?.colors, themeMode) ?? 'rgba(0,0,0,0.1)'
    const netWidth = tableCSS?.net ? tableCSS?.net  : theme?.table?.net?.width ?? '1'

    const checkThemes = useMemo(() => {
        if (interfaceView == 'showcase') {
            if (theme?.table && theme.colors) {
                setLoading(true)
                const tableStyle = theme.table

                if (theme?.table?.net?.show) {
                    setBorderedTable(true)
                }

                const backgroundColor = createColorForTheme(theme?.table?.header?.background, theme?.colors, themeMode)
                const color = createColorForTheme(theme?.table?.header?.textColor, theme?.colors, themeMode)

                const borderRadius = tableCSS?.borderRadius ? tableCSS?.borderRadius : theme?.table?.borders?.radius
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
                    // display: showHeader ? 'block' : 'none',
                    borderWidth: borderWidth ? `${borderWidth}px ${borderWidth}px 0 ${borderWidth}px` : 0,
                }

                const newStyle = merge({ ...editTable?.ButtonsCard?.bodyStyle }, newBodyStyle)

                setDefaultTableHeaderStyle(newStyle)

                setLoading(false)
            }
        }
    }, [theme, themeMode, interfaceView])


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
                setLoading(false)
            }
        }

        
        if (useTheme) {
            const headerElements = document.querySelectorAll(`.${tableId} .ag-header-cell`);
            const rowWrapper = document.querySelectorAll(`.${tableId} .ag-root-wrapper`);
            const header = document.querySelectorAll(`.${tableId} .ag-header`)
            const headerIcon = document.querySelectorAll(`.${tableId} .icon`)
    
            headerElements.forEach(head => {
                head.style.backgroundColor = backgroundTableContent;
                head.style.color = colorText;
            });

            headerIcon.forEach(head => {
                head.style.backgroundColor = backgroundTableContent;
                head.style.color = colorText;
            });

            rowWrapper.forEach(head => {
                head.style.backgroundColor = backgroundTableContent;
                head.style.color = colorText;
            });

            header.forEach(head => {
                head.style.backgroundColor = backgroundTableContent;
                head.style.color = colorText;
                head.style.border = 'none'
                head.style.borderBottom = `${netWidth}px solid ${netColor}`
            });

        }
    }


    const defaultColDef = {
        filter: true,
        icons: {
            filter: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" class="icon" viewBox="0 0 32 32">
                    <title>filter</title>
                    <path d="M26 8.184c-0.066 2.658-4.058 5.154-6.742 7.974-0.168 0.196-0.252 0.424-0.258 
                    0.682v3.66l-6 4.5c0-2.74 0.066-5.482-0.002-8.222-0.018-0.234-0.102-0.442-0.256-0.62-2.716-2.854-6.682-5.548-6.742-7.974v-2.184h20v2.184zM8 
                    8c0 0.304 0.060 0.612 0.258 0.842 2.716 2.854 6.682 5.548 6.742 7.974v4.184l2-1.5v-2.684c0.066-2.658 
                    4.058-5.154 6.742-7.974 0.198-0.23 0.258-0.538 0.258-0.842h-16z" class="icon-path" />
                    </svg>`,
        },
    };

    const getRowStyle = (params) => {
        return { backgroundColor: backgroundTableContent, color: colorText, borderBottom: `${netWidth}px solid ${netColor}` };
    };

    const mergeRowStyles = (params) => {
        // Вызываем вашу функцию для получения базовых стилей
        const baseStyle = getRowStyle(params);
    
        // Если пользовательская функция предоставлена, вызываем её
        const userStyle = getExportRowStyle ? getExportRowStyle(params) : {};
    
        // Объединяем стили, при этом пользовательские стили перезаписывают базовые
        return { ...baseStyle, ...userStyle };
    };
    

    const defaultGridOptions = {
        defaultColDef,
        theme: useTheme ? tableTheme : '',
        onFilterChanged: onFilterChanged,
        overlayNoRowsTemplate: `
        <div style="text-align: center; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; width: 100%;>
            <span style="font-size: 16px; color: #666;">
                ${emptyText}
            </span>
        </div>
        `,
        // getRowStyle,
        tooltipMouseTrack: true,
    }



    const resultedGridOptions = {
        ...defaultGridOptions,
        ...gridOptions,
    }
    const defaultCSS = { height: '100%' }
    
    const resultedGridCSS = {
        ...defaultCSS,
        ...agGridCSS,
    }

    return (
        <div style={tableCSS ? tableCSS : { width: '100%', height: '100%' }}>
            {header && showHeader === false && (
                <div style={{ margin: ' 0 auto' }}>
                    {/* // <Card style={{ ...headerCSS, background: defaultTableHeaderStyle.background }}> */}
                    <Title 
                        style={{ color: defaultTableHeaderStyle.color, fontSize: 30,
                            margin: 0,
                            fontWeight: 500,
                            textAlign: 'center'
                        }}
                    >
                        {header}
                    </Title>
                    {additionalInfo && (
                        <Title
                            level={5}
                            style={{
                                opacity: '0.4',
                                display: 'flex',
                                justifyContent: 'space-around',
                                color: defaultTableHeaderStyle.color,
                                margin: '0',
                                fontSize: '1.5rem',
                                fontWeight: 400
                            }}
                        >
                            {additionalInfo}
                        </Title>
                    )}
                    {/* // </Card> */}
                </div>
            )}

            <Row
                style={{
                    ...defaultTableHeaderStyle,
                    display: showHeader ? 'flex' : 'none',
                    justifyContent: 'space-between',
                }}
            >
                <Col>
                    <Space>
                        {paginConfig.button && (
                            <>
                                {paginStatus ? (
                                    <ECTooltip title="Отключить пагинацию">
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
                            </>
                        )}
                        {buttons?.left?.map((btn, i) => (
                            <Col key={`left-btn-${i}`}>{btn}</Col>
                        ))}
                        <Col>{header}</Col>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        {buttons?.right?.map((btn, i) => (
                            <Col key={`right-btn-${i}`}>{btn}</Col>
                        ))}
                        {paginStatus && paginConfig?.suppress && (
                            <EditTablePagination
                                defaultHeaderTableStyle={defaultTableHeaderStyle}
                                total={tableRow.length}
                                themeMode={themeMode}
                                theme={theme}
                                initialPage={currentPage}
                                pageSize={{
                                    default: pageSize,
                                    values: [10, 20, 30, 40, 50, 100, 500],
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
                        <ECAGButtonDownload
                            buttonStyle={{
                                height: '35px',
                                width: '35px',
                                color: defaultTableHeaderStyle.color,
                                background:
                                    themeMode == 'dark' && interfaceView == 'showcase'
                                        ? defaultTableHeaderStyle.background
                                        : '#ffffff',
                            }}
                            columns={colDefs}
                            rows={tableRow}
                        />
                        {!hideSettingsButton && (
                            <ECAGEditedColumnModal
                                buttonStyle={{
                                    height: '35px',
                                    width: '35px',
                                    color: defaultTableHeaderStyle.color,
                                    background:
                                        themeMode == 'dark' && interfaceView == 'showcase'
                                            ? defaultTableHeaderStyle.background
                                            : '#ffffff',
                                }}
                                columns={noStringWidthColumns}
                                tableId={tableId}
                                onSave={(cols) => updateAccountColumns(tableId, cols)}
                                onReset={() => updateAccountColumns(tableId, noStringWidthColumns)}
                                gridApiRef={gridRef}
                                setColDefs={setColDefs}
                                originalTable={columns}
                            />
                        )}
                    </Space>
                </Col>
            </Row>
            <div
                style={resultedGridCSS}
            >
                <style>
                    {`
          .custom-row {
          display: flex;
          cursor: pointer;
          align-items: center;
            border-bottom: 1px solid rgb(81, 81, 81) !important; /* Добавляет белую полоску между строками */
          }
            .ag-header-cell {
            padding: 0;
            border-bottom: 1px solid rgb(81, 81, 81) !important;; /* Добавляет белую линию под заголовками колонок */
          }
            .centered-header {
            text-align: center; /* Центрирует текст в заголовках */
          }
        `}
                </style>
                <AgGridReact
                    className={`${interfaceView} ${tableId} ${classes}`}
                    onGridReady={onGridReady}
                    gridOptions={resultedGridOptions}
                    rowData={tableRow}
                    ref={gridRef}
                    columnDefs={colDefs}
                    pagination={paginStatus}
                    paginationPageSize={pageSize}
                    suppressHorizontalScroll={supressHorizScroll}
                    paginationPageSizeSelector={[10, 20, 30, 40, 50, 100, 500]}
                    suppressPaginationPanel={paginConfig?.suppress}
                    rowSelection="multiple"
                    onSortChanged={onSortChanged}
                    loading={loading}
                    onRowClicked={onRowClicked}
                    domLayout={paginConfig.layout ? 'normal' : 'autoHeight'}
                    getRowStyle={useTheme ? mergeRowStyles : getExportRowStyle}
                />
            </div>
        </div>
    )
}

export default ECAGTable

// table_${isShowcase ? themeMode : ''}