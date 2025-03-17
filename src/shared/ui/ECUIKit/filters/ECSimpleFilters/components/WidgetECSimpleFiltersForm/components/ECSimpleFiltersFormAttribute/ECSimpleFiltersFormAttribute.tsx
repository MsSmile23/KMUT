import { selectGetClassById, useClassesStore } from '@shared/stores/classes';
import { ECSelect } from '@shared/ui/ECUIKit/forms';
import { useMemo } from 'react';
import { ECSimpleFiltersAttributeFieldProp } from '../../../../types';

interface IECSimpleFiltersFormAttribute {
    onChange: (value: number) => void;
    value: ECSimpleFiltersAttributeFieldProp;
}

export const ECSimpleFiltersFormAttribute = ({
    onChange,
    value,
}: IECSimpleFiltersFormAttribute) => {
    const getClassById = useClassesStore(selectGetClassById);

    const selectOptions = useMemo(() => {
        const options: { label: string, value: number }[] = [];

        const mainClassId = 10001;
        const mainClass = getClassById(mainClassId);

        if (mainClass) {
            const attributes = mainClass.attributes || [];

            attributes.forEach(attribute => {
                options.push({
                    label: attribute.name,
                    value: attribute.id,
                })
            });
        }

        return options;
    }, []);

    return (
        <>
            <span style={{ width: 100, display: 'inline-block' }}>Аттрибут</span>
            <ECSelect
                selectProps={{
                    options: selectOptions,
                    style: {
                        width: '100%',
                        maxWidth: 250,
                    },
                    onSelect: value => onChange(value),
                    value: value.attribute_id || '',
                }}
            />
        </>
    )
}