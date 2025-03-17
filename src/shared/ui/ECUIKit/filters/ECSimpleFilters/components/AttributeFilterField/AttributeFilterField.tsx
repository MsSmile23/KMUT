import { IAttribute } from '@shared/types/attributes'
import { Input, Select } from 'antd'
import './AttributeFilterField.css'
import { ECSelect } from '@shared/ui/ECUIKit/forms'
import { IVoshodFilter } from '@shared/types/voshod-filters'
import { useMemo } from 'react'
import { ECSimpleAttributeForm } from '../../types'

interface AttributeFilterFieldProps {
    align?: 'horizontal' | 'vertical',
    textColor?: string,
    borderColor?: string,
    backgroundColor?: string,
    value: string[],
    onSelect?: (ids: string[]) => void,
    field: ECSimpleAttributeForm,
    allowedFilters: IVoshodFilter[],
    attribute: IAttribute,
}

export const AttributeFilterField = ({
    align,
    backgroundColor,
    borderColor,
    onSelect,
    field,
    textColor,
    attribute,
    value,
    allowedFilters,
}: AttributeFilterFieldProps) => {
    const options = useMemo(() => {
        const allowedOptions: { label: string, value: string }[] = [];

        const filter = allowedFilters
            .filter(filter => filter.filterType === 'objectsByAttributeValue')
            .find(filter => filter.filterAttributeId === field?.attribute?.id);

        const filterValues = filter?.values || [];

        filterValues.forEach((value) => {
            allowedOptions.push({
                label: value,
                value,
            })
        })

        return allowedOptions;
    }, [allowedFilters]);

    // const values = useMemo(() => {
    //     const selectedValues: string[] = [];
    //     const optionValues = options.map(option => option.value);

    //     value?.forEach(id => {
    //         if (optionValues.includes(id)) {
    //             selectedValues.push(id);
    //         }
    //     });

    //     return selectedValues;
    // }, [value, options]);

    // TODO убрать как будет бэк
    if (attribute.id === 10002) {
        return (
            <ECSelect
                mode="ECSimpleFilters"
                selectProps={{
                    align,
                    backgroundColor,
                    borderColor,
                    allowClear: true,
                    textColor,
                    options,
                    onChange: onSelect,
                    // value: values,
                    value,
                    mode: 'multiple',
                }}
            />
        )
    }

    if (attribute.id === 10003) {
        return (
            <ECSelect
                mode="ECSimpleFilters"
                selectProps={{
                    align,
                    backgroundColor,
                    borderColor,
                    allowClear: true,
                    textColor,
                    options,
                    onChange: onSelect,
                    // value: values,
                    value,
                    mode: 'multiple',
                }}
            />
        )
    }


    if (attribute?.params?.select?.enable) {
        const options = attribute?.params?.select?.options || [];

        return (
            <ECSelect
                mode="ECSimpleFilters"
                selectProps={{
                    align,
                    backgroundColor,
                    borderColor,
                    defaultValue: options?.[0]?.value,
                    textColor,
                    options,
                    // mode: 'multiple',
                    onChange: onSelect,
                    allowClear: (field.isMultiSelect ?? true) ? true : false,
                    mode: (field.isMultiSelect ?? true) ? 'multiple' : undefined,
                    selectPlaceholderTag: (field.tagCloud ?? true) ? true : false,
                    value: value === null ? undefined : value,
                }}
            />
        )
    }

    if (attribute?.data_type?.inner_type === 'boolean') {
        return (
            <ECSelect
                mode="ECSimpleFilters"
                selectProps={{
                    align,
                    backgroundColor,
                    borderColor,
                    allowClear: true,
                    defaultValue: null,
                    selectPlaceholderTag: true,
                    textColor,
                    options: [
                        {
                            label: 'Все',
                            value: null,
                        },
                        {
                            label: 'Да',
                            value: 1,
                        },
                        {
                            label: 'Нет',
                            value: 0,
                        },
                    ],
                }}
            />
        )
    }

    if (attribute?.data_type?.inner_type === 'string') {
        return (
            <Input
                className="attributeFilterField-text"
                style={{
                    width: '100%',
                    minWidth: align === 'horizontal' && 300,
                    height: 54,
                    minHeight: 54,
                    borderRadius: 4,
                    overflow: 'hidden',
                    ['--attributeFilterField-field-border-color' as string]: borderColor,
                    ['--attributeFilterField-field-text-color' as string]: textColor,
                    ['--attributeFilterField-field-background-color' as string]: backgroundColor,
                }}
            />
        )
    }

    if (['double', 'integer'].includes(attribute?.data_type?.inner_type)) {
        return (
            <Input
                type="number"
                className="attributeFilterField-text"
                style={{
                    width: '100%',
                    minWidth: align === 'horizontal' && 300,
                    height: 54,
                    minHeight: 54,
                    borderRadius: 4,
                    overflow: 'hidden',
                    ['--attributeFilterField-field-border-color' as string]: borderColor,
                    ['--attributeFilterField-field-text-color' as string]: textColor,
                    ['--attributeFilterField-field-background-color' as string]: backgroundColor,
                }}
            />
        )
    }

    return null;
}