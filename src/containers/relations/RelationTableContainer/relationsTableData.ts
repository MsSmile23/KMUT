import { relationsTypes } from '@shared/types/relations'
import { IEditTableProps } from '@shared/ui/tables/ECTable2/EditTable/types';

// todo: перенести куда-нибудь в shared
export const relationsTranslation: Record<keyof typeof relationsTypes, string> = {
    aggregation: 'Агрегация',
    association: 'Ассоциация',
    composition: 'Композиция',
    generalization: 'Генерализация',
    dependency: 'Зависимость',
}

export const relationTypesData: {type: keyof typeof relationsTypes, label: string}[] = [
    {
        type: 'association',
        label: 'Ассоциация',
    },
    {
        type: 'aggregation',
        label: 'Агрегация',
    },
    {
        type: 'composition',
        label: 'Композиция',
    },
    {
        type: 'generalization',
        label: 'Генерализация',
    },
    {
        type: 'dependency',
        label: 'Зависимость',
    },


]

export const relationsColumns: IEditTableProps['columns'] = [
    { key: 'actions', title: 'Действия', dataIndex: 'actions', width: 80, ellipsis: true },
    { key: 'id', title: 'ID', dataIndex: 'id', width: 80, align: 'center' as const, ellipsis: true },
    { key: 'name', title: 'Название', dataIndex: 'name', width: 300, ellipsis: true },
    { 
        key: 'relType', 
        title: 'Тип', 
        dataIndex: 'relType', 
        ellipsis: true, 
        filterType: 'select',
        filterSelectOptions: relationTypesData.map(({ type, label }) => ({ label, value: type })),
        filterValueKey: 'relTypeFilterKey'
    },
    { key: 'source', title: 'Источник', dataIndex: 'source', ellipsis: true },
    { key: 'sourceQual', title: 'Атрибут источника', dataIndex: 'sourceQual', ellipsis: true },
    { key: 'sourceMult', title: 'Кратность', dataIndex: 'sourceMult', width: 80, ellipsis: true },
    { key: 'aim', title: 'Цель', dataIndex: 'aim', ellipsis: true },
    { key: 'aimQual', title: 'Атрибут цели', dataIndex: 'aimQual', ellipsis: true },
    { key: 'aimMult', title: 'Кратность', dataIndex: 'aimMult', width: 80, ellipsis: true },
    { key: 'assClass', title: 'Класс связи', dataIndex: 'assClass', ellipsis: true },
    { key: 'stereoType', title: 'Стереотип связи', dataIndex: 'stereoType', ellipsis: true },

]

export const relationsPayload = { all: true, sort: '-id' }