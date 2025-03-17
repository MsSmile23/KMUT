import React, { useEffect } from 'react'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { ArtemTreeUtils } from '@pages/dev/artem/ArtemDev/ArtemTree/ArtemTree.utils'
import { selectFindObject, selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { getClassesByIds } from '@shared/utils/classes'
import { selectRelation, useRelationsStore } from '@shared/stores/relations'

const ArtemTree = () => {
    const objects = useGetObjects()
    const getObjectById = useObjectsStore(selectFindObject)
    const getObjectsByIndex = useObjectsStore(selectObjectByIndex)
    const getClassById = useClassesStore(selectGetClassById)
    const getRelById = useRelationsStore(selectRelation)

    useEffect(() => {
        const leafObjects = getObjectsByIndex('class_id', 10055)
        const branchObjects = getObjectsByIndex('class_id', 10220)
        const cls = getClassById(10222)
        console.log('Ветки', branchObjects)
        console.log('Лепестки', leafObjects)
        //const tree = ArtemTreeUtils.treeGenerate([10001], objects, getObjectById)
    }, [objects])

    return (
        <div>

        </div>
    )
}

export default ArtemTree