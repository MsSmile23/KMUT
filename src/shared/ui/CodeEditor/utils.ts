import { ICustomSyntaxConfig } from './types'

export const createPrismLanguage = (config: ICustomSyntaxConfig) => {
    return {
        'function': config?.functions?.regex,
        'number-letter': config?.['number-letter']?.regex,
        'bracket': config?.bracket?.regex,
    }
}

// Поиск индексов незакрытых скобок
export const findUnmatchedBrackets = (code: string) => {
    const stack = []
    const unmatchedIndexes = []

    for (let i = 0; i < code.length; i++) {
        const char = code[i];

        if (char === '(' || char === '[' || char === '{') {
            stack.push({ char, index: i }) // сохраняем символ и его индекс
        } else if ((char === ')' || char === ']' || char === '}')) {
            const last = stack[stack.length - 1]

            if ((char === ')' && last?.char === '(') || 
                (char === '}' && last?.char === '{') ||
                (char === ']' && last?.char === '[')) {
                stack.pop() // закрываем правильную пару скобок
            } else {
                unmatchedIndexes.push(i) // неправильная закрывающая скобка
            }
        }
    }
    unmatchedIndexes.push(...stack.map(item => item.index))

    return unmatchedIndexes
}