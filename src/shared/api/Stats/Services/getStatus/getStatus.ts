/* eslint-disable */

//import ruleReactTypeValuesStore from "@store/RootStore/RuleReactTypeValues/ruleReactTypeValuesStore";
//import {toJS} from "mobx";

export const getStatus = (value:any, values: any, limits) => {

    const chartLimits = [
        {
            "id": 2,
            "description": "В норме",
            "colors": "#5cb85c",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 1,
                "name": "Статус",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 4
        },
        {
            "id": 3,
            "description": "Отклонение",
            "colors": "#ffcc33",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 1,
                "name": "Статус",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 5
        },
        {
            "id": 4,
            "description": "Недоступно",
            "colors": "#990000",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 1,
                "name": "Статус",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 6
        },
        {
            "id": 5,
            "description": "Отклонения",
            "colors": "#ffcc33",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 2,
                "name": "Событие",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 2
        },
        {
            "id": 6,
            "description": "Нарушения",
            "colors": "#990000",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 2,
                "name": "Событие",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 3
        },
        {
            "id": 7,
            "description": "EL DOST F",
            "colors": "#990000",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 3,
                "name": "Триггер",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 0
        },
        {
            "id": 8,
            "description": "ST CPU FAIL",
            "colors": "#990001",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 3,
                "name": "Триггер",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 0
        },
        {
            "id": 9,
            "description": "Нет статуса",
            "colors": "#808080",
            "sla_flg": false,
            "active_flg": true,
            "rule_react_type": {
                "id": 1,
                "name": "Статус",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 2
        },
        {
            "id": 11,
            "description": "Перерыв",
            "colors": "#990000",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 2,
                "name": "Событие",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 4
        },
        {
            "id": 12,
            "description": "Норма",
            "colors": "#5cb85c",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 2,
                "name": "Событие",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 1
        },
        {
            "id": 13,
            "description": "На складе",
            "colors": "#428bca",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 1,
                "name": "Статус",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 3
        },
        {
            "id": 14,
            "description": "В ремонте",
            "colors": "#6a5acd",
            "sla_flg": true,
            "active_flg": true,
            "rule_react_type": {
                "id": 1,
                "name": "Статус",
                "created_at": "2023-01-23 14:38:04",
                "updated_at": "2023-01-23 14:38:04"
            },
            "sort": 11
        }
    ]

    // const entry = Object.entries(values || {})
    //     .find(([_key, obj]: [string, any]) => {
    //         return value >= obj.start && value <= obj.end
    //     })

    const entry = chartLimits.find((item) => item.id === value.status)

    if(entry) {
        return {
            colors:entry.colors,
            description:entry.description,
            id:entry.id
        }
    }

    // if (entry) {
    //     const [id] = entry
    //     const limit = limits.find((limit) => limit.id === Number(id))
    //
    //     if (limit) {
    //         return limit
    //     }
    // }

    return {
        colors: 'lightblue',
        description: 'Не задано',
        id: 0
    }
}