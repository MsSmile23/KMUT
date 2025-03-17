import { LicenseDataHeads } from '@shared/types/license';

// Функции и заголовки 

export const licenseTableHead: LicenseDataHeads[] = [
    {
        title: 'Параметры',
        dataIndex: 'description',
        
    },
    {
        title: 'Лицензия',
        dataIndex: 'limit',
    },
    {
        title: 'Текущее значение',
        dataIndex: 'current',
    },
]

export const selectedMainKeys = ['from', 'till'];

export const licenseTranslate = {
    from: 'С',
    till: 'До',
    classes: 'Классы',
    attributes: 'Атрибуты',
    objects: 'Объекты',
    users: 'Пользователи',
    vtemplates: 'Макеты'
}

export const licenseMockData = {
    main: {
        sn: 'some-people',
        from: '2023-12-01',
        till: '2124-10-20',
        valid: false, 
    },
    limits: {
        classes: 999999,
        attributes: 999999,
        objects: 999999,
        users: 999999,
        vtemplates: 999999
    },
    current: {
        classes: 1000,
        attributes: 1200,
        objects: 1400,
        users: 7,
        vtemplates: 500
    }
}