import { RuleTypes, TRuleItem } from './types'

export const ruleTypesOption = [
    { label: `Извлечение из строки (${RuleTypes.PregMatch})`, value: RuleTypes.PregMatch },
    { label: `Постобработка (${RuleTypes.Postprocessing})`, value: RuleTypes.Postprocessing },
    { label: `Замена (${RuleTypes.PregReplace})`, value: RuleTypes.PregReplace },
    { label: `Извлечение из JSON (${RuleTypes.JSONExtract})`, value: RuleTypes.JSONExtract },
]

type FieldNames<T> = {
    [K in keyof T as K extends 'id' ? never : K]: { label: string; name: K }
};

const createFieldNames = <T extends Record<string, any>>(fields: FieldNames<T>) => fields

export const fieldNames = createFieldNames<TRuleItem>({
    varDest: {
        label: 'Переменная-получатель',
        name: 'varDest'
    },
    ruleType: {
        label: 'Тип правила',
        name: 'ruleType'
    },
    regex: {
        label: 'Регулярное выражение',
        name: 'regex'
    },
    varSource: {
        label: 'Переменная-источник',
        name: 'varSource'
    },
    behaviorOnFail: {
        label: 'При несрабатывании',
        name: 'behaviorOnFail'
    },
    postProcessingFormula: {
        label: 'Формула постобработки',
        name: 'postProcessingFormula'
    },
    replacementString: {
        label: 'Строка замены',
        name: 'replacementString'
    },
    searchKey: {
        label: 'Ключ поиска',
        name: 'searchKey'
    }
})

export const failOptions = [
    { label: 'Выход с ошибкой', value: 'exitWithError' },
    { label: 'Игнорирование с переходом к следующему правилу', value: 'skipToNextRule' },
    { label: 'Игнорирование с переходом к следующему шагу', value: 'skipToNextStep' },
]

export const initialRuleItem: TRuleItem = {
    id: '',
    varDest: undefined,
    ruleType: '' as RuleTypes.PregMatch,
    regex: undefined,
    varSource: undefined,
    behaviorOnFail: undefined,
    postProcessingFormula: undefined,
    replacementString: undefined,
    searchKey: undefined,
}

export const resetFields = (ruleType: RuleTypes) => {
    const resetFieldsMap: { [key in RuleTypes]: (keyof TRuleItem)[] } = {
        [RuleTypes.PregMatch]: ['postProcessingFormula', 'replacementString', 'searchKey'],
        [RuleTypes.Postprocessing]: ['searchKey', 'varSource', 'behaviorOnFail', 'replacementString', 'regex'],
        [RuleTypes.PregReplace]: ['postProcessingFormula', 'behaviorOnFail', 'searchKey'],
        [RuleTypes.JSONExtract]: ['regex', 'postProcessingFormula', 'replacementString'],
    };

    return resetFieldsMap[ruleType] || [];
}