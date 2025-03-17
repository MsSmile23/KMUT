export default {
    dataLabels: {
        backgroundColor:'#fff',
        color:'#fff',
        enabled: false
    },
    marker: {
        enabled: false
    },
    tooltip: {
        enabled:false
    },
    annotations: {
        backgroundColor:'#000',
        visible: false
    },
    series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        toolbar: false,
        alternateStartingDirection: true,
        data: [{
            name: 'Troms og Finnmark',
            parent: 'A',
            value: 5000,
        }, {
            name: 'Nordland',
            parent: 'A',
            value: 2500
        }, {
            name: 'Trøndelag',
            parent: 'B',
            value: 39494
        }, {
            name: 'Møre og Romsdal',
            parent: 'C',
            value: 13840
        }, {
            name: 'Vestland',
            parent: 'C',
            value: 31969
        }, {
            name: 'Rogaland',
            parent: 'C',
            value: 8576
        }, {
            name: 'Viken',
            parent: 'D',
            value: 22768,
            color:'#000'
        }, {
            name: 'Innlandet',
            parent: 'D',
            value: 49391,
            color:'#ffaaff'
        },
        {
            name: 'Oslo',
            parent: 'D',
            value: 454
        },
        {
            name: 'Vestfold og Telemark',
            parent: 'D',
            value: 15925
        },
        {
            name: 'Agder',
            parent: 'E',
            value: 14981
        }]
    }],
    lang: {
        decimalPoint: ',',
        thousandsSep: ' ',
        loading: 'Загрузка...',
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        rangeSelectorFrom: 'С',
        rangeSelectorTo: 'По',
        rangeSelectorZoom: 'Период',
        printChart: 'Печать графика',
        downloadPNG: 'Скачать PNG',
        downloadJPEG: 'Скачать JPEG',
        downloadPDF: 'Скачать PDF',
        downloadSVG: 'Скачать SVG',
        resetZoom: 'Сбросить масштаб',
        resetZoomTitle: 'Сбросить масштаб до 1:1',
        viewFullscreen: 'Полный экран',
        noData: 'Нет данных для отображения'
    },
    credits: {
        enabled: false
    },
}