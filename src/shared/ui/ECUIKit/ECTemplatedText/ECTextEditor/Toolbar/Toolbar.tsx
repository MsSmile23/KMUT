import { FC, useMemo, useState } from 'react'
import ToolbarButton from '../common/ToolbarButton'
import { insertTemplate, isBlockActive, isMarkActive, toggleBlock, toggleMark } from '../../utils/utility'
import { useSlate } from 'slate-react'
import './toolbar.css'
import ToolbarIcon from '../common/ToolbarIcon'
import toolbarGroups, { TToolbarGroup, TToolbarGroupDropdown } from './toolbarGroups'
import { IClass } from '@shared/types/classes.ts'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { findChildsByBaseClasses } from '@shared/utils/classes'
import { Select } from '@shared/ui/forms'

interface IToolbarProps {
    objectClasses: IClass['id'][],
    object?: number
}

const Toolbar: FC<IToolbarProps> = ({ objectClasses = [], object }) => {
    const editor = useSlate()
    const classById = useClassesStore(selectGetClassById)
    const relations = useRelationsStore(selectRelations)
    const [linkedClasses, setLinkedClasses] = useState<IClass['id'][]>([])
    const [value, setValue] = useState<string>(null)

    // Получаем дочерние классы
    const getChildClassIds = objectClasses?.flatMap((cls) => {
        return findChildsByBaseClasses({
            relations,
            classIds: [cls],
            package_area: 'SUBJECT',
        })
    })
        ?.filter((cls, index, array) => array.indexOf(cls) === index)
        ?.map((cls) => classById(cls))
        ?.sort((a, b) => a.name.localeCompare(b.name)) || []

    //Получаем список связанных классов
    const relClassesList = getChildClassIds?.map((cls) => ({ label: cls.name, value: cls.id }))

    //Функция получения списка атрибутов объекта
    const getAttributeList = (classes: IClass['id'][], isLinkedClass: boolean) => {
        const fullClasses = classes?.map((cls) => classById(cls))

        if (isLinkedClass) {
            return fullClasses?.flatMap((cls) => cls?.attributes
                ?.flatMap((attr) => [
                    { label: `${cls.name}: ${attr.name} (название)`, 
                        value: `object.relClass.${cls.id}.object.attr.${attr.id}:name` },
                    { label: `${cls.name}: ${attr.name} (значение)`, 
                        value: `object.relClass.${cls.id}.object.attr.${attr.id}:value` }
                ])
            )
        } else {
            const classesAttributes = fullClasses?.flatMap((cls) => cls?.attributes)
                ?.filter((attribute, index, array) => index === array
                    .findIndex(arrItem => arrItem.id === attribute.id))

            return classesAttributes?.flatMap((attr) => [
                { label: `${attr.name}: название`, value: `object.attr.${attr.id}:name` },
                { label: `${attr.name}: значение`, value: `object.attr.${attr.id}:value` }
            ])
            
        }
    }

    //Получам список атрибутов объекта
    const attributesList = getAttributeList(linkedClasses?.length > 0 ? linkedClasses : objectClasses,
        linkedClasses?.length > 0)?.sort((a, b) => a.label.localeCompare(b.label)) ?? []

    //Обновляем опции для отрисовки (добавляем список атрибутов)
    const updatedToolbarGroups = useMemo(() => {
        return toolbarGroups.map((group) =>
            group.map((item: TToolbarGroup) => {
                if (item.type === 'dropdown' && linkedClasses?.length > 0) {
                    const newOptions = object === null ? [] 
                        : linkedClasses?.flatMap((cls) => (item as TToolbarGroupDropdown).options
                            .map((opt) => ({ 
                                label: `${classById(cls).name}: ${opt.label}`,
                                value: `object.relClass.${cls}.${opt.value}` }))
                        )

                    return {
                        ...item,
                        options: [
                            ...newOptions,
                            ...attributesList,
                        ]
                    }
                } else if (item.type === 'dropdown') {
                    return {
                        ...item,
                        options: [
                            ...(object === null ? [] : (item as TToolbarGroupDropdown).options),
                            ...attributesList,
                        ]
                    }
                } else if (item.type === 'dropdownClasses') {
                    const fullObjectClasses = objectClasses?.map((cls) => classById(cls))
                    const fullObjectClassesNames = objectClasses?.length > 0 
                        ? fullObjectClasses.map(obj => obj.name).join(', ')
                        : 'Класс отсутствует'

                    return {
                        ...item,
                        options: [
                            { label: fullObjectClassesNames, value: '' },
                            { label: 'Связанные классы:', value: 'linked_classes', disabled: true },
                            ...relClassesList,
                        ]
                    }
                }

                return item
            })
        )
    }, [linkedClasses, attributesList])

    //Блок кнопок форматирования
    const BlockButton = ({ format }) => {
        return (
            <ToolbarButton
                active={isBlockActive(editor, format)}
                format={format}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleBlock(editor, format)
                }}
            >
                <ToolbarIcon icon={format} />
            </ToolbarButton>
        )
    }

    //Блок разметки (выравнивания)
    const MarkButton = ({ format }) => {
        return (
            <ToolbarButton
                active={isMarkActive(editor, format)}
                format={format}
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleMark(editor, format)
                }}
            >
                <ToolbarIcon icon={format} />
            </ToolbarButton>
        )
    }

    const onChangeClass = (value: IClass['id']) => {
        if (!value) {
            return setLinkedClasses([])
        }

        setLinkedClasses([value])
    }

    const handleSelectTemplate = (option) => {
        if (!option) {
            return setValue(null)
        }
        const { label, value } = option

        insertTemplate(editor, `{{${label}}}`, `{{${value}}}`)
        setValue(null)
    }

    return (
        <div className="toolbar">
            {updatedToolbarGroups.map((group, index) => (
                <span key={index} className="toolbar-grp">
                    {group.map((item) => {
                        switch (item.type) {
                            case 'block':
                                return <BlockButton key={item.id} {...item} />
                            case 'mark':
                                return <MarkButton key={item.id} {...item} />
                            case 'dropdownClasses':
                                return (
                                    <Select 
                                        key={item.id}
                                        defaultValue=""
                                        options={(item as TToolbarGroupDropdown).options} 
                                        placeholder="Текущий класс"
                                        style={{ width: 220, height: 32 }} 
                                        onChange={onChangeClass}
                                    />
                                )
                            case 'dropdown':
                                return (
                                    <Select 
                                        key={item.id}
                                        value={value}
                                        options={(item as TToolbarGroupDropdown).options} 
                                        labelInValue
                                        placeholder="Вставить шаблон"
                                        style={{ width: 220, height: 32 }} 
                                        onChange={handleSelectTemplate}
                                    />
                                )
                            default:
                                return null
                        }
                    })}
                </span>
            ))}
        </div>
    )
}

export default Toolbar