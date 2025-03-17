export const reportColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        serverFilterValueKey: 'id',
        sorter: (a, b) => a.id - b.id,
        // defaultSortOrder: 'descend',
        // width: 40
    },

    {
        title: 'Скачать',
        dataIndex: 'format',
        // width: 100
    },
    {
        title: 'Тип отчета',
        dataIndex: 'report_type_id',
        serverFilterValueKey: 'report_type_id',
        // width: 150,
    },
    {
        title: 'Дата создания',
        dataIndex: 'createdAt',
        // width: 60
    },
    {
        title: 'Дата завершения',
        dataIndex: 'finishedAt',
        // width: 60
    },
    {
        title: 'Дата начала периода',
        dataIndex: 'dateCreation',
        // width: 60
    },
    {
        title: 'Дата конца периода',
        dataIndex: 'endProcessing',
        // width: 60
    },
    {
        title: 'Объекты',
        dataIndex: 'objectsQuantity',
        // width: 50,
        align: 'center'
    },
    {
        title: 'Статус',
        dataIndex: 'reportStatus',
        // width: 80
    },
    {
        title: 'Автор',
        dataIndex: 'authorReport',
        key: 'authorReport',
        // width: 50
    },
    {
        title: 'Состояние',
        dataIndex: 'progress',
        // width: 200
    },
    {
        title: '',
        dataIndex: 'actions',
        // width: 20,
        align: 'left'
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

export const taskColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        serverFilterValueKey: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend',
        width: 100
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
        width: 50
    },
    {
        title: 'Формат',
        dataIndex: 'format'
    },
    {
        title: 'Тип отчета',
        dataIndex: 'report_type_id',
        serverFilterValueKey: 'report_type_id',
    },
    {
        title: 'Дата создания',
        dataIndex: 'createdAt',
    },
    {
        title: 'Частота создания',
        dataIndex: 'frequency',
    },
    {
        title: 'Период построения',
        dataIndex: 'constructionPeriod',
    },
    {
        title: 'Время начала создания',
        dataIndex: 'frequencyStartedAt',
    },
    {
        title: 'Количество объектов',
        dataIndex: 'objectsQuantity',
    },
    {
        title: 'Статус',
        dataIndex: 'taskStatus',
    },
    {
        title: 'Автор',
        dataIndex: 'authorReport',
        key: 'authorReport',
        width: 50
    },

].map((col) => ({ ...col, key: col.dataIndex }))