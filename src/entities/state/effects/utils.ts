export const effectTypesOptions = [
    { value: 'in', label: 'Входит в состояние' },
    { value: 'out', label: 'Выходит из состояния' },
    { value: 'on', label: 'Находится в состоянии' },
]

export const actionTypesOptions = [
    { value: 'create', label: 'Создать' },
    { value: 'update', label: 'Обновить' },
    { value: 'delete', label: 'Удалить' },
    { value: 'add_row', label: 'Добавить системную сущность' },
    { value: 'update_table', label: 'Обновить системную сущность' },
]

export const sourceTypeOptions = [
    { value: 1, label: 'Фиксированное значение' },
    { value: 2, label: 'Название атрибута' },
    { value: 3, label: 'Значение атрибута' },
    { value: 4, label: 'Выбор из набора значений ' },
    { value: 5, label: 'Пользователи', disabled: true }
]

export const availableMnemonicsOptions = [
    { value: 'time_in', label: 'Время наступления состояния' },
    { value: 'time_out', label: 'Время окончания состояния' },
    { value: 'current_time', label: 'Текущее время' },
    { value: 'class_id', label: 'Класс, у объекта которого наступило состояние' },
    { value: 'object_id', label: 'Объект, получивший состояние' },
    { value: 'state_id', label: 'Состояние' },
    { value: 'attribute_id', label: 'Атрибут' }
]
export const incidentTablesOptions = [
    { value: 'incidents', label: 'Инциденты' },
    { value: 'messages', label: 'Уведомления' },
]

export const incidentUpdateOption = [{
    value: 'finished_at',
    label: 'Время завершения инцидента',
    required: true,
    type: 'string', 
    source: 4,
    mnemo: 'time_out',
    disabledSource: true,
    disableMnemo: true,
    disabled: true
}, 
{
    value: 'name',
    label: 'Название',
    required: true,
    type: 'string',
},
{
    value: 'description',
    label: 'Описание',
    required: true,
    type: 'string',
},]

export const incidentActionColumns = [{
    value: 'name',
    label: 'Название',
    required: true,
    type: 'string',
},
{
    value: 'description',
    label: 'Описание',
    required: true,
    type: 'string',
},
{
    value: 'object_id',
    label: 'Объект',
    required: true,
    type: 'integer',
    source: 4,
    mnemo: 'object_id',
    disabledSource: true,
    disableMnemo: true,
    disabled: true,
},
{
    value: 'started_at',
    label: 'Время начала',
    required: true,
    type: 'string',
    source: 4,
    disabledSource: true,
    filter: 'time',
    disabled: true,
},
{
    value: 'severity_level',
    label: 'Уровень критичности ',
    required: false,
    type: 'string',
    disabled: true,
},

]
export const messagesActionColumns = [{
    value: 'name',
    label: 'Название',
    required: true,
    type: 'string',
},
{
    value: 'body',
    label: 'Тело сообщения',
    required: true,
    type: 'string',
},
{
    value: 'recipients_ids',
    label: 'Получатели',
    required: true,
    type: 'array',
    disabledSource: true,
    source: 5,
    mnemo: [],
},
{
    value: 'created_at',
    label: 'Дата создания',
    required: false,
    type: 'timestamp',
},]




// private const MESSAGES_TABLE = [
//     "name" => "string", // Имя - Required
//     "body" => "string", // Тело сообщения - Required
//     "created_at" => "timestamp", // Дата создания - optional
//     "recipients_ids" => "array", // Получатели - Required
// ];
// private const INCIDENTS_TABLE = [
//     "name" => "string",  // Название инцидента - REQUIRED
//     "description" => "string", // Описание инцидента - REQUIRED
//     "object_id" => "integer", // Объект, на котором инцидент - REQUIRED
//     "started_at" => "string", // Время начала инцидента - REQUIRED
//     "severity_level" => "string", // Уровень критичности - OPTIONAL 
// ];