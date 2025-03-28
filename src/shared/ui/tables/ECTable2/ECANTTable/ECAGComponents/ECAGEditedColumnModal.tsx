import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react'
import { useOpen } from '@shared/hooks/useOpen'
import { Button, ConfigProvider, Drawer, Space } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { SettingOutlined } from '@ant-design/icons'
import * as Icons from '@ant-design/icons'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { updateObjectByPath } from '@shared/utils/common'
import { ECTooltip } from '@shared/ui/tooltips'
import { useDebounceCallback } from '@shared/hooks/useDebounce'
import '../ECAGCSS/resizeBar.css'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useTheme } from '@shared/hooks/useTheme'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
import { useEditTableTheme, usePatchAccountTableSettings } from '@shared/ui/tables/ECTable2/EditTable/hooks'
import { useEditTableStore } from '@shared/ui/tables/ECTable2/EditTable/tableStore'
import { ECAGEditedColumn } from './ECAGEditedColumn'
interface IEditedColumnModalProps {
    // todo: почему при итерации нельзя достать col.visible
    // из ColumnsType<{ sortableTitle?: string, visible?: boolean }> ?
    columns?: any[]
    tableId?: string
    onSave?: (columns: ColumnType<any>[]) => void
    onReset?: (columns: ColumnType<any>[]) => void
    icon?: React.ReactNode | string
    buttonStyle?: CSSProperties
    gridApiRef?: any
    setColDefs?: any
    originalTable?: any[]
}

export const ECAGEditedColumnModal: FC<IEditedColumnModalProps> = ({
    columns = [],
    tableId,
    onSave,
    onReset,
    icon,
    buttonStyle,
    gridApiRef,
    setColDefs,
    originalTable,
}) => {
    const { editTable } = useEditTableTheme()
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const isShowcase = interfaceView === 'showcase'
   
    const background = useMemo(() => {
        return isShowcase
            ? createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) ?? '#ffffff'
            : '#ffffff'
    }, [theme, themeMode])
    const color = useMemo(() => {
        return isShowcase ? createColorForTheme(theme?.textColor, theme?.colors, themeMode) ?? '#000000' : '#000000'
    }, [theme, themeMode])

    const modal = useOpen()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const accountColumns = useEditTableStore((st) => ({
        data: st.accountColumns?.[tableId] || [],
        update: st.updateAccountColumns,
    }))
    const accountColumnsCached = useMemo(() => accountColumns.data, [accountColumns.data])

    const sortableColumns = useEditTableStore((st) => ({
        data: st.sortableColumns,
        update: st.updateSortableColumns,
    }))

    const account = useAccountStore((st) => st.store.data)
    const updateAccount = useAccountStore((st) => st.setData)
    const forceUpdate = useAccountStore((st) => st.forceUpdate)
    const accountSettings = usePatchAccountTableSettings()
    const accountSettingsString = JSON.stringify(accountSettings?.data || {})

    const updateAGGridColumns = (updatedColumns) => {
        if (gridApiRef?.current) {
            if (updatedColumns?.data && updatedColumns?.data.length > 0) {
                const agGridColumns = updatedColumns.data.map((col) => ({
                    ...col,
                    hide: col.hide === undefined ? false : col.hide, // Не инвертируем hide
                }))

                setColDefs(agGridColumns) // Обновляем colDefs
            } else {
                // Если updatedColumns пустой, используем текущее состояние colDefs
                setColDefs((prevColDefs) => prevColDefs || []) // Предотвращаем пустую таблицу
            }
        }
    }

    useEffect(() => {
        if (accountSettings?.inited) {
            const settings = JSON.parse(accountSettingsString) as unknown as (typeof accountSettings)['data']
            const columns = settings?.tables?.[tableId]?.columns || []

            accountColumns.update(tableId, columns)
        }
    }, [accountSettings?.inited, accountSettingsString])

    useEffect(() => {
        if (!modal.isOpen) {
            return
        }

        if (accountColumnsCached.length === 0) {
            sortableColumns.update(columns)

            return
        }

        const sortedColumns = columns
            .map((col) => {
                const savedCol = accountColumnsCached?.find((acol) => acol?.key === col?.key)
                const savedColIndex = accountColumnsCached?.findIndex((acol) => acol?.key === col?.key)

                const props = {
                    hide: savedCol?.hide === undefined ? false : savedCol.hide,
                    width: savedCol?.width,
                }

                if (savedCol && savedColIndex >= 0) {
                    return { ...col, ...props, order: savedColIndex }
                } else {
                    return { ...col, ...props }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            })
            .slice()
            .sort((a, b) => a?.order - b?.order)
            .map(({ order = 0, ...col }) => col)

        sortableColumns.update(
            sortedColumns.map((accountCol) => {
                const col = columns.find((col) => col.key === accountCol.key)

                return {
                    ...col,
                    key: accountCol?.key,
                    field: col.key,
                    headerName: col.headerName,
                    hide: accountCol.hide, // Не инвертируем hide
                    width: accountCol?.width,
                }
            })
        )
        updateAGGridColumns(sortableColumns)
    }, [modal.isOpen, accountColumnsCached])

    // console.log(sortableColumns)

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active?.id !== over?.id) {
            const oldIndex = sortableColumns.data.findIndex((col) => col?.key === active?.id)
            const newIndex = sortableColumns.data.findIndex((col) => col?.key === over?.id)

            sortableColumns.update(arrayMove(sortableColumns.data, oldIndex, newIndex))
        }
    }

    const updateSortableColumns = (key: string, fields: Record<string, any>) => {
        const updatedColumns = sortableColumns.data.map((col) => {
            if (col.key === key) {
                return {
                    ...col,
                    hide: fields.hide === undefined 
                        ? col.hide : fields.hide, // Сохраняем текущее значение, если fields.hide undefined
                    ...fields,
                }
            }

            return col
        })
        // console.log("Данные в функции обновления", updatedColumns)

        sortableColumns.update(updatedColumns)
    }

    //

    const closeDrawer = async () => {
        const response = await accountSettings.patch(tableId, sortableColumns.data)

        if (response?.success) {
            onSave?.(sortableColumns.data)
            updateAccount({
                ...updateObjectByPath(account, `user.settings.tables.${tableId}.columns`, sortableColumns.data),
            })
            modal.close()
        }
    }

    const resetColumns = () => {
        sortableColumns.update(
            originalTable.map((col) => ({
                ...col,
                hide: col?.hide === undefined ? false : col.hide,
                width: col?.width === undefined ? 200 : col.width,
            }))
        )
    }

    const Icon = typeof icon === 'string' && Icons?.[icon]

    const [drawerWidth, setDrawerWidth] = useState(account?.user?.settings?.tables?.settingsDrawerWidth ?? 500)
    const startResizing = useDebounceCallback((startEvent: MouseEvent) => {
        startEvent.preventDefault()
        const startWidth = drawerWidth ?? 500
        const minWidth = 450
        const maxWidth = 1000

        const startX = startEvent.pageX

        function resizing(resizeEvent: MouseEvent) {
            resizeEvent.preventDefault()
            const diffX = resizeEvent.pageX - startX
            const newWidth = Number(startWidth - diffX)

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setDrawerWidth((prev) => startWidth - resizeEvent.pageX + startX)
            }
        }

        function endResizing(endEvent: MouseEvent) {
            endEvent.preventDefault()

            document.body.removeEventListener('mousemove', resizing)
            document.body.removeEventListener('mouseup', endResizing)
        }

        if (startEvent.type === 'mousedown') {
            document.body.addEventListener('mouseup', endResizing)
            document.body.addEventListener('mousemove', resizing)
        }
    }, 100)

    const saveDrawerWidth = useDebounceCallback(async () => {
        const newSettings = {
            ...account?.user?.settings,
            tables: { ...account?.user?.settings?.tables, settingsDrawerWidth: drawerWidth },
        }
        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({
            settings: newSettings,
        })

        if (response?.success) {
            forceUpdate()
        }
    }, 200)

    useEffect(() => {
        saveDrawerWidth()
    }, [drawerWidth])

    return (
        <ConfigProvider
            theme={{
                components: {
                    Drawer: {
                        footerPaddingBlock: 0,
                        footerPaddingInline: 0,
                    },
                },
            }}
        >
            <ECTooltip title="Редактирование столбцов" mouseEnterDelay={1}>
                <Button
                    onClick={modal.open}
                    icon={Icon ? <Icon /> : icon || <SettingOutlined />}
                    shape="circle"
                    style={buttonStyle}
                />
            </ECTooltip>
            <Drawer
                closable={false}
                open={modal.isOpen}
                onClose={() => {
                    sortableColumns.update([])
                    modal.close()
                }}
                width={`${drawerWidth}px`}
                title={<div style={{ color: color }}>Редактирование таблицы </div>}
                styles={{
                    body: { padding: '24px 0px', backgroundColor: background },
                    header: {
                        backgroundColor: background,
                        color: color,
                    },
                    footer: {
                        borderTop: 'none',
                    },
                }}
                destroyOnClose
                footer={
                    <Space
                        style={{
                            background: background,
                            height: editTable?.Drawer?.style?.footerHeight,
                            width: '100%',
                            paddingLeft: 24,
                            boxSizing: 'border-box',
                        }}
                    >
                        {onSave && (
                            <Button
                                style={{ width: 140 }}
                                type="primary"
                                onClick={closeDrawer}
                                disabled={accountSettings.loading}
                            >
                                Обновить
                            </Button>
                        )}
                        {onReset && (
                            <Button style={{ width: 140 }} onClick={resetColumns} disabled={accountSettings.loading}>
                                Сбросить
                            </Button>
                        )}
                    </Space>
                }
            >
                <div
                    style={{
                        overflowY: 'auto',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            userSelect: 'none',
                            padding: '0px 24px',
                        }}
                    >
                        <div
                            className="resizeBar"
                            onClick={(e) => {
                                // Добавлено, чтобы отсечь на клик евенте срабатывание ресайза при помощи startResizing
                                startResizing(e)
                            }}
                            onMouseDown={(e) => {
                                startResizing(e)
                            }}
                        >
                            &nbsp;
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={sortableColumns.data.map((col) => col?.key)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sortableColumns.data.map(
                                    (col) =>
                                        col?.key !== 'virtualColumn' && (
                                            <div key={col?.key}>
                                                <ECAGEditedColumn
                                                    id={col?.key}
                                                    title={col?.sortableTitle ? col?.sortableTitle : col?.headerName}
                                                    hide={col?.hide}
                                                    width={col?.width}
                                                    onClick={({ hide }) => updateSortableColumns(col.key, { hide })}
                                                    onWidthChange={(width) => updateSortableColumns(col.key, { width })}
                                                />
                                            </div>
                                        )
                                )}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </Drawer>
        </ConfigProvider>
    )
}