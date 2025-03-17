import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Form, Switch } from 'antd'
import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { Select } from '@shared/ui/forms'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IFieldMnemo, IOptionsListAll, ITargetObjectsAndOAttrsForm, ITargetObjectsAndOAttrsFormProps } from './TargetObjectsAndOAttrsForm'
import { IObject } from '@shared/types/objects'
import { IClass } from '@shared/types/classes'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { findChildObjectsWithPaths } from '@shared/utils/objects'

interface ISortableFormPart {
    currentItem: ITargetObjectsAndOAttrsForm
    field: any
    labels: any
    length: number
    index: number
    remove: any
    customClearFields: any
    styles: any
    restProps?: any
    optionsListSettings?: IOptionsListAll
    isSingle?: boolean
    showForm?: ITargetObjectsAndOAttrsFormProps['showForm']
    currentClass?: IClass
    currentObjectId?: IObject['id']
    targetClassIds?: number[]
    linkedClassIds?: number[]
    baseClasses?: number[]
}
export const SortableFormPart = ({
    currentItem, field, length, index, /* labels, */
    remove, customClearFields, styles, optionsListSettings, baseClasses,
    currentObjectId, isSingle, showForm, ...restProps
}: ISortableFormPart) => {
    const {
        attributes,
        setActivatorNodeRef,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: currentItem?.fieldId })

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const currentObject = getObjectByIndex('id', currentObjectId)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const storeClasses = useClassesStore(selectClasses)
        .reduce((acc, item) => {
            if (!item.is_abstract && item.package_id === PACKAGE_AREA.SUBJECT) {
                acc.push({
                    value: item?.id,
                    label: item?.name
                })
            }

            return acc
        }, [])
        .sort((a, b) => a?.label.localeCompare(b?.label))
    const TL: IFieldMnemo[] = ['targetClassIds', 'linkedClassIds']
    const childrenObjects = currentObject && 
        TL.every(item => showForm.includes(item)) &&
        currentItem.targetClassIds?.length > 0
        ? findChildObjectsWithPaths({
            currentObj: currentObject,
            targetClassIds: currentItem?.targetClassIds,
            childClassIds: currentItem?.linkedClassIds,
        }).objectsWithPath 
        : []

    // Определить классы, от которых нужно получить атрибуты
    const getCurrentClasses = () => {
        if (currentItem?.targetClassIds && currentItem?.targetClassIds?.length > 0) {
            return currentItem?.targetClassIds.map(id => getClassByIndex('id', id))
        } else {
            return baseClasses.map(cls => getClassByIndex('id', cls)) ?? []
        }

        /* // Если форма содержит поле classId и он выбран
        if (currentItem?.classId) {
            return [getClassByIndex('id', currentItem?.classId)]
        // Если форма содержит поля targetClassIds и linkedClassIds и в них что-то выбрано
        } else if (currentItem?.targetClassIds && currentItem?.targetClassIds?.length > 0) {
            return currentItem?.targetClassIds.map(id => getClassByIndex('id', id))
        // Если не выбраны поля classId или targetClassIds и linkedClassIds, но есть выбранный объект
        } else if (currentItem?.objectId) {
            const object = getObjectByIndex('id', currentItem?.objectId)

            return [getClassByIndex('id', object?.class_id)]
        } else {
            return []
        } */
    } 

    // Создать список атрибутов истории выбранных классов
    const getHistoryAttributesList = (isHistoryAttr: boolean) => {        
        const classes = getCurrentClasses()
        const attrs = classes.reduce((acc, classItem) => {
            classItem?.attributes.forEach(attr => {
                if (isHistoryAttr 
                    ? (attr.history_to_cache || attr.history_to_db)
                    : (!attr.history_to_cache || !attr.history_to_db)) {
                    const idx = acc.findIndex(item => item?.value === attr?.id)

                    if (idx < 0) {
                        acc.push({
                            value: attr?.id,
                            label: attr?.name
                        })
                    }
                }
            })

            return acc
        }, [])

        return attrs.sort((a, b) => a?.label.localeCompare(b?.label))
    }

    // console.log('currentItem', currentItem)
    // Создать список объектов, в зависимости от наличия полей (targetClassIds и linkedClassIds или classId) 
    const getObjectsOptionsList = () => {
        if (currentObject && 
            TL.every(item => showForm.includes(item)) 
        ) {
            if (currentItem?.targetClassIds?.length > 0) {
                return childrenObjects.map(item => {
                    return {
                        value: item?.id,
                        label: item?.name
                    }
                })
            }
        } else {
            const objects = getObjectByIndex('class_id', currentItem?.['classId'])

            return objects
                .map(item => {
                    return {
                        value: item?.id,
                        label: item?.name
                    }
                })
                .sort((a, b) => a?.label.localeCompare(b?.label))
        }
    }
    
    // Создать список дополнительных названий к тайтлу атрибутов
    const getNamesOptionsList = () => {
        const attrs = getHistoryAttributesList(false)
        const list = attrs.reduce((acc, attr) => {
            acc[0].options.push({
                value: attr?.value,
                label: attr?.label
            })

            return acc
        }, [{
            label: 'Атрибуты объекта',
            title: 'Атрибуты объекта',
            options: []
        }])

        if (optionsListSettings?.namesWithObject) {
            list?.unshift({
                label: 'Свойства объекта',
                title: 'Свойства объекта',
                options: [
                    {
                        value: 'id',
                        label: 'ID объекта',
                    },
                    {
                        value: 'name',
                        label: 'Название'
                    },
                    {
                        value: 'codename',
                        label: 'Код'
                    },
                ]
            })
        }

        return list
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes} 
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '100%',
                padding: 10,
                border: '1px solid #d9d9d9', 
                boxSizing: 'border-box', 
                ...styles?.formItem,
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {!isSingle && (
                <Form.Item
                    style={{ marginBottom: 0, }}
                >
                    <div 
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            borderRadius: 3,
                            cursor: 'move', 
                        }}
                        ref={setActivatorNodeRef}   
                        {...listeners}     
                    >
                        <svg viewBox="0 0 20 20" width="20" height="24" fill="#ccc">
                            <path 
                                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 
                                .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 
                                14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 
                                4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" 
                            />
                        </svg>
                    </div>
                </Form.Item>)}
            {showForm.includes('targetClassIds') && (
                <Form.Item
                    name={[field.name, 'targetClassIds']}
                    key={`${field.key}-target-${index}`}
                    style={{ marginBottom: 0, width: `${100 / (showForm.length + 1)}%` }}
                >
                    <ClassesCascader />
                </Form.Item>)}
            {showForm.includes('linkedClassIds') && (
                <Form.Item
                    name={[field.name, 'linkedClassIds']}
                    key={`${field.key}-linked-${index}`}
                    style={{ marginBottom: 0, width: `${100 / (showForm.length + 1)}%` }}
                >
                    <ClassesCascader />
                </Form.Item>)}
            {showForm.includes('class') && (
                <Form.Item 
                    name={[field.name, 'classId']}
                    style={{ marginBottom: 0, width: `${100 / (showForm.length + 1)}%` }}
                    key={`${field.key}-class-${index}`}
                >
                    <Select 
                        placeholder="Выберите класс"
                        options={optionsListSettings?.classes ?? storeClasses}
                        allowClear
                        autoClearSearchValue={true}
                        showSearch
                        filterOption={filterOption}
                        onClear={() => customClearFields('classId', index)}
                        {...restProps}
                    />
                </Form.Item>)}
            {showForm.includes('object') && (
                <Form.Item 
                    name={[field.name, 'objectId']}
                    style={{ marginBottom: 0, width: `${100 / (showForm.length + 1)}%` }}
                    key={`${field.key}-object-${index}`}
                >
                    <Select 
                        placeholder={currentItem?.targetClassIds?.length > 0 
                            ? 'Все объекты'
                            : 'Выберите объект'}
                        options={
                            optionsListSettings?.objects ?? 
                            getObjectsOptionsList() ?? 
                            []
                        }
                        allowClear
                        onClear={() => customClearFields('objectId', index)}
                        showSearch
                        autoClearSearchValue={false}
                        filterOption={filterOption}
                        {...restProps}
                    />
                </Form.Item>)}
            {showForm.includes('attribute') && (
                <Form.Item 
                    name={[field.name, 'attributeIds']}
                    style={{ marginBottom: 0, width: `${100 / (showForm.length + 1)}%` }}
                    key={`${field.key}-attrs-${index}`}
                >
                    <Select 
                        placeholder={currentItem?.attributeIds.length > 0 
                            ? 'Все атрибуты'
                            : 'Выберите атрибуты'}
                        options={
                            // optionsListSettings?.attributes ?? 
                            getHistoryAttributesList(true) ??
                            []
                        }
                        allowClear
                        mode="multiple"
                        showSearch
                        autoClearSearchValue={false}
                        filterOption={filterOption}
                        maxTagCount="responsive"
                        {...restProps}
                    />
                </Form.Item>)}
            <Form.Item 
                name={[field.name, 'showAttrValue']}
                style={{ marginBottom: 0, width: `${100 / (showForm.length + 1)}%` }}
                key={`${field.key}-attrsName-${index}`}
            >
                <Select 
                    placeholder="Выберите название"
                    options={
                        optionsListSettings?.names ?? 
                        getNamesOptionsList() ?? 
                        [] 
                    }
                    allowClear
                    showSearch
                    autoClearSearchValue={false}
                    filterOption={filterOption}
                    maxTagCount="responsive"
                    {...restProps}
                />
            </Form.Item>
            
            <Form.Item 
                name={[field.name, 'forceShow']}
                style={{ marginBottom: 0, width: 44 }}
                key={`${field.key}-forceShow-${index}`}
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>
            {!isSingle && length > 1 && (
                <Form.Item
                    style={{ marginBottom: 0, }}
                >
                    <div
                        onClick={() => {
                            remove(field.name)
                        }}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            borderRadius: 3,
                            cursor: 'pointer', 
                        }}    
                    >
                        <ECIconView 
                            icon="DeleteOutlined" 
                            style={{ 
                                cursor: 'pointer',
                                color: '#ccc', 
                                fontSize: 18, 
                            }}  
                        />
                    </div>
                </Form.Item>)}
        </div>
    )
}