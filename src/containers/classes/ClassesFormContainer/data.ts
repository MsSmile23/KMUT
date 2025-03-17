
export const FORM_NAMES = {
    NAME: 'name',
    VISIBILITY: 'visibility',
    PACKAGE: 'package_id',
    STEREOTYPE: 'class_stereotype_id',
    MULTIPLICITY_LEFT: 'multiplicity_left',
    MULTIPLICITY_RIGHT: 'multiplicity_right',
    IS_ABSTRACT: 'is_abstract',
    ICON: 'icon',
    CODE: 'codename'
}
export const columns = [
    { key: 'id', title: 'ID', width: '70px' },
    { key: 'name', title: 'Идентификатор', width: '500px', ellipsis: true, },
    { key: 'visibility', title: 'Видимость', },
    { key: 'multiplicity', title: 'Кратность', width: '100px' },
    { key: 'type', title: 'Тип', ellipsis: true, },
    { key: 'startValue', title: 'Начальное значение', ellipsis: true, },
    { key: 'staticFuture', title: 'Фиксированное значение', ellipsis: true, },
    { key: 'sortOrder', title: 'Сортировка', ellipsis: true,   width: '70px' },
    { key: 'bd', title: 'БД', width: '75px' },
    { key: 'cash', title: 'Кэш', width: '75px' },
    { key: 'readonly', title: 'Только чтение', width: '75px' },
    { key: 'actions', title: '' },
].map((col) => ({ ...col, dataIndex: col.key }))

export const operationsColumns = [
    { key: 'id', title: 'Идентификатор' },
    { key: 'name', title: 'Название' },
].map((col) => ({ ...col, dataIndex: col.key }))