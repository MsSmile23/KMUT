import { EditTable } from "@shared/ui/tables/ECTable2/EditTable/EditTable"

export const NullCols = () => {
    return (
        <EditTable 
                tableId="test-table-23"
                columns={[
                    { key: 'id', title: 'id' },
                    { key: 'city', title: 'city' },
                    { key: 'age', title: 'age' },
                    //{ key: 'name', title: 'name' }
                ].map((col) => ({ ...col, dataIndex: col.key }))}
                rows={[
                    { key: 'art1', id: 1, city: 'Moscow1', age: 31, name: 'Artem1' },
                    { key: 'art2', id: 2, city: 'Moscow2', age: 32, name: 'Artem2' },
                    { key: 'art3', id: 3, city: 'Moscow3', age: 33, name: 'Artem3' }
                ]}
            />
    )
}