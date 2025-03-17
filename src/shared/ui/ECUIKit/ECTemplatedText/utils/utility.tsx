import { IClass } from '@shared/types/classes'
import { IObject } from '@shared/types/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { Descendant, Editor, Element as SlateElement, Transforms, Text } from 'slate'
import { ReactEditor } from 'slate-react'

const alignment = ['alignLeft', 'alignRight', 'alignCenter']

//Проверяем активность блока (кнопки) определенного формата
export const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
    })
  
    return !!match
}

//Переключатель блоков (кнопок) форматирования
export const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isIndent = alignment.includes(format)
    const isAligned = alignment.some((alignmentType) => 
        isBlockActive(editor, alignmentType)
    )

    if (isIndent && isAligned) {
        Transforms.unwrapNodes(editor, {
            match: (n) =>
                alignment.includes(
                    !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
                ),
            split: true
        })
    }

    if (isIndent) {
        Transforms.wrapNodes(editor, {
            type: format,
            children: []
        })

        return
    }

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : format
    })
}

//Проверяем активность разметки (выравнивания)
export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)

    return marks ? marks[format] === true : false
}

//Переключатель разметки
export const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
  
    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }

    ReactEditor.focus(editor)
}

//Вставка шаблона
export const insertTemplate = (editor, displayText, valueText) => {
    const template = { type: 'template', children: [{ text: '', displayText, valueText }] } as  any

    Transforms.insertNodes(editor, template)
    Transforms.move(editor)
    Transforms.insertText(editor, ' ')
}

export const withTemplates = editor => {
    const { isInline, isVoid } = editor

    editor.isInline = element => {
        return element.type === 'template' ? true : isInline(element)
    }

    editor.isVoid = element => {
        return element.type === 'template' ? true : isVoid(element)
    }

    return editor
}

//Форматирование текста
export const formatText = (
    text,
    objectId: number, 
    classes: IClass['id'][],
    getObjectByIndex: (indexMnemo: 'id', key: number) => IObject,
    classById: (id: number) => IClass): string => {
    if (!text) {return ''}

    const objectFull = getObjectByIndex('id', objectId)

    // Выражения для поиска
    const classRegex = /{{object\.relClass\.(\d+)\.object(:name|:id|.class:name|:class_id)}}/g
    const relClassAttributeRegex = /{{object\.relClass\.(\d+)\.object\.attr\.(\d+):(name|value)}}/g
    const attributeReggex = /{{object\.attr\.(\d+):(name|value)}}/g

    // Получение связанного класса из строки
    const extractClass = (inputString: string) => {
        const matches = inputString.matchAll(/relClass\.(\d+)/g)

        const classIds = Array.from(matches, match => +match[1])

        return [...new Set(classIds)]
    }

    // Поиск связанных объектов
    const linkedObjects = findChildObjectsWithPaths({
        currentObj: objectFull,
        childClassIds: [],
        targetClassIds: extractClass(text),
    })?.objectsWithPath.map((obj) => getObjectByIndex('id', obj.id))

    // Обработка атрибутов основного объекта
    text = text?.replace(attributeReggex, (text, attrId, attrType) => {
        const attribute = objectFull?.object_attributes?.find(attr => attr.attribute_id === +attrId)

        if (attribute) {
            return attrType === 'name' ? attribute.attribute.name : attribute.attribute_value
        } else {
            const fullClasses = classes.map((cls) => classById(cls))
            const classAttribute = fullClasses?.map((cls) => cls.attributes.find((attr) => attr.id === +attrId))
                .filter((attr) => attr !== undefined)
                .filter((item, i, array) => i === array.findIndex(arrItem => arrItem.id === item.id))

            const resultString = fullClasses?.map((cls, i) => {
                if (classAttribute[i]) {
                    return `{{${classAttribute[i].name}: ${attrType === 'name' ? 'название' : 'значение'}}}`
                }

                return null
            }).filter((item) => item !== null).join(', ')

            return resultString
        }
    })

    // Обработка атрибутов связанных объектов
    text = text?.replace(relClassAttributeRegex, (match, classId, attrId, attrType) => {
        const currentLinkedObjects = linkedObjects?.filter(obj => obj.class_id === +classId)

        if (currentLinkedObjects.length > 0) {
            const replacedValues = currentLinkedObjects?.map(obj => {
                const attribute = obj?.object_attributes?.find(attr => attr.attribute_id === +attrId)

                if (attribute) {
                    return attrType === 'name' ? attribute?.attribute.name : attribute?.attribute_value
                }

                return match
            })

            return currentLinkedObjects.length === 1 ? replacedValues[0] : replacedValues.join(', ')
        } else {
            const fullClass = classById(+classId)
            const classAttribute = fullClass?.attributes.find((attr) => attr.id === +attrId)

            return `{{${fullClass.name}: ${classAttribute?.name} (${attrType === 'name' ? 'название' : 'значение'})}}`
        }
    })

    // Обработка свойств основного объекта и связанных объектов
    const templates = [
        { regex: /{{object:name}}|{object\.name}/g, value: objectFull?.name || '{{Название объекта}}' },
        { regex: /{{object:id}}|{object\.id}/g, value: objectFull?.id || '{{Id объекта}}' },
        { regex: /{{object.class:name}}/g, value: objectFull?.class?.name || '{{Класс объекта}}' },
        { regex: /{{object:class_id}}/g, value: objectFull?.class_id || '{{Id класса объекта}}' },
        { regex: classRegex, value: (match, classId, type) => {
            const currentLinkedObjects = linkedObjects?.filter(obj => obj.class_id === +classId)
            const className = classById(+classId)?.name

            if (currentLinkedObjects.length > 0) {
                const replacedValues = currentLinkedObjects?.map(currentLinkedObject => {
                    switch (type) {
                        case ':name':
                            return currentLinkedObject.name || `{{Название объекта класса ${className}}}`
                        case ':id':
                            return currentLinkedObject.id || `{{Id объекта класса ${className}}}`
                        case '.class:name':
                            return currentLinkedObject.class?.name || `{{Класс объекта класса ${className}}}`
                        case ':class_id':
                            return currentLinkedObject.class_id || `{{Id класса объекта класса ${className}}}`
                        default:
                            return match
                    }
                })
                
                return replacedValues.join(', ')
            } else {
                switch (type) {
                    case ':name':
                        return `{{${className}: название объекта}}`
                    case ':id':
                        return `{{${className}: id объекта}}`
                    case '.class:name':
                        return `{{${className}: класс объекта}}`
                    case ':class_id':
                        return `{{${className}: id класса}}`
                    default:
                        return match
                }
            }
        } 
        },
    ]

    templates.forEach(template => {
        text = text?.replace(template.regex, template.value)
    })

    return text?.trim() === '' ? '' : text
}

const TEMPLATE_REGEX = /{{(.*?)}}/g

// Форматирование сохраненной строки в формат slate
export const deserializeNode = (
    text: string, 
    formatText: (
        text,
        objectId: number, 
        classes: IClass['id'][],
        getObjectByIndex: (indexMnemo: 'id', key: number) => IObject,
        classById: (id: number) => IClass
        ) => string,
    objectId: number, 
    getObjectByIndex: (indexMnemo: 'id', key: number) => IObject,
    classById: (id: number) => IClass,
    classes: IClass['id'][]
): Descendant[] => {
    const nodes: any = [{
        type: 'paragraph',
        children: [{ text: '' }],
    }]
    let lastIndex = 0

    if (!text) {
        return nodes
    }
    
    text?.replace(TEMPLATE_REGEX, (match, templateText, offset) => {

        if (offset > lastIndex) {
            nodes[0].children.push({
                text: text?.slice(lastIndex, offset),
            })
        }
        
        nodes[0].children.push({
            type: 'template',
            children: [{
                text: '',
                valueText: match,
                displayText: formatText(match, objectId, classes, getObjectByIndex, classById)
            }],
        });
        
        lastIndex = offset + match.length

        return match
    })
    
    if (lastIndex < text?.length) {
        nodes[0].children.push({
            text: text?.slice(lastIndex),
        })
    }
    
    return nodes.length ? nodes : [{ type: 'paragraph', children: [{ text: '' }] }]
}

const serializeNodeToHtml = (node: any): string => {
    if (Text.isText(node)) {
        let text = node.text

        if (node.bold) {
            text = `<strong>${text}</strong>`
        }

        if (node.italic) {
            text = `<em>${text}</em>`
        }

        if (node.underline) {
            text = `<u>${text}</u>`
        }

        return text
    }
  
    const children = node.children.map((n: any) => serializeNodeToHtml(n)).join('')
  
    switch (node.type) {
        case 'paragraph':
            return `<p>${children}</p>`
        case 'template':
            return `<span class="template">${children}</span>`
        case 'alignLeft':
            return `<div style="text-align: left;">${children}</div>`
        case 'alignCenter':
            return `<div style="text-align: center;">${children}</div>`
        case 'alignRight':
            return `<div style="text-align: right;">${children}</div>`
        default:
            return `<p>${children}</p>`;
    }}
  
// Функция для преобразования Slate в HTML
export const slateToHtml = (nodes: Descendant[]): string => {
    return nodes.map(serializeNodeToHtml).join('')
}