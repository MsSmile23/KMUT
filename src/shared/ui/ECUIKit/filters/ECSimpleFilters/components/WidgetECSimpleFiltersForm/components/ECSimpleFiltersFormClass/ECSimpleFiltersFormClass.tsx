import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes';
import { ECSelect } from '@shared/ui/ECUIKit/forms'
import { useMemo } from 'react';
import { ECSimpleFiltersClassFieldProp } from '../../../../types';
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects';

interface IECSimpleFiltersFormClassProps {
    onChange: (value: ECSimpleFiltersClassFieldProp) => void;
    value: ECSimpleFiltersClassFieldProp;
}

// Кастомные поля, если нужно
const customVersionsOptions: { label: string, value: string | undefined }[] = [
    {
        label: 'По умолчанию',
        value: 'default'
    },
    {
        label: 'Тип учреж. Визуализация',
        value: 'orgTypeVisualization',
    },
]

// Кастомные поля типа учреждения визуализации
const orgTypeCustomFields: { label: string, value: string }[] = [
    {
        label: 'Цик',
        // value: [67910],
        value: 'cik',
    },
    {
        label: 'Школы + СПО',
        // value: [67911, 67912],
        value: 'schoolSpo',
    }
]

export const ECSimpleFiltersFormClass = ({
    onChange,
    value,
}: IECSimpleFiltersFormClassProps) => {
    const classes = useClassesStore(selectClasses);
    const getClassByIndex = useClassesStore(selectClassByIndex);
    const getObjectsByIndex = useObjectsStore(selectObjectByIndex);

    const classSelectOptions = useMemo(() => {
        const options: { label: string, value: number }[] = [];

        classes.forEach(class_obj => {
            options.push({
                label: class_obj.name,
                value: class_obj.id,
            })
        });

        return options;
    }, []);

    const defaultValuesSelectOptions: { label: string, value: number | string }[] = useMemo(() => {
        const class_obj = getClassByIndex('id', value.class_id);

        if (!class_obj) {
            return [];
        }

        onChange({
            ...value,
            defaultValues: [],
        })

        if (value.class_id === 10003 && value.version === 'orgTypeVisualization') {
            return orgTypeCustomFields;
        }

        const objects = getObjectsByIndex('class_id', class_obj.id);

        return objects.map(object => ({
            value: object.id,
            label: object.name,
        }))
    }, [value.class_id, value.version]);

    return (
        <>
            <span style={{ width: 100, display: 'inline-block' }}>Класс</span>
            <ECSelect
                selectProps={{
                    options: classSelectOptions,
                    style: {
                        width: '100%',
                        maxWidth: 200,
                    },
                    onSelect: selectValue => onChange({
                        ...value,
                        class_id: selectValue,
                    }),
                    value: value.class_id || '',
                }}
            />

            <ECSelect
                selectProps={{
                    options: [
                        {
                            label: 'Мультиселект',
                            value: 'multiselect',
                        },
                        {
                            label: 'Одиночный',
                            value: 'singleSelect',
                        }
                    ],
                    style: {
                        width: '100%',
                        maxWidth: 150,
                    },
                    defaultValue: 'multiselect',
                    onSelect: selectValue => onChange({
                        ...value,
                        isMultiSelect: selectValue === 'multiselect'
                    }),
                    value: value.isMultiSelect ? 'multiselect' : 'singleSelect',
                }}
            />

            <ECSelect
                selectProps={{
                    options: [
                        {
                            label: 'С облачком',
                            value: 'tagCloud',
                        },
                        {
                            label: 'Без облачка',
                            value: 'noTagCloud',
                        }
                    ],
                    style: {
                        width: '100%',
                        maxWidth: 130,
                    },
                    defaultValue: 'tagCloud',
                    onSelect: selectValue => onChange({
                        ...value,
                        tagCloud: selectValue === 'tagCloud'
                    }),
                    value: value.tagCloud ? 'tagCloud' : 'noTagCloud',
                }}
            />

            <ECSelect
                selectProps={{
                    style: {
                        width: '100%',
                        maxWidth: 300,
                    },
                    options: defaultValuesSelectOptions,
                    onChange: selectedValues => onChange({
                        ...value,
                        defaultValues: selectedValues
                    }),
                    value: value.defaultValues,
                    placeholder: 'Значения по умолчанию',
                    mode: value.isMultiSelect ? 'multiple' : undefined,
                }}
            />

            <ECSelect
                selectProps={{
                    style: {
                        width: '100%',
                        maxWidth: 200,
                    },
                    options: customVersionsOptions,
                    onChange: version => onChange({
                        ...value,
                        version: version
                    }),
                    value: value.version,
                    placeholder: 'Версия'
                }}
            />
        </>
    )
}