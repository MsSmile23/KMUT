import { VISIBILITY } from '@shared/config/const';
import { IEditTableProps } from '@shared/ui/tables/ECTable2/EditTable/types';

export const columns: IEditTableProps['columns'] = [
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
    },
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
        title: 'Имя класса',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Код',
        dataIndex: 'codename',
        key: 'codename',
    },
    { 
        title: 'Видимость', 
        dataIndex: 'visibility', 
        key: 'visibility',
        filterValueKey: 'visibilityFilterValue',
        filterType: 'select',
        filterSelectOptions: Object.entries(VISIBILITY).map(([ value, label ]) => ({ label, value }))
    },
    { 
        title: 'Пакет', 
        dataIndex: 'package', 
        key: 'package',
        filterValueKey: 'packageFilterValue',
    },
    {
        title: 'Стереотип',
        dataIndex: 'stereotype',
        key: 'stereotype',
        filterValueKey: 'stereotypeFilterValue',
    },
    {
        title: 'Кратность',
        dataIndex: 'multiplicity',
        key: 'multiplicity',
    },
    {
        title: 'Абстрактный',
        dataIndex: 'abstract',
        key: 'abstract',
        filterType: 'select',
        filterSelectOptions: [{ value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' }],
        filterValueKey: 'abstractFilterValue',
    },

]