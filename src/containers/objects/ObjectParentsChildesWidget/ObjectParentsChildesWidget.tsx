import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { selectStateEntities, useStateEntitiesStore } from '@shared/stores/state-entities'
import { selectStates, useStatesStore } from '@shared/stores/states'
import { IObject } from '@shared/types/objects'
import { bestTextColor } from '@shared/utils/common'
import { getURL } from '@shared/utils/nav'
import { findLinkedObjects } from '@shared/utils/objects'
import { Col, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IParents {
    type: 'parent'
    parentRelationIds: number[]
}

interface IChilds {
    type: 'children'
    childRelationIds: number[]
}

interface IChildAndParent {
    type: 'all'
    parentRelationIds: number[]
    childRelationIds: number[]
}

type IObjectParentsChildesWidget = {
    objectId: number
    showClassName?: boolean
} & (IParents | IChilds | IChildAndParent)

const { Text } = Typography
const ObjectParentsChildesWidget: FC<IObjectParentsChildesWidget> = (props) => {
    const objects = useGetObjects()
    const statuses = useStatesStore(selectStates)?.object_states
    const states = useStateEntitiesStore(selectStateEntities)?.objects
    const [hierarchyObjects, setHierarchyObjects] = useState<IObject[]>([])
    const navigate = useNavigate()

    const isShowTitle = props.showClassName ?? true


    useEffect(() => {

        const object = objects.find((obj) => obj?.id == props.objectId)
        const chosenObjects: any[] = []

        if (props.type == 'all' || props.type == 'parent') {
            let actualObject = object

            props.parentRelationIds.forEach((parent) => {
                const localObj = findLinkedObjects({ object: actualObject, relationIds: [parent], objects: objects })[0]

                chosenObjects.unshift(localObj)
                actualObject = localObj
            })
        }
        chosenObjects.push(object)

        if (props.type == 'all' || props.type == 'children') {
            let actualObject = object

            props.childRelationIds.forEach((child) => {
                const localObj = findLinkedObjects({ object: actualObject, relationIds: [child], objects: objects })[0]

                chosenObjects.push(localObj)
                actualObject = localObj
            })
        }
        setHierarchyObjects(chosenObjects)
    }, [props.objectId])

    const getColorForSubject = (object) => {
        const colorId = states?.find((st) => st.entity == object?.id)?.state
        const color: any = statuses?.find((status) => status?.id == colorId)?.view_params?.color

        return color
    }


    return (
        <>
            {hierarchyObjects.map((item) => {
                const color = bestTextColor(getColorForSubject(item) ?? '#FFFFFF')
                const backgroundColor = getColorForSubject(item)

                return (
                    <Col
                        style={{
                            width: '100%',
                            border: item?.id == props.objectId ? '3px solid #323030' : '1px solid #323030',
                            boxShadow: 'rgb(240 242 245) 0px 0px 2px',
                            borderRadius: '3px',
                            padding: '5px',
                            marginLeft: '25px',
                            marginRight: '25px',
                            marginTop: item?.id == props.objectId ? '15px' : '5px',
                            marginBottom: item?.id == props.objectId ? '15px' : '5px',
                            cursor: 'pointer',
                            backgroundColor: backgroundColor,
                        }}
                        key={item.id}
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}.${item?.id}`, 
                                'showcase'
                            ))
                            // navigate(`/objects/show/${item?.id}`)
                        }}
                    >
                        {isShowTitle && (
                            <Text style={{ color: color }} strong>
                                {item?.class?.name}:
                            </Text>
                        )}
                        <Text style={{ color: color }}>{item?.name}</Text>
                    </Col>
                )
            })}
        </>
    )
}

export default ObjectParentsChildesWidget