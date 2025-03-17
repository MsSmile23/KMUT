interface IAttrValue{
    destination: number, 
    source: {
        value: number | string,
        source_type: number
    }
}

export interface IEffects {
id: number, 
state_id: number,
type: 'in'| 'out' | 'on',
class_id: number,
attribute_ids: number[],
action_type: 'create' |  'update' | 'delete' | 'add_row'| 'update_table',
table_name?: 'incidents'| 'messages',
values: IAttrValue[]
}

export type IEffectPost  = Omit<IEffects, 'id' | 'state_id'>


// //const values = [
//     {
//         "source": {
//             "type": 5, // Это указатель, что передано название таблицы
//             "value": "incidents" // or "messages"
//         },
//         "destination": "incidents" // or "messages"
//     },
//     {
//         "source": {
//             "type": 4,
//             "value": "object_id"
//         },
//         "destination": "object_id"
//     },
//     {
//         "source": {
//             "type": 1,
//             "value": "Высокая критичность"
//         },
//         "destination": "severity_level"
//     },
//     {
//         "source": {
//             "type": 4,
//             "value": "time_in"
//         },
//         "destination": "started_at"
//     },
//     {
//         "source": {
//             "type": 1,
//             "value": "Коммутатор или маршрутизатор недоступен"
//         },
//         "destination": "description"
//     },
//     {
//         "source": {
//             "type": 1,
//             "value": "Доступность"
//         },
//         "destination": "name"
//     },
// ]