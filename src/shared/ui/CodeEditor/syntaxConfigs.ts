import Prism from 'prismjs'
import 'prismjs/components/prism-json'

// Конфиг для подсветки
export const syntaxConfigs = {
    default: {
        background: '#000',
        prismLanguage: Prism.languages.javascript,
        'unmatched-bracket': { color: '#D1243B' },
    },
    json: {
        background: '#000',
        prismLanguage: Prism.languages.json,
        'unmatched-bracket': { color: '#D1243B' },
    },
    postprocessing: {
        background: '#000',
        'number-letter': { color: '#A9B7C6', regex: /[a-zA-Z0-9]/ },
        functions: { color: '#FFC66D', regex: /\b(?:sum|sub|mul|rand|div|replace|if|nrand)\b/ },
        bracket: { color: '#6A8759', regex: /[()[\]]/ },
        'unmatched-bracket': { color: '#D1243B' },
    },
}

export type TSyntaxMnemonic = keyof typeof syntaxConfigs