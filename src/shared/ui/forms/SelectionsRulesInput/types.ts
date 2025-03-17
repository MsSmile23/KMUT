export enum RuleTypes {
    PregMatch = 'Preg_match',
    Postprocessing = 'Postprocessing',
    PregReplace = 'Preg_replace',
    JSONExtract = 'JSON_extract',
}

export type TRuleItem = {
    id: string;
    varSource: string;
    ruleType: RuleTypes;
    regex: string;
    varDest: string;
    behaviorOnFail: string;
    postProcessingFormula: string;
    replacementString: string;
    searchKey: string;
    order?: number
}