import { FC, useCallback, useMemo, useState } from 'react'
import { Descendant, createEditor, Text, BaseEditor } from 'slate'
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react'

import './ECTextEditor.css'
import Toolbar from './Toolbar/Toolbar';
import { ButtonSubmit } from '@shared/ui/buttons';
import { deserializeNode, formatText, withTemplates } from '@shared/ui/ECUIKit/ECTemplatedText/utils/utility'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes';
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects';
import { CustomText, CustomTextWithDisplay } from '../types/types';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: { 
        type: 'paragraph' | 'template' | 'alignLeft' | 'alignCenter' | 'alignRight'
        children: CustomTextWithDisplay[] 
    }
    Text: CustomText
  }
}

interface IECTextEditorProps {
    changedValue: (data: string) => void
    classes: number[]
    textValue?: string,
    object?: number
}

const ECTextEditor: FC<IECTextEditorProps> = ({ changedValue, classes, textValue, object }) => {
    const editor = useMemo(() =>  withTemplates(withReact(createEditor())), [])
    const classById = useClassesStore(selectGetClassById)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const deserializedValue = deserializeNode(textValue, formatText, object, getObjectByIndex, classById, classes)
    const [value, setValue] = useState<Descendant[]>(deserializedValue)  

    const serializeToText = (nodes: Descendant[]): string => {
        return nodes.map((node) => serializeNode(node)).join('\n')
    }

    const serializeNode = (node: any): string => {
        if (Text.isText(node)) {
            return node.text
        }

        if (node.type === 'template') {
            return node.children.map((n) => n.valueText).join('')
        }

        if (node.children) {
            return node.children.map((n) => serializeNode(n)).join('')
        }

        return ''
    }

    //Отрисовка элементов форматирования
    const Element: FC<RenderElementProps>  = ({ attributes, children, element }) => {
        switch (element.type) {
            case 'paragraph':
                return <p {...attributes}>{children}</p>
            case 'template':
                return (
                    <span
                        {...attributes}
                        style={{
                            display: 'inline-block'
                        }}
                    >
                        <span>{element?.children[0]?.displayText}</span>
                        {children}
                    </span>
                )
            case 'alignLeft':
                return <div style={{ textAlign: 'left', listStylePosition: 'inside' }} {...attributes}>{children}</div>
            case 'alignCenter':
                return (
                    <div style={{ textAlign: 'center', listStylePosition: 'inside' }} {...attributes}>
                        {children}
                    </div>)
            case 'alignRight':
                return <div style={{ textAlign: 'right', listStylePosition: 'inside' }} {...attributes}>{children}</div>
            default:
                return <p {...attributes}>{children}</p>
        }
    }

    const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => {

        if (leaf.bold) {
            children = <strong>{children}</strong>
        }

        if (leaf.italic) {
            children = <em>{children}</em>
        }

        if (leaf.underline) {
            children = <u>{children}</u>
        }

        return <span {...attributes}>{children}</span>
    }

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    const handleSave = () => {
        const serialized = serializeToText(value)
        
        changedValue(serialized)
    }

    return (
        <div className="editor-container">
            <Slate editor={editor} initialValue={value} onChange={setValue}>
                <Toolbar objectClasses={classes} object={object} />
                <div className="editor-wrapper" style={{ border: '1px solid #f3f3f3', padding: '0 10px' }}>
                    <Editable
                        placeholder="Введите текст"
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                    />
                </div>
            </Slate>
            <ButtonSubmit onClick={handleSave} style={{ background: 'green', alignSelf: 'flex-end' }} />
        </div>
    )
}

export default ECTextEditor