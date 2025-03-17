export const TYPE_OPTIONS = [
    {
        label: 'Кнопка',
        value: 'button',
    },
    {
        label: 'Разделитель',
        value: 'delimiter',
    },
]

export const TYPE_FUNCTIONAL = [
    {
        label: 'Информация об объекте',
        value: 'objectInfo',
    },
    {
        label: 'Справка о странице',
        value: 'pageInfo',
    },
    {
        label: 'Редактирование',
        value: 'edit',
    },
    {
        label: 'Мультиграфик',
        value: 'multiCharts',
    },
    {
        label: 'Инструменты',
        value: 'tools',
    }
]

export const BUTTON_PRESETS = {
    objectInfo: {
        itemType: 'button',
        itemIcon: 'InfoOutlined',
        itemName: 'Информация об объекте',
        itemDescription: 'Аттрибуты объекта',
        itemFunctional: 'objectInfo',
    },
    pageInfo: {
        itemType: 'button',
        itemIcon: 'FiInfo',
        itemName: 'Информация о странице',
        itemDescription: 'Данные страницы',
        itemFunctional: 'pageInfo',
    },
    edit: {
        itemType: 'button',
        itemIcon: 'EditOutlined',
        itemName: 'Редактирование',
        itemDescription: 'Изменение текущих параметров объекта',
        itemFunctional: 'edit',
    },
    multiCharts: {},
    tools: {
        itemType: 'button',
        itemIcon: 'ToolOutlined',
        itemName: 'Инструменты',
        itemDescription: 'Набор вспомогательных инструментов',
        itemFunctional: 'tools',
    },
    forceMeas: {
        itemType: 'button',
        itemIcon: 'FiPlayCircle',
        itemName: 'Опросить всё',
        itemDescription: 'Произвести измерения на текущем объекте',
        itemFunctional: 'forceMeas',
    },
    ssh_terminal: {
        itemType: 'button',
        itemIcon: 'FiTerminal',
        itemName: 'SSH терминал',
        itemDescription: 'Открыть SSH терминал',
        itemFunctional: 'ssh_terminal',
    },
    device_cotrol_panel: {
        itemType: 'button',
        itemIcon: 'CodeOutlined',
        itemName: 'Консоль управления',
        itemDescription: 'Открыть консоль управления',
        itemFunctional: 'device_cotrol_panel',
    },
    rdp_client: {
        itemType: 'button',
        itemIcon: 'FiMonitor',
        itemName: 'RDP клиент',
        itemDescription: 'Удалённый доступ к устройству',
        itemFunctional: 'rdp_client',
    },
}

export const TYPE_TO_LABEL = {
    button: 'Кнопка',
    delimiter: 'Разделитель'
}

export const FUNCTIONAL_TO_LABEL = {
    objectInfo: 'Информация об объекте',
    pageInfo: 'Справка о странице',
    multiCharts: 'Мультиграфик',
    edit: 'Редактирование',
    tools: 'Инструменты',
    ssh_terminal: 'SSH терминал',
    device_control_panel: 'Консоль управления',
    rdp_client: 'Консоль управления',
    forceMeas: 'Опросить всё',
}

export const directionOptions = [
    { label: 'Вертикально', value: 'vertical' },
    { label: 'Горизонтально', value: 'horizontal' },
]