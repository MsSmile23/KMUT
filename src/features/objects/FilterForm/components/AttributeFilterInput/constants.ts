import { InnerType } from '@shared/types/data-types';
import { AttributeFilter } from '../../filters/attributeFilter';

type SelectOption = { value: AttributeFilter['comparision'], label: string };

const equalsOption: SelectOption = {
    label: 'Равен',
    value: 'equals',
}
const notEqualsOption: SelectOption = {
    label: 'Не равен',
    value: 'not_equals',
}
const stringIncludesOption: SelectOption = {
    label: 'Включает строку',
    value: 'string_includes',
}
const stringNotIncludesOption: SelectOption = {
    label: 'Не включает строку',
    value: 'not_string_includes',
}
const greaterThanOption: SelectOption = {
    label: 'Больше >',
    value: 'greaterThan',
}
const greaterThanOrEqualOption: SelectOption = {
    label: 'Больше или равен ≥',
    value: 'greaterThanOrEqual',
}
const lessThanOption: SelectOption = {
    label: 'Меньше <',
    value: 'lessThan',
}
const lessThanOrEqualOption: SelectOption = {
    label: 'Меньше или равен ≤',
    value: 'lessThanOrEqual',
}

export const allowedComparisionsOptions: Record<InnerType, SelectOption[]> = {
    array: [],
    boolean: [],
    string: [stringIncludesOption, stringNotIncludesOption, equalsOption, notEqualsOption],
    integer: [
        greaterThanOption, greaterThanOrEqualOption, lessThanOption,
        lessThanOrEqualOption, equalsOption, notEqualsOption
    ],
    double: [
        greaterThanOption, greaterThanOrEqualOption, lessThanOption,
        lessThanOrEqualOption, equalsOption, notEqualsOption
    ],
    jsonb: [],
}