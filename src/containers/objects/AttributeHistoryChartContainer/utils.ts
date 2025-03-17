import moment from 'moment';


const formatText = (str) => {
    return str.replace(/[.: ]/g, '_')
}

export const exportData = (seriesData) => {
    const nameForRows = `Дата и время;Значение (${seriesData.custom.params.unit})\n`
    const data = seriesData?.data || []

    if (!Array.isArray(data)) {
        return { success: false, message: 'Ошибка данных' }
    }

    if (data.length < 1) {
        return { success: false, message: 'Отсутствуют данные для экспорта' }
    }

    const csvContent = `${nameForRows}${data.map(values => {
        values[0] = moment.unix(values[0] / 1000).format('DD.MM.YYYY hh:mm:ss')
        values[1] = `${values[1]} ${seriesData.custom.params.unit}`

        return values.join(';')
    }).join('\n')}`
    
    const virtualDownloadElement = document.createElement('a');
    const file = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=windows-1251' });

    virtualDownloadElement.href = URL.createObjectURL(file);
    virtualDownloadElement.download = `${formatText(seriesData.name)}.csv`;
    document.body.appendChild(virtualDownloadElement);
    virtualDownloadElement.click();
    document.body.removeChild(virtualDownloadElement);

    return { success: true, message: 'Начало загрузки данных' }
}