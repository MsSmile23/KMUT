import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types';

const columns: IEditTableFilterSettings[] = [
    {
        title: 'Объект',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
    },
    {
        title: 'Статус объекта',
        dataIndex: 'object_state',
        key: 'object_state',
        width: '20%',
        valueIndex: {
            print: 'object_state_name',
            sort: 'object_state_name',
            filter: 'object_state_name'
        },
    }
]

export const objectWithOAStatesData = {
    columns
}