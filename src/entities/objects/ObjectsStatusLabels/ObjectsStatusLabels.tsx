import { StateLabel } from '@entities/states/StateLabels'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { selectObjectStateEntity, useStateEntitiesStore } from '@shared/stores/state-entities'
import { selectState, useStatesStore } from '@shared/stores/states'
import { IClass } from '@shared/types/classes'
import { IObject } from '@shared/types/objects'
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject'
import { findChildObjectsByBaseClasses, findParentsByBaseClasses } from '@shared/utils/objects'
import { Col } from 'antd'
import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_LABEL_HEIGHT = 42

export interface IObjectsStatusLabelsProps {
    object_id: number
    classes_id: number[]
    childClsIds?: IClass['id'][]
    // labelWidth?: number | string
    displayType?: 'rows' | 'tags'
    linkedObjects?: {
        targetClsIds?: number[]
        linksClsIds: IClass['id'][] // связующие классы - на пути к целевым объектам
        linksDirection: 'parents' | 'childs' // направление поиска
    }
    height?: number
    labelsContainerHeight?: number
    labelsCount?: number
    maxWidth?: boolean
    customStyles?: any
    horizontalAligning?: 'left' | 'center' | 'right'
    verticalAlining?: 'left' | 'center' | 'right'
    chosenObjectsIds?: number[]
    chosenObjectsPrefix?: { id: number; prefix: string }[]
    labelWidth?: number | string
    labelValue?: number | string
    labelMargin?: number

    showParentStatus?: boolean
}

const ObjectsStatusLabels: FC<IObjectsStatusLabelsProps> = ({
    linkedObjects = {
        linksClsIds: [],
        linksDirection: 'childs',
        targetClsIds: [],
    },
    height,
    customStyles,

    labelsCount,
    labelsContainerHeight,
    horizontalAligning,
    chosenObjectsIds,
    chosenObjectsPrefix,

    ...props
}) => {
    const {
        object_id,
        classes_id,
        childClsIds,
        displayType = 'tags',
        labelWidth = 200,
        labelValue,
        verticalAlining,
        maxWidth = false,
        labelMargin,
        showParentStatus
    } = props

    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const objects = useGetObjects()

    const attributes = useAttributesStore(selectAttributes)

    const objectModal = useMemo(() => objects.find((obj) => obj.id === objForModalId), [objects, objForModalId])

    const parentObject = objectsStore((s) => s.getObjectById(object_id))

    const [objectsWithShortName, setObjectsWithShortName] = useState<any[]>([])

    const customLabelHeight =
        (labelsContainerHeight - 17 - 10 * (labelsCount - 1)) / labelsCount - 4 || DEFAULT_LABEL_HEIGHT

    const [additionalStyles, setAdditionalStyles] = useState<{
        display?: string
        flexDirection?: 'column' | 'row'
        justifyContent?: string
        alignItems?: string
        gap?: string
    }>({})

    const createAdditionalStyles = () => {
        const styles: {
            display?: string
            flexDirection?: 'column' | 'row'
            justifyContent?: string
            alignItems?: string
            gap?: string
        } = { display: 'flex', gap: '10px' }

        styles.flexDirection = displayType == 'rows' ? 'row' : 'column'

        switch (horizontalAligning) {
            case 'center':
                styles.justifyContent = 'center'
                break
            case 'right':
                styles.justifyContent = 'flex-end'
                break

            case 'left':
                styles.justifyContent = 'flex-start'
                break
            default:
                styles.justifyContent = 'start'
        }

        switch (verticalAlining) {
            case 'center':
                styles.alignItems = 'center'
                break

            case 'right':
                styles.alignItems = 'flex-end'
                break

            case 'left':
                styles.alignItems = 'flex-start'
                break

            default:
                styles.alignItems = 'start'
        }

        return styles
    }
    // const additionalStyles = createAdditionalStyles()

    //*Добавляем новые стили в зависимости от выбора в форме виджета

    useEffect(() => {
        if (horizontalAligning || verticalAlining) {
            const styles = createAdditionalStyles()

            setAdditionalStyles(styles)
        }
    }, [displayType, horizontalAligning, verticalAlining])

    const oidsFilter = useMemo(() => {
        switch (true) {
            //Поиск родительских объектов
            case parentObject && linkedObjects?.linksDirection == 'parents': {
                return findParentsByBaseClasses({
                    object: objects.find((item) => object_id == item.id),
                    targetClasses: linkedObjects.targetClsIds,
                    linkedClasses: linkedObjects.linksClsIds,
                    objects: objects,
                }).map((item) => item.id)
                // return findChildObjects_TEST({
                //     object: objects.find(item => object_id == item.id),
                //     targetClasses: linkedObjects.linksClsIds,
                //     objects: objects
                // }).map(item => item.id)
            }
            //Поиск дочерних объектов
            case parentObject && linkedObjects?.linksDirection == 'childs': {
                return findChildObjectsByBaseClasses({
                    childClassIds: childClsIds,
                    targetClassIds: classes_id,
                    currentObj: parentObject,
                })
            }
            default:
                return undefined
        }
    }, [parentObject, classes_id, findChildObjectsByBaseClasses, linkedObjects, object_id, objects])

    const filteredObjects: IObject[] = useMemo(
        () =>
            objects.filter((obj) => {
                return classes_id.includes(obj.class_id) && (oidsFilter === undefined || oidsFilter.includes(obj.id))
            }),
        [objects, classes_id, oidsFilter]
    )

    const getIdChildObject = useCallback((id: number) => {
        setIsModalVisible(true)
        setObjForModalId(id)
    }, [])

    const getState = useStateEntitiesStore(selectObjectStateEntity)
    const statuses = useStatesStore(selectState)

    let tagStyle: React.CSSProperties = {
        padding: 10,
        margin: 0,
        textAlign: 'center',
        borderRadius: '15px',
        fontSize: '12px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '100%',
        height: labelsCount ? Math.floor(customLabelHeight) : DEFAULT_LABEL_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        marginBottom: labelMargin ? labelMargin + 'px' : labelsCount ? '10px' : 0,
        cursor: 'pointer',
        maxHeight: 82,
        ...customStyles,
    }

    if (labelWidth && maxWidth == false) {
        tagStyle = {
            ...tagStyle,

            width: typeof labelWidth == 'string' ? labelWidth : `${labelWidth}px`,
        }
    }

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)

    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])

    useEffect(() => {
        const localObjects: any[] = []
        const shortNameAttribute = attributes.find((attr) => attr.attribute_stereotype?.mnemo == 'short_name')

        const classesSortOrder =
            linkedObjects.targetClsIds && linkedObjects.targetClsIds.length > 0
                ? linkedObjects.targetClsIds
                : classes_id && classes_id.length > 0
                    ? classes_id
                    : []

        //* В случае выбранных объектов в форме виджета
        let objectsArray = filteredObjects

        if (chosenObjectsIds?.length > 0) {
            const filteredObjects: any[] = []

            chosenObjectsIds.forEach((id) => {
                const obj = objects.find((ob) => ob.id == id)

                filteredObjects.push(obj)
            })

            objectsArray = filteredObjects
        }

        if (showParentStatus) {
            objectsArray.unshift(parentObject)
        }
        objectsArray.forEach((obj, index) => {
            const shortNameAttr = obj?.object_attributes?.find((attr) => attr?.attribute_id == shortNameAttribute?.id)
            const idx = classesSortOrder.findIndex((cls) => cls == obj.class_id)

            if (shortNameAttr !== undefined) {
                localObjects.push({ ...obj, shortName: shortNameAttr.attribute_value, order: idx })
            } else {
                localObjects.push({ ...obj, order: idx })
            }

            if (chosenObjectsPrefix?.length > 0) {
                localObjects[index].prefix = chosenObjectsPrefix.find((item) => item.id == obj.id)?.prefix
            }
        })
        const newObjects = localObjects.sort((a, b) => a.order - b.order)

        setObjectsWithShortName(Object.values(newObjects))
        // setObjectsWithShortName(localObjects)
    }, [object_id, chosenObjectsIds])

    const handleClose = () => {
        setIsModalVisible(false)
        setObjForModalId(undefined)
    }

    //*Если в форме выбрана вариант, что отображать в плашке
    const createCustomValue = (item) => {
        if (typeof labelValue === 'string') {
            switch (labelValue) {
                case 'id':
                    return item.id

                case 'name':
                    return item.name

                case 'codename':
                    return item.codename
            }
        } else {
            const attr = item.object_attributes.find((at) => at.attribute_id == labelValue)?.attribute_value

            return attr
        }
    }

    return (
        <>
            <Col
                ref={ref}
                span={24}
                style={
                    labelsCount
                        ? {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }
                        : height
                            ? {
                                height: `${height - 50}px`,
                                overflowY: clientHeight > Number(height) ? 'scroll' : 'auto',
                                overflowX: clientHeight > Number(height) ? 'clip' : 'auto',
                                textAlign: 'center',
                                ...additionalStyles,
                            }
                            : {
                                display: 'flex',
                                flexDirection: displayType === 'rows' ? 'row' : 'column',
                                flexWrap: 'wrap',
                                gap: 10,
                                justifyContent: 'center',
                                alignItems: 'center',

                                ...additionalStyles,
                            }
                }
            >
                {/* <div ref={ref}> */}
                {objectsWithShortName.map((item) => {
                    const getStateId = getState(item.id)
                    const status = statuses(getStateId?.state) /* || {} */

                    return (
                        <ButtonShowObject
                            key={`${object_id}-${item.id}-${item.class_id}`}
                            id={item.id}
                            noButton
                            maxWidth={maxWidth}
                        >
                            <StateLabel maxWidth={maxWidth} state={status} wrapperStyles={tagStyle} title={item.name}>
                                {item?.prefix ?? ''}
                                <div
                                    style={{
                                        width: '100%',
                                        whiteSpace: 'normal',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        maxHeight: '40px',
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {labelValue ? createCustomValue(item) : item?.shortName ?? item.name}
                                </div>
                            </StateLabel>
                        </ButtonShowObject>
                    )
                })}
                {/* </div> */}
            </Col>
            <ObjectCardModal
                objectId={objForModalId}
                modal={{
                    title: objectModal?.class?.name,
                    open: isModalVisible,
                    onCancel: handleClose,
                }}
            />
        </>
    )
}

export default ObjectsStatusLabels