export const massActionsStatus = {
    'queued_to_check': { name: 'В очереди на проверку', buttons: ['delete'] },
    'checking': { name: 'Идёт проверка', buttons: ['delete'] },
    'checked': { name: 'Проверено', buttons: ['play', 'show-result', 'delete', 'download'] },
    'queued_to_process': { name: 'В очереди на выполнение', buttons: ['delete'] },
    'processing': { name: 'Выполняется', buttons: [] },
    'success': { name: 'Успешно', buttons: ['show-result', 'download'] },
    'failed': { name: 'Ошибка', buttons: ['show-error'] },
}

export const massActionsTypes = {
    'objects-export': 'Экспорт объекта',
    'objects-import': 'Импорт объекта',
}