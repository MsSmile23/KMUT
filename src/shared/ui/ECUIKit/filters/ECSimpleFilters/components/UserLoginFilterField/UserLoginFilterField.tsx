import { ECSelect } from '@shared/ui/ECUIKit/forms'

interface IRelationFilterFieldProps {
    align?: 'horizontal' | 'vertical',
    textColor?: string,
    borderColor?: string,
    backgroundColor?: string,
}

export const UserLoginFilterField = ({
    align,
    backgroundColor,
    borderColor,
    textColor,
}: IRelationFilterFieldProps) => {
    return (
        <ECSelect
            mode="ECSimpleFilters"
            selectProps={{
                backgroundColor,
                borderColor,
                textColor,
                align,
                selectPlaceholderTag: true,
                allowClear: true,
                options: [
                    {
                        label: 'Пользователь 1',
                        value: 1,
                    },
                    {
                        label: 'Пользователь 2',
                        value: 2,
                    },
                ]
            }}
        />
    )
}