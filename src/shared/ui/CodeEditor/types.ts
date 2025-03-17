export interface ICustomSyntaxConfig {
    background?: string;
    'number-letter'?: { color: string; regex: RegExp };
    functions?: { color: string; regex: RegExp };
    bracket?: { color: string; regex: RegExp };
    'unmatched-bracket'?: { color: string };
}

interface IStandardSyntaxConfig {
    background?: string;
    prismLanguage: Prism.Grammar
}

type TSyntaxConfig = IStandardSyntaxConfig | ICustomSyntaxConfig

export type TSyntaxConfigs = {
    [key: string]: TSyntaxConfig
}