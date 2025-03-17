import { useObjectsStore } from '@shared/stores/objects';
import { ECSelect } from '@shared/ui/ECUIKit/forms';
import { useEffect, useMemo, useState } from 'react';
import { ECSimpleClassForm } from '../../types';
import { IVoshodFilter, IVoshodLinkFilter } from '@shared/types/voshod-filters';
import { VoshodBackFilterClasses } from '../../utils';
import { values } from 'lodash';

interface IRelationFilterFieldProps {
    align?: 'horizontal' | 'vertical',
    textColor?: string,
    borderColor?: string,
    backgroundColor?: string,
    value: number[] | string,
    field: ECSimpleClassForm,
    allowedFilters: IVoshodFilter[],
    onSelect?: (ids: number[]) => void,
}
export const RelationFilterField = ({
    align,
    borderColor,
    backgroundColor,
    textColor = '#000000',
    value,
    field,
    allowedFilters,
    onSelect,
}: IRelationFilterFieldProps) => {
    const getObjectByIndex = useObjectsStore(st => st.getByIndex);
    const [allowedObjectsIds, setAllowedObjectsIds] = useState<number[]>(null);

    const options = useMemo(() => {
        const options: { label: string, value: number }[] = [];

        const objects = getObjectByIndex('class_id', field?.class?.id);

        objects.forEach(object => {
            if (!allowedObjectsIds || allowedObjectsIds.includes(object?.id)) {
                options.push({
                    label: object?.name,
                    value: object?.id,
                })
            }
        });

        return options;
    }, [allowedObjectsIds]);

    // const selectedValues = useMemo(() => {
    //     const values = value.filter(id => allowedObjectsIds?.includes?.(id));

    //     return values;
    // }, [value, allowedObjectsIds]);

    useEffect(() => {
        const classId = field?.class?.id;
        const filterName = VoshodBackFilterClasses[classId];
        const allowedFilter = allowedFilters
            .find(
                filter => filter.filterType === 'objectsByFlatLinks'
                    && filter.backFilterName === filterName
            ) as IVoshodLinkFilter;

        if (allowedFilter) {
            setAllowedObjectsIds(allowedFilter.values || []);
        }
    }, [allowedFilters]);

    const onSelectChange = (values: number[]) => {
        onSelect(values);
    }

    useEffect(() => {
        if (field.class.id === 10003 && field.version === 'orgTypeVisualization') {
            onSelectChange(value === 'cik' ? [67910] : [67911, 67912])
        }
    }, []);

    if (field.class.id === 10003 && field.version === 'orgTypeVisualization') {
        return (
            <ECSelect
                mode="ECSimpleFilters"
                selectProps={{
                    align,
                    onSelect: (value) => {
                        onSelectChange(value === 'cik' ? [67910] : [67911, 67912])
                    },
                    backgroundColor,
                    borderColor,
                    textColor,
                    allowClear: (field.isMultiSelect ?? true) ? true : false,
                    mode: (field.isMultiSelect ?? true) ? 'multiple' : undefined,
                    selectPlaceholderTag: (field.tagCloud ?? true) ? true : false,
                    options: [
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
                    ],
                    // value: selectedValues,
                    value: Array.isArray(value) ?
                        value?.[0] === 67910 ? 'cik' : 'schoolSpo'
                        :
                        value,
                }}
            />
        )
    }

    return (
        <ECSelect
            mode="ECSimpleFilters"
            selectProps={{
                align,
                onChange: onSelectChange,
                backgroundColor,
                borderColor,
                textColor,
                allowClear: (field.isMultiSelect ?? true) ? true : false,
                mode: (field.isMultiSelect ?? true) ? 'multiple' : undefined,
                selectPlaceholderTag: (field.tagCloud ?? true) ? true : false,
                options,
                // value: selectedValues,
                value: value === null ? undefined : value,
            }}
        />
    )
}