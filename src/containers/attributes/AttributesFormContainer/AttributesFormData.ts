export const visibilityOptions = [
    'public - Открытый',
    'protected - Защищённый',
    'private - Закрытый',
    'package - Пакетный',
].map((opt) => opt.split(' - ')).map(([v, l]) => {
    return { value: v, label: l }
})

export const attributesFormDefaultValues = {
    name: '',
    visibility: 'public',
    dataType: undefined,
    initialValue: undefined,
    staticValue: undefined,
    multiplicity: {
        left: 0,
        right: 0 // при отправке конвертировать в null
    },
    unit: '',
    secondary_view_type_ids: [],
    params: {
        syntax: '',
        formLayout: {
            cols: ''
        }
    },
    attributeCategory: undefined,
    attributeStereotype: undefined,
    sortOrder: undefined,
    package: undefined,
    classes: undefined,
    historyToCache: false,
    historyToDb: false,
    readonly: false,
    viewType: undefined,
    icon: undefined,
    codename: undefined,
    description: undefined,
}

export const attributesFormItemNames = Object.keys(attributesFormDefaultValues)
    .reduce((obj, k) => ({ ...obj, [k]: k }), {} as Record<keyof typeof attributesFormDefaultValues, string>)