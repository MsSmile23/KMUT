import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { ILinkedObjectsForm } from '../LinkedObjects/LinkedObjects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { selectObjectStateEntity, useStateEntitiesStore } from '@shared/stores/state-entities'
import { selectState, useStatesStore } from '@shared/stores/states'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { getStateViewParamsWithDefault } from '@shared/utils/states'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { Divider } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getURL } from '@shared/utils/nav'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'

interface IObjectStatesWithHierarchy {
    viewType: 'horizontal'
    parentLinkedObjectsParams: ILinkedObjectsForm
    childrenLinkedObjectsParams: ILinkedObjectsForm
    objectId?: number
    oncClickType?: 'modal' | 'link'
    attrMainObjects?: number
    attrLinkedObjects?: number
}
const ObjectStatesWithHierarchy: FC<IObjectStatesWithHierarchy> = ({
    viewType = 'horizontal',
    parentLinkedObjectsParams,
    childrenLinkedObjectsParams,
    objectId,
    oncClickType = 'modal',
    attrMainObjects,
    attrLinkedObjects

}) => {
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const getState = useStateEntitiesStore(selectObjectStateEntity)
    const statuses = useStatesStore(selectState)
    const attributes = useAttributesStore(selectAttributes)
    const shortNameAttribute = attributes.find((attr) => attr.attribute_stereotype?.mnemo == 'short_name')

    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const navigate = useNavigate()
    const ref = useRef(null)

    const objectForModal = useMemo(() => {
        return getObjectByIndex('id', objForModalId)
    }, [objForModalId])

    const [labels, setLabels] = useState<any[]>([])

    useEffect(() => {
        const data: any[] = []

        if (parentLinkedObjectsParams && childrenLinkedObjectsParams) {
            if (parentLinkedObjectsParams.baseObject || objectId) {
                const basicObjects = findChildObjectsWithPaths({
                    childClassIds: parentLinkedObjectsParams?.connectingClasses,
                    targetClassIds: parentLinkedObjectsParams?.targetClasses,
                    currentObj:
                        getObjectByIndex('id', parentLinkedObjectsParams?.baseObject) ??
                        getObjectByIndex('id', objectId),

                    filter: {
                        linkedObjects: parentLinkedObjectsParams?.linkedObjects
                            ? [
                                {
                                    classId: parentLinkedObjectsParams?.linkedObjectsClasses,
                                    objectIds: parentLinkedObjectsParams?.linkedObjects,
                                },
                            ]
                            : [],
                    },
                })
                    .objectsWithPath?.map((item) => item.id)
                    .map((item) => getObjectByIndex('id', item))

                basicObjects.forEach((item) => {
                    const children = []
                    const linkedObjects = findChildObjectsWithPaths({
                        childClassIds: childrenLinkedObjectsParams.connectingClasses,
                        targetClassIds: childrenLinkedObjectsParams.targetClasses,
                        currentObj: getObjectByIndex('id', item?.id),

                        filter: {
                            linkedObjects: childrenLinkedObjectsParams?.linkedObjects
                                ? [
                                    {
                                        classId: childrenLinkedObjectsParams?.linkedObjectsClasses,
                                        objectIds: childrenLinkedObjectsParams?.linkedObjects,
                                    },
                                ]
                                : [],
                        },
                    })
                        .objectsWithPath.map((item) => item.id)
                        .map((item) => getObjectByIndex('id', item))

                    linkedObjects.forEach((linkObj) => {
                        const getStateId = getState(linkObj.id)
                        const status = statuses(getStateId?.state)

                        const viewParams = getStateViewParamsWithDefault(status)

                        const shortNameAttr = linkObj?.object_attributes.find(
                            (attr) => attr.attribute_id == shortNameAttribute?.id
                        )

                        const shortNameForClassAttr = linkObj?.class?.attributes?.find(
                            (attr) => attr.id == shortNameAttribute?.id
                        )?.pivot?.static_feature

                        const attrName = linkObj?.object_attributes.find(
                            (attr) => attr?.attribute_id == attrLinkedObjects
                        )?.attribute_value

                        const dataBlock = {
                            name: attrName || shortNameForClassAttr || shortNameAttr?.attribute_value || linkObj?.name,
                            color: viewParams?.fill,
                            id: linkObj?.id,
                        }

                        children.push(dataBlock)
                    })

                    const getStateId = getState(item.id)
                    const status = statuses(getStateId?.state)

                    const viewParams = getStateViewParamsWithDefault(status)

                    const attrName = item?.object_attributes.find(
                        (attr) => attr?.attribute_id == attrMainObjects
                    )?.attribute_value
                    const shortNameAttr = item?.object_attributes.find(
                        (attr) => attr.attribute_id == shortNameAttribute?.id
                    )

                    const shortNameForClassAttr = item?.class?.attributes?.find(
                        (attr) => attr.id == shortNameAttribute?.id
                    )?.pivot?.static_feature

                    const dataBlock = {
                        name: attrName || shortNameForClassAttr || shortNameAttr?.attribute_value || item?.name,
                        color: viewParams?.fill,
                        id: item?.id,
                        children: children,
                    }

                    data.push(dataBlock)
                })
            }
        }

        setLabels(data)
    }, [parentLinkedObjectsParams, childrenLinkedObjectsParams, attrMainObjects, attrLinkedObjects])

    const handleClose = () => {
        setIsModalVisible(false)
        setObjForModalId(undefined)
    }

    const onLabelClickHandler = (id) => {
        if (oncClickType == 'modal') {
            setIsModalVisible(true)
            setObjForModalId(id)
        }

        if (oncClickType == 'link') {
            navigate(getURL(`${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}`, 'showcase'))
        }
    }

    return (
        <>
            <ObjectCardModal
                objectId={objForModalId}
                modal={{
                    title: objectForModal?.class?.name,
                    open: isModalVisible,
                    onCancel: handleClose,
                }}
            />
            <div style={{ width: '100%', textAlign: 'center',  overflowY: 'auto',  height: 'calc(100% - 15px)' }}>
                {labels?.map((label, index) => (
                    <div key={`key_${label?.id}`}>
                        <div
                            style={{
                                display: 'flex',
                                // width: '100%',
                                padding: '12px',
                                gap: '15px',
                            }}
                            key={`key_${label?.id}`}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: label?.color,

                                    borderRadius: '8px',
                                    width: '50%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {onLabelClickHandler(label?.id)}}
                            >
                                {label?.name}
                            </div>
                            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {label?.children.map((item) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                setIsModalVisible(true)
                                                setObjForModalId(item.id)
                                            }}
                                            key={`linkObj_${item?.id}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '30px',
                                                background: item?.color,
                                                // padding: '15px',
                                                borderRadius: '8px',
                                                // width: '100%',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {item?.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div key={`divider_${label?.id}`} style={{ width: '100%', padding: '0px 12px' }}>
                            {index !== labels?.length - 1 && <Divider style={{ margin: '5px 0' }} />}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ObjectStatesWithHierarchy