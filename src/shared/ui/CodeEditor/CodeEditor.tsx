import { FC, useEffect, useState } from 'react'
import { syntaxConfigs, TSyntaxMnemonic } from '@shared/ui/CodeEditor/syntaxConfigs'
import { createPrismLanguage, findUnmatchedBrackets } from '@shared/ui/CodeEditor/utils'
import { useDebounce } from '@shared/hooks/useDebounce.ts'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.min.css'
import { ICustomSyntaxConfig } from './types'

interface ICodeEditorProps {
    value?: string
    onChange?: (value: string) => void,
    mnemonic?: TSyntaxMnemonic,
    editable?: boolean,
    height?: string,
    placeholder?: string
    disabled?: boolean
}
const CodeEditor: FC<ICodeEditorProps> = (props) => {
    const { value = '', onChange, mnemonic = 'default', editable = false, 
        height, 
        placeholder = 'Введите значение' } = props
    const [localValue, setLocalValue] = useState(value)
    const debouncedValue = useDebounce(localValue, 1500)

    const config = syntaxConfigs[mnemonic] ?? syntaxConfigs.default

    const highlight = (code: string) => {
        if ('prismLanguage' in config) {
            return Prism.highlight(code, config.prismLanguage, mnemonic)
        } else {
            const language = createPrismLanguage(config as ICustomSyntaxConfig)

            let highlighted = Prism.highlight(code, language, 'custom')

            highlighted = highlighted
                .replace(/<span class="token function">/g, `<span style="color: ${config?.functions?.color}">`)
                .replace(/<span class="token number-letter">/g, 
                    `<span style="color: ${config['number-letter']?.color}">`)
                // .replace(/<span class="token bracket">/g, `<span style="color: ${config?.bracket?.color}">`);

            // Подсвечиваем незакрытые скобки (, [
            const unmatchedIndexes = findUnmatchedBrackets(code)

            if (unmatchedIndexes.length > 0) {
                let realIndex = 0 // позиция в исходной строке `code`

                highlighted = highlighted.replace(/<span class="token bracket">(.*?)<\/span>/g, (match, p1, offset) => {
                    const bracketPosInCode = code.indexOf(p1, realIndex)

                    if (unmatchedIndexes.includes(bracketPosInCode)) {
                        realIndex = bracketPosInCode + 1

                        return `<span style="color: ${config['unmatched-bracket']?.color};">${p1}</span>`
                    }
                    realIndex = bracketPosInCode + 1

                    return `<span style="color: ${config?.bracket?.color};">${p1}</span>`
                })
            } else {
                // Если все скобки закрыты, применяем стандартную подсветку
                highlighted = highlighted.replace(/<span class="token bracket">(.*?)<\/span>/g, (match, p1) => {
                    return `<span style="color: ${config?.bracket?.color};">${p1}</span>`
                })
            }
    
            return highlighted
        }
    }

    const handleValueChange = (newValue: string) => {
        setLocalValue(newValue)
    }

    useEffect(() => {
        if (onChange) {
            onChange(debouncedValue)
        }
    }, [debouncedValue, onChange])

    return (
        <div style={{ backgroundColor: config?.background || '#000' }}>
            {editable ? (
                <Editor
                    disabled={props?.disabled}
                    value={localValue ?? ''}
                    onValueChange={handleValueChange}
                    highlight={highlight}
                    padding={5}
                    placeholder={placeholder}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        backgroundColor: config?.background || '#000',
                        color: config?.['number-letter']?.color || '#fff',
                        outline: 'none',
                        whiteSpace: 'pre-wrap',
                        height: height
                    }}
                />
            ) : (
                <pre
                    style={{
                        margin: 0,
                        minHeight: 27,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        padding: 5,
                        color: config?.['number-letter']?.color || '#fff'
                    }}
                >
                    {localValue ? (
                        <span dangerouslySetInnerHTML={{ __html: highlight(localValue) }} />
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </pre>
            )}
        </div>
    )
}

export default CodeEditor