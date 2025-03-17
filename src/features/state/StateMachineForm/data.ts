export const FORM_NAMES = {
    ATTRIBUTES: 'attributes',
    CLASSES: 'classes',
    ID: 'id',
    NAME: 'name',
    RULE_NAME: 'rule_name',
    HAS_ATTRIBUTES: 'has_attributes',
}


export const operationsColumns = [
    { key: 'state', title: 'Состояние', width: '90vw' },
    { key: 'actions', title: 'Действия', width: '5vw', },
].map((col) => ({ ...col, dataIndex: col.key }))