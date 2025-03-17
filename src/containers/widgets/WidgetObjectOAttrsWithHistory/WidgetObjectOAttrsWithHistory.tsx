import { FC, useEffect, useMemo, useState } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { IDynamicFormPart, IWidgetObjectOAttrsWithHistoryFormProps } from './ObjectOAttrsWithHistoryForm'
import { IObject } from '@shared/types/objects';

const WidgetObjectOAttrsWithHistory: FC<TWidgetFormSettings<
    IWidgetObjectOAttrsWithHistoryFormProps
>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings
    const { countInARow, items, historyDataType, representationType, representationProps, limit,
        linkedObjects, linkedObjectsClass, skeletonItemCount, noAttributeTitle
    } = widget
    const [object, setObject] = useState<IObject>(null)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const currentObjectInStore = getObjectByIndex('id', vtemplate?.objectId)
    
    useEffect(() => {
        setObject((v) => {
            if (JSON.stringify(v) !== JSON.stringify(currentObjectInStore)) {
                return currentObjectInStore
            }

            return v
        })
    }, [currentObjectInStore, settings])

    const result: IDynamicFormPart['OASettings'] = useMemo(() => {
        return items?.reduce((acc, item) => {
            if (widget[item.mnemo].enabled) {
                widget[item.mnemo].OASettings.forEach(OASettings => {
                // Если есть targetClassIds, то нужно пройтись по дочерним объектами и добавить их 
                    if (item.formProps.showForm.includes('targetClassIds')) {
                        if (OASettings?.targetClassIds?.length > 0) {
                        // при указании целевых классов, если выбран объект, то показываем его
                            if (OASettings?.objectId) {
                                acc.push(OASettings)
                            // если не выбран ни один, то показываем атрибуты всех связанных объектов 
                            } else {
                                const children = findChildObjectsWithPaths({
                                    currentObj: object,
                                    targetClassIds: OASettings?.targetClassIds,
                                    childClassIds: OASettings?.linkedClassIds,
                                }).objectsWithPath

                                children.forEach(child => {
                                    const childObject = getObjectByIndex('id', child?.id)
                                    
                                    const rightLinksIdx = childObject.links_where_left.findIndex(link => {
                                        const isInLinkedObjectsList = linkedObjects?.length > 0
                                            ? linkedObjects.includes(link.right_object_id)
                                            : true
                                        
                                        return link.relation.right_class_id === linkedObjectsClass && 
                                            isInLinkedObjectsList
                                    })
                                    const leftLinksIdx = childObject.links_where_right.findIndex(link => {
                                        const isInLinkedObjectsList = linkedObjects?.length > 0
                                            ? linkedObjects.includes(link.left_object_id)
                                            : true

                                        return link.relation.left_class_id === linkedObjectsClass && 
                                            isInLinkedObjectsList
                                    })

                                    const isHaveLinksWith = leftLinksIdx >= 0 || rightLinksIdx >= 0
                                    const isInLinkedClasses = linkedObjectsClass
                                        ? isHaveLinksWith
                                        : true
                                    
                                    if (isInLinkedClasses) {
                                        acc.push({
                                            ...OASettings,
                                            objectId: child?.id,
                                        })
                                    }
                                })
                            }

                        }
                    // иначе добавляем сам объект
                    } else {
                        if (['own', 'linked'].includes(item.mnemo)) {
                            acc.push({
                                ...OASettings,
                                objectId: vtemplate.objectId,
                            })
                        } else {
                            acc.push(OASettings)
                        }
                    }
                })
            }

            return acc
        }, [] as IDynamicFormPart['OASettings'])
    }, [settings, object])

    const autoUpdate = vtemplate?.builderView
        ? {
            enabled: !vtemplate?.builderView
        } : undefined

    return (
        <div
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            <ObjectOAttrsWithHistory
                object={object}
                asWidget
                countInARow={countInARow}
                limit={limit}
                objectsWithAttrs={result}
                historyDataType={historyDataType}
                representationType={representationType}
                representationProps={representationProps}
                autoUpdate={autoUpdate}
                vtemplateType={vtemplate?.builderData}
                builderView={vtemplate?.builderView}
                skeletonItemCount={skeletonItemCount}
                noAttributeTitle={noAttributeTitle}
            />
        </div>
    )
}

export default WidgetObjectOAttrsWithHistory