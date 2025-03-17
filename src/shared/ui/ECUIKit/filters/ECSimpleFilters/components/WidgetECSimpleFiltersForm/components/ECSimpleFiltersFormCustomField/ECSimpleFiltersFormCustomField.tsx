import { ECSimpleFiltersFieldsProps } from '../../../../types'

interface IECSimpleFiltersFormCustomFieldProps {
    field: ECSimpleFiltersFieldsProps,
}

export const ECSimpleFiltersFormCustomField = ({
    field,
}: IECSimpleFiltersFormCustomFieldProps) => {
    return (
        <div>
            {field.type === 'dates_last' && 'Фильтр по периоду (селект)'}
            {field.type === 'dates' && 'Фильтр по периоду (2 даты)'}
            {field.type === 'user_login' && 'Логин'}
        </div>
    )
}