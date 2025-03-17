export const reportColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        serverFilterValueKey: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend',
    },
    {
        title: 'Тип отчета',
        dataIndex: 'nameReport',
        serverFilterValueKey: 'report_type_id',
    },
    {
        title: 'Дата создания',
        dataIndex: 'createdAt',
    },
    {
        title: 'Дата завершения',
        dataIndex: 'finishedAt',
    },
    {
        title: 'Дата начала периода',
        dataIndex: 'dateCreation',
    },
    {
        title: 'Дата конца периода',
        dataIndex: 'endProcessing',
    },
    {
        title: 'Количество объектов',
        dataIndex: 'objectsQuantity',
        
    },
    {
        title: 'Статус',
        dataIndex: 'reportStatus',
    },
    {
        title: 'Состояние',
        dataIndex: 'progress',
    },
    {
        title: 'Формат',
        dataIndex: 'format'
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
    },
].map((col) => ({ ...col, key: col.dataIndex }))

export const createdReportStatuses = [
    'Ожидает построения',
    'В процессе генерации',
    'Декорируется',
    'Ожидает декорирования',
    'Готов',
    'Ошибка генерации',
    'Ошибка декорирования'
]