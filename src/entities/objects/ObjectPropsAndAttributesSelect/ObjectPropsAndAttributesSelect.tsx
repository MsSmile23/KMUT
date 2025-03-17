import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { Select } from '@shared/ui/forms'
import { FC, useEffect, useState } from 'react'

interface IObjectPropsAndAttributesSelect {
    value?: number | string
    onChange?: any
    classes: number[]
}
const ObjectPropsAndAttributesSelect: FC<IObjectPropsAndAttributesSelect> = ({
    value,
    onChange,
    classes,
}) => {
    const attributes = useAttributesStore(selectAttributes)
    const [options, setOptions] = useState<any[]>([])
    const [chosenValue, setChosenValue] = useState<number | string>(null)

    useEffect(() => {
        if (value) {
            setChosenValue(value)
        }
    }, [])

    useEffect(() => {
        onChange(chosenValue)
    }, [chosenValue])
    useEffect(() => {
        const localOptions = [
            {
                label: 'Свойства объекта',
                title: 'Свойства объекта',
                options: [
                    {
                        value: 'id',
                        label: 'ID объекта',
                    },
                    {
                        value: 'name',
                        label: 'Название',
                    },
                    {
                        value: 'codename',
                        label: 'Код',
                    },
                ],
            },
        ]

        const localAttributes: any[] = []

        attributes
            .filter((attr) => attr.classes_ids.filter((cl) => classes.includes(cl.id))?.length > 0)
            .forEach((item) => {
                localAttributes.push({
                    value: item.id,
                    label: item.name,
                })
            })

        localOptions.push({
            label: 'Атрибуты объекта',
            title: 'objectAttributes',
            options: localAttributes,
        })
        setOptions(localOptions)
    }, [classes])

    return (
        <Select
            disabled={classes?.length == 0}
            value={chosenValue}
            placeholder="Выберите значения для вывода"
            options={options}
            onChange={(e) => setChosenValue(e)}
        />
    )
}

export default ObjectPropsAndAttributesSelect