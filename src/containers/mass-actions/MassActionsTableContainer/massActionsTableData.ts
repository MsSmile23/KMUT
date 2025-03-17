import { IMassActions } from '@shared/types/mass-actions'

export const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
    },
    {
        title: 'Название',
        dataIndex: 'names',
    },
    {
        title: 'Описание',
        dataIndex: 'description',
    },
    {
        title: 'Тип',
        dataIndex: 'type',
    },
    {
        title: 'Статус',
        dataIndex: 'status',
    },
    {
        title: 'Создан',
        dataIndex: 'created_at',
    },
    {
        title: 'Обработан',
        dataIndex: 'updated_at',
        // key: 'actions',
        // width: '5%',
    },
]

export const mockData: IMassActions[] = [
    {
        id: 1,
        names: 'Test 1',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [10189],
        status: 'queued_to_process',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 2,
        names: 'Test 2',
        description: 'Описание',
        type: 'objects-import',
        params: '',
        source_file_ids: [10190],
        status: 'checked',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 3,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [10191],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 4,
        names: 'Test 4',
        description: 'Описание',
        type: 'objects-import',
        params: '',
        source_file_ids: [],
        status: 'checked',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 5,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 6,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 7,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 8,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'processing',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 9,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 10,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 11,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 12,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 13,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 14,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 15,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 16,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 17,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 18,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 19,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 20,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
    {
        id: 21,
        names: 'Test 3',
        description: 'Описание',
        type: 'objects-export',
        params: '',
        source_file_ids: [],
        status: 'failed',
        report: '',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
    },
]

export const mnemo = 'standart-user-id'