import { IVoshodFilter, IVoshodLinkFilter } from '@shared/types/voshod-filters';
import { ECSimpleFormField } from './types';
import { filter } from 'lodash';

export enum VoshodBackFilterClasses {
    gosContractByIds = 10002,
    instituteTypeByIds = 10003,
    channelTypeByIds = 10004,
    settlementTypeByIds = 10005,
    municipalityByIds = 10006,
    regionByIds = 10007,
    federalDistrictByIds = 10008,
}

export const voshodBackFilterAttributes = {
    10006: 'objectsByAttributeCOSValue',
    10007: 'objectsByAttributeCOSValue',
    10003: 'objectsByAttributeGkNumberValue',
    10002: 'objectsByAttributeAddressValue',
    10005: 'objectsByAttributeTimezoneValue',
}

export const transformECFiltersToVoshodDTO = (
    fields: ECSimpleFormField[],
): IVoshodFilter[] => {

    const voshodFilters: IVoshodFilter[] = [];

    for (const field of fields) {
        if (field.type === 'class') {
            if (VoshodBackFilterClasses[field?.class?.id]) {
                voshodFilters.push({
                    filterType: 'objectsByFlatLinks',
                    backFilterName: VoshodBackFilterClasses[field?.class?.id],
                    filterClassId: 10001,
                    filterLabel: field?.class?.name || '',
                    filterView: 'select',
                    values: field.value,
                })
            }
        }

        if (field.type === 'attribute') {
            if (voshodBackFilterAttributes[field.attribute.id]) {
                voshodFilters.push({
                    filterType: 'objectsByAttributeValue',
                    backFilterName: voshodBackFilterAttributes[field.attribute.id],
                    filterAttributeId: field?.attribute?.id || 0,
                    filterLabel: field?.attribute?.name || '',
                    filterView: 'select',
                    values: field.value,
                    filterClassId: 10001, // TODO ??
                })
            }
        }

        // TODO заменить, когда будет бэк
        if (field.type === 'dates') {
            voshodFilters.push({
                backFilterName: 'someField',
                filterType: 'dates',
                values: field.value,
            })
        }
    }

    // console.log(fields, voshodFilters);

    return voshodFilters;
}

export const removeUnallowedValuesFromFields = (fields: ECSimpleFormField[], filters: IVoshodFilter[]) => {
    if (!filters || !fields) {
        return [];
    }

    const newFields = [...fields];

    for (const field of newFields) {
        if (field.type === 'class') {
            const classFilter = filters
                .find(filter => filter.backFilterName === VoshodBackFilterClasses[field.class.id]) as IVoshodLinkFilter;

            if (classFilter) {
                const filterValues = classFilter?.values ? (
                    Array.isArray(classFilter.values) ? classFilter.values : [classFilter.values]
                ) : [];

                field.value = (Array.isArray(field.value) ? field.value : [field.value])
                    .filter(value => filterValues.includes(value));
                // console.log(field.class.name, field.value, classFilter.values);
            }
        }

        if (field.type === 'attribute') {
            const attributeFilter = filters.find(
                filter => filter.backFilterName === voshodBackFilterAttributes[field.attribute.id]
            ) as IVoshodLinkFilter;

            if (attributeFilter) {
                const filterValues = attributeFilter?.values ? (
                    Array.isArray(attributeFilter.values) ? attributeFilter.values : [attributeFilter.values]
                ) : [];

                field.value = field.value.filter(value => filterValues.includes(value));
                // console.log(field.attribute.name, field.value, filterValues)
            }
        }
    }

    return newFields;
}