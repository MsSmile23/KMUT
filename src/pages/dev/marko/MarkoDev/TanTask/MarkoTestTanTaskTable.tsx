import { ButtonCreatable } from '@shared/ui/buttons'
import { Button, Col, Row, Space, Table } from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ECTooltip } from '@shared/ui/tooltips'
import { EditTablePagination } from '@shared/ui/tables/ECTable2/EditTable/EditTablePagination'
import MarkoTestButtonDownload from '../MarkoTestButtonDownload'
import { EditedColumnModal } from '@shared/ui/tables/ECTable2/EditTable/EditedColumnModal'
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons'
import { markoTestPagination } from '../MarkoTestData'
import { merge } from 'lodash'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useEditTableTheme } from '@shared/ui/tables/ECTable2/EditTable/hooks'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'

const MarkoTestTanTaskTable: FC = ({ data, columns, currentTheme }) => {
    const [paginStatus, setPaginStatus] = useState(true)
    const [sorting, setSorting] = useState<SortingState>([])
    const parentRef = useRef(null)
    const [filters, setFilters] = useState({}) // Состояние фильтров
    // const [filteredData, setFilteredData] = useState(data);
    const { editTable, themeName, theme } = useEditTableTheme(currentTheme)
    const accountData = useAccountStore(selectAccount)
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const isShowcase = interfaceView === 'showcase'
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const [defaultTableHeaderStyle, setDefaultTableHeaderStyle] = useState<any>({
        ...editTable?.ButtonsCard?.bodyStyle,
        padding: '22px 16px',
        background: 'rgb(233, 247, 252)',
        borderRadius: '8px 8px 0px 0px',
        display: 'flex',
        justifyContent: 'space-between',
    })

    const backgroundTableContent = useMemo(() => {
        return createColorForTheme(theme?.table?.content?.background, theme?.colors, themeMode)
    }, [theme, themeMode])
    const color = isShowcase
        ? createColorForTheme(theme?.table?.header?.textColor, theme?.colors, themeMode)
        : '#000000'

    useEffect(() => {
        if (interfaceView == 'showcase') {
            if (theme?.table && theme.colors) {
                const tableStyle = theme.table

                // if (theme?.table?.net?.show) {
                //     setBorderedTable(true)
                // }

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
            if (columns && theme) {
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
        if (data?.length == 0) {
            const thArray = document?.querySelectorAll('.ant-table-cell')

            thArray?.forEach((item: any) => {
                if ('style' in item) {
                    item.style.backgroundColor = backgroundTableContent
                    item.style.color = `${color || '#000000'} !important` //color
                }
            })
        }
    }, [data, backgroundTableContent, themeMode])

    const filteredData = data.filter((row) => {
        return Object.keys(filters).every((key) => {
            if (!filters[key]) return true // Если фильтр пустой, пропускаем
            return String(row[key]).toLowerCase().includes(filters[key].toLowerCase())
        })
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
    })

    // console.log('Темы', theme)
    // console.log('Моды Темы', themeMode)
    // console.log('Тема хедеров', defaultTableHeaderStyle)
    // console.log('Тема фона таблицы', backgroundTableContent)
    // console.log('цвет', color)

    return (
        <div>
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
                    </Space>
                </Col>
                <Col>
                    <Space>
                        {paginStatus && (
                            <EditTablePagination
                                total={table.getRowCount()}
                                initialPage={table.getState().pagination.pageIndex + 1}
                                pageSize={{
                                    default: 10,
                                    values: markoTestPagination,
                                }}
                                onChange={(page, size) => {
                                    table.setPageSize(size)
                                    table.setPageIndex(page - 1)
                                }}
                            />
                        )}
                        <MarkoTestButtonDownload
                            buttonStyle={{ height: '35px', width: '35px' }}
                            columns={columns}
                            rows={data}
                        />
                        <EditedColumnModal buttonStyle={{ height: '35px', width: '35px' }} />
                    </Space>
                </Col>
            </Row>
            <div
                ref={parentRef}
                style={{ height: paginStatus ? `400px` : `${rowVirtualizer.getTotalSize()}px`, overflowY: 'auto' }}
            >
                <table
                    {...{
                        style: {
                            width: table.getCenterTotalSize(),
                        },
                    }}
                >
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize(), height: '80px' }}
                                        onClick={header.column.getToggleSortingHandler()} // Добавляем обработчик сортировки
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{ asc: '  ↑', desc: '  ↓' }[header.column.getIsSorted()] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {paginStatus ? (
                            <>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} style={{ height: '60px' }}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                    const row = table.getRowModel().rows[virtualRow.index]
                                    return (
                                        <tr key={row.id} style={{ height: '60px' }}>
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MarkoTestTanTaskTable
