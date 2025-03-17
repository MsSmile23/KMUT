import { Rule } from 'antd/es/form'
import { attributesFormDefaultValues } from '../AttributesFormContainer/AttributesFormData'
import { VISIBILITY } from '@shared/config/const'



type IAttributesKeys = keyof typeof attributesFormDefaultValues
interface IFormFieldProps {
    label: string,
    rules: Rule[],
    name: IAttributesKeys,
}

export const attributesProps: Record<IAttributesKeys, IFormFieldProps> = {
    name: { label: 'Идентификатор', rules: [{ required: true, message: 'Обязательно' }], name: 'name' },
    visibility: { label: 'Видимость', rules: [{ required: true, message: 'Обязательно' }], name: 'visibility' },

    dataType: { label: 'Тип данных', rules: [{ required: true, message: 'Обязательно' }], name: 'dataType' },
    multiplicity: { label: 'Кратность', rules: [{ required: true, message: 'Обязательно' }], name: 'multiplicity' },
    initialValue: {
        label: 'Начальное значение', name: 'initialValue', rules: [
            { required: false, message: 'Обязательно' }
        ]
    },
    staticValue: {
        label: 'Фиксированное значение', name: 'staticValue', rules: [
            { required: false, message: 'Обязательно' }
        ]
    },

    attributeCategory: { label: 'Категория', rules: [], name: 'attributeCategory' },
    historyToDb: { label: 'БД', rules: [], name: 'historyToDb' },
    historyToCache: { label: 'Кэш', rules: [], name: 'historyToCache' },
    readonly: { label: 'Только чтение', rules: [], name: 'readonly' },
    unit: { label: 'Единица измерения', rules: [], name: 'unit' },
    attributeStereotype: { label: 'Стереотип', rules: [], name: 'attributeStereotype' },
    sortOrder: { label: 'Сортировка', rules: [], name: 'sortOrder' },
    package: { label: 'Пакет', rules: [{ required: true, message: 'Обязательно' }], name: 'package' },
    classes: { label: 'Классы', rules: [], name: 'classes' },
    viewType: { label: 'Представление', rules: [], name: 'viewType' },
    icon: { label: 'Иконка', rules: [], name: 'icon' },
    codename: { label: 'Код', rules: [{ required: true, message: 'Обязательно' }], name: 'codename' },
    description: { label: 'Описание', rules: [{ required: false, message: 'Обязательно' }], name: 'description' }
}

const filters = {
    filterType: 'select',
    filterSelectOptions: [{ value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' }]
}

export const attributesTableColumns: any = [
    { 
        key: 'actions', 
        title: 'Действия',
         
    },
    {
        key: 'id',
        title: 'ID',
    },
    {
        key: 'name',
        title: 'Идентификатор',
        width: 300
    },
    { 
        key: 'visibility', 
        title: 'Видимость',
        filterType: 'select',
        filterSelectOptions: Object.entries(VISIBILITY).map(([ value, label ]) => ({ label, value })),
        filterValueKey: 'visibilityFilterValue',
    }, 
    { key: 'multiplicity', title: 'Кратность' },
    { key: 'dataType', title: 'Тип данных' },
    { key: 'initialValue', title: 'Начальное значение' },
    { key: 'staticValue', title: 'Фиксированное значение' },
    { key: 'attributeCategory', title: 'Категория', filterValueKey: 'categoryFilterValue', },
    { key: 'historyToDb', title: 'БД', filterValueKey: 'historyToDbFilterValue', ...filters },
    { key: 'historyToCache', title: 'Кэш', filterValueKey: 'historyToCacheFilterValue', ...filters },
    { key: 'readonly', title: 'Только чтение', filterValueKey: 'readonlyFilterValue', ...filters },
    { key: 'unit', title: 'Единица измерения' },
    { key: 'attributeStereotype', title: 'Стереотип' },
    { key: 'sortOrder', title: 'Сортировка' },
    { key: 'package', title: 'Пакет' },
    { key: 'classes', title: 'Классы' },
    { key: 'viewType', title: 'Представление' },
    { key: 'icon', title: 'Иконка' },

].map((col) => ({ ...col, dataIndex: col.key }))

export const visibilityTranslation = {
    public: 'Открытый',
    protected: 'Защищённый',
    private: 'Закрытый',
    package: 'Пакетный',
}