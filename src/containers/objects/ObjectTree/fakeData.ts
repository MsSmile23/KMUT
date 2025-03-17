export const mockClassificators = {
    39: {
        id: 39,
        name: 'Интерфейс',
        children: [
            {
                id: 10001,
                class_id: 39,
                name: 'Интерфейс центрального сервера измерений',
                state_id: null
            },
            {
                id: 10002,
                class_id: 39,
                name: 'Интерфейс Зонда 161',
                state_id: null
            }
        ]
    },
    40: {
        id: 40,
        name: 'Зонд',
        children: [
            {
                id: 10003,
                class_id: 40,
                name: 'Зонд 161',
                state_id: null
            },
            {
                id: 10004,
                class_id: 40,
                name: 'Центральный сервер измерений',
                state_id: null
            }
        ]
    },
    42: {
        id: 42,
        name: 'Автоматизированное рабочее место (АРМ)',
        children: [
            {
                id: 10015,
                class_id: 42,
                name: 'АРМ в офисе 321',
                state_id: 11
            },
            {
                id: 10042,
                class_id: 42,
                name: 'Отключенный АРМ в офисе 304',
                state_id: 10
            }
        ]
    },
    44: {
        id: 44,
        name: 'Android приставка',
        children: [
            {
                id: 10019,
                class_id: 44,
                name: 'Android приставка в 321 офисе',
                state_id: null
            }
        ]
    },
    10002: {
        id: 10002,
        name: 'Обслуживающая огранизация',
        children: [
            {
                id: 10043,
                class_id: 10002,
                name: 'Обслуживающая организация школы',
                state_id: null
            }
        ]
    },
    10003: {
        id: 10003,
        name: 'Статус',
        children: [
            {
                id: 10047,
                class_id: 10003,
                name: 'Открыта',
                state_id: null
            },
            {
                id: 10045,
                class_id: 10003,
                name: 'Закрыта',
                state_id: null
            }
        ]
    },
    10004: {
        id: 10004,
        name: 'Приоритет',
        children: [
            {
                id: 10049,
                class_id: 10004,
                name: 'Первый',
                state_id: null
            },
            {
                id: 10046,
                class_id: 10004,
                name: 'Второй',
                state_id: null
            }
        ]
    },
    byType: {
        id: 0,
        name: 'Тип объекта',
        children: [
            {
                id: 95,
                name: 'Школа'
            },
            {
                id: 41,
                name: 'Канал'
            },
            {
                id: 40,
                name: 'Зонд'
            },
            {
                id: 42,
                name: 'Автоматизированное рабочее место (АРМ)'
            },
            {
                id: 43,
                name: 'Пользователь АРМ'
            },
            {
                id: 44,
                name: 'Android приставка'
            }
        ]
    }
}