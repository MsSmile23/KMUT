import { IObject, IObjectAttribute } from '@shared/types/objects'
import { IEditTableProps } from '@shared/ui/tables/ECTable2/EditTable/types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const baseColumns: IEditTableProps['columns'] = [{
    key: 'id',
    dataIndex: 'id',
    title: 'ID',
    width: 75,
    align: 'center',
}, {
    key: 'building',
    dataIndex: 'building',
    title: 'Здание',
}, {
    key: 'monitoringObject',
    dataIndex: 'monitoringObject',
    title: 'Объект мониторинга',
}, {
    key: 'criticality',
    dataIndex: 'criticality',
    title: 'Критичность',
}, {
    key: 'favor',
    dataIndex: 'favor',
    title: 'Услуга',
}, {
    key: 'service',
    dataIndex: 'service',
    title: 'Сервис',
},]

// todo: как расширить ColumnsType, чтобы он принимал кастомные поля?
export const additionalColumns: any[] = [{
    key: 'duration',
    dataIndex: 'duration',
    title: 'Длительность',
}, {
    key: 'finished',
    dataIndex: 'finished',
    title: 'Статус инцидента',
}, {
    key: 'transition',
    dataIndex: 'transition',
    title: 'Переход',
}]

export const calcDuration = (incident: IObject, startId: number, finishId: number) => {
    const startValue = incident.object_attributes?.find((oa) => {
        return oa?.attribute_id === startId
    })?.attribute_value


    if (!startValue) {
        return 'Нет даты начала инцидента'
    }

    const start = new Date(startValue).getTime()
    const finishValue = incident.object_attributes?.find((oa) => {
        return oa.attribute_id === finishId
    })?.attribute_value
    const finish = finishValue ? new Date(finishValue).getTime() : Date.now()

    const seconds = (finish - start) / 1000
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60)

    return h ? `${h} ч ${m} мин` : `${m} мин`
}

export const calcDuration2 = (startTime: string, finishedTime: string) => {
    if (!startTime) {
        return 'Нет даты начала инцидента'
    }

    const start = new Date(startTime).getTime()
    const finish = finishedTime ? new Date(finishedTime).getTime() : Date.now()

    const seconds = (finish - start) / 1000
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60)

    return h ? `${h} ч ${m} мин` : `${m} мин`
}

type TPrimitive = string | number | boolean | undefined | null

export const findAttribute = (obj: IObject, attributeId?: number): IObjectAttribute | undefined => {
    return obj?.object_attributes?.find((oa) => oa.attribute_id === attributeId)
}
export const findAttributeValue = (obj: IObject, attributeId?: number): TPrimitive => {
    return findAttribute(obj, attributeId)?.attribute_value
}

export const ML = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAttributeBindId({ attributesBind, mnemo }: { attributesBind: Record<string, any>, mnemo: string }) {
        return attributesBind?.[mnemo]?.id || 0
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAttributeValue({ objectAttributes, id }: { objectAttributes: IObjectAttribute[], id: number }) {
        return objectAttributes?.find((oa) => oa?.attribute_id === id)?.attribute_value
    }
}

export const incidentColumnsKeysTitles = {
    id: 'ID',
    buildings: 'Здание',
    object_id: 'ID объекта',
    monitoringObject: 'Объект мониторинга',
    severity_level: 'Уровень критичности',
    favor: 'Услуга',
    services: 'Сервис',
    name: 'Название инцидента',
    description: 'Описание инцидента',
    started_at: 'Дата и время начала',
    finished_at: 'Дата и время окончания',
    sd_case_number: 'Номер заявки в SD',
    sd_application_status: 'Статус решения в SD',
    sd_responsible_name: 'Ответственный специалист',
    attempts: 'Количество неуспешных отправок',
    sync_status: 'Статус синхронизации',
    last_sync_date: 'Дата и времени последней попытки синхронизации',
    task_state_date: 'Дата получения состояния заявки',
    url: 'URL карточки инцидента в ИС',
    duration: 'Длительность',
    finished: 'Статус инцидента',
    transition: 'Переход',
};

const columnServerFilterValueKeys = new Set([
    'id', 'name', 'description', 'object_id', 'severity_level', 
    'sd_application_status', 
    'started_at', 'finished_at',
    'started_before', 'started_after', 'finished_before',
    'finished_after', 'sync_status', 'task_state_date'
]);

const dateKeys = new Set([
    'started_at', 'finished_at', 
    'started_before', 'started_after', 
    'finished_before', 'finished_after'
]);



export const incidentColumns = Object.entries(incidentColumnsKeysTitles).map(([key, title]) => {
    const col = { 
        key, 
        title, 
        dataIndex: key,
        ...(columnServerFilterValueKeys.has(key) && {
            serverFilterValueKey: key, 
            // defaultSortOrder: 'descend',
            ...(dateKeys.has(key) && { filterType: 'date' })
        }),
        ...(key === 'monitoringObject' && {
            serverFilterValueKey: 'object.name'
        })
    };
    
    return col;
});

export const incidentStatuses = [
    { mnemo: 'INC_SYNC_STATE_INITIAL', status: 10, name: 'Синхронизация запланирована' },
    { mnemo: 'INC_SYNC_STATE_NO_ASSET_ID', status: 20, name: 'Инцидент не подлежит синхронизации' },
    { mnemo: 'INC_SYNC_STATE_SOME_FLDS_NULL', status: 21, name: ' Инцидент не подлежит синхронизации' },
    { mnemo: 'INC_SYNC_STATE_OPEN_FAILED', status: 30, name: 'Отправка открытия не удалась' },
    { mnemo: 'INC_SYNC_STATE_OPEN_SUCC', status: 40, name: 'Отправка открытия успешна' },
    { mnemo: 'INC_SYNC_STATE_OPEN_GIVEUP', status: 50, name: 'Все попытки отправки открытия исчерпаны' },
    { mnemo: 'INC_SYNC_STATE_CLOSE_FAILED', status: 60, name: ' Отправка закрытия не удалась' },
    { mnemo: 'INC_SYNC_STATE_CLOSE_SUCC', status: 70, name: 'Отправка закрытия успешна' },
    { mnemo: 'INC_SYNC_STATE_CLOSE_GIVEUP', status: 80, name: 'Все попытки отправки закрытия исчерпаны' },
].reduce((hash, el) => ({ ...hash, [el.status]: el.name }), {})