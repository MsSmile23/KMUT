export const netflowColumnsKeysTitles = {
    'id': 'ID', 
    'src_codename': 'Источник',
    'dst_codename': 'Получатель',
    'date': 'Дата',
    'srcip': 'IP источника',
    'srcport': 'Порт источника',
    'dstip': 'IP получателя',
    'dstport': 'Порт получателя',
    'bytes': 'Кол-во байт',
    'type': 'Тип',
    'class': 'Класс',
    'tos': 'ToS',
};

const netflowColumnsWidth = {
    'id': 50, 
    'src_codename': 300,
    'dst_codename': 300,
    'date': 100,
    'srcip': 120,
    'dstip': 120,
    'srcport': 120,
    'dstport': 120,
    'bytes': 80,
    'type': 100,
    'class': 50,
    'tos': 30,
}

const columnServerFilterValueKeys = new Set([
    'id', 'src_codename', 'dst_codename', 'date', 'type', 'class',
    'srcip', 'dstip', 'srcport', 'dstport', 'bytes', 'tos'
]);

const dateKeys = new Set([
    'date', 
]);

export const netflowColumns = Object.entries(netflowColumnsKeysTitles).map(([key, title]) => {
    const col = { 
        key, 
        title, 
        dataIndex: key,
        // width: netflowColumnsWidth[key] || 0,
        ...(columnServerFilterValueKeys.has(key) && {
            serverFilterValueKey: key, 
            defaultSortOrder: 'descend',
            ...(dateKeys.has(key) && { filterType: 'date' })
        }),
        sorter: {}
    };
    
    return col;
});