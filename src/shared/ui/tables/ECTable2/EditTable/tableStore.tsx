import { ColumnType } from 'antd/es/table'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TEditedColumn = ColumnType<any> & {
    visible: boolean
    hide?: boolean
}
type TEditedColumns = Partial<TEditedColumn>[]

interface IEditTableState {
    accountColumns: Record<string, TEditedColumns>
    updateAccountColumns: (tableId: string, columns: TEditedColumns) => void

    sortableColumns: any[]
    updateSortableColumns: (columns: TEditedColumns) => void

    page: number
    pageSize: number
    total: number
    updatePages: ({ page, pageSize, total }: Partial<{ page: number, pageSize: number, total: number }>) => void
}


export const useEditTableStore = create<IEditTableState>()(persist(
    (set) => ({
        // колонки для сохранения (обновляются после нажатия кнопки сохранить)
        accountColumns: undefined,
        updateAccountColumns: (tableId, columns) => set((state) => ({ 
            accountColumns: {
                ...state.accountColumns,
                // обновление любой таблицы с tableId
                [tableId]: columns.map((col) => ({
                    key: col.key,
                    visible: col.visible,
                    width: col.width,
                    hide: col.hide
                }))
            }
        })),

        // внутреннее для работы с текущими (несохраненными) колонками
        sortableColumns: [],
        updateSortableColumns: (columns) => set(() => ({ sortableColumns: columns })),

        // todo: сделать всю пагинацию через стор
        page: 1,
        pageSize: 10,
        total: 0,
        updatePages: (config) => set(() => ({ ...config }))


    }),
    { 
        name: 'editedTableStore',
        partialize: (state) => ({ accountColumns: state.accountColumns })
    }
))