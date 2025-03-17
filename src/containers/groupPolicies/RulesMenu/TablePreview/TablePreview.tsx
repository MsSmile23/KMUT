import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { findChildObjectsByBaseClasses } from '@shared/utils/objects'
import { FC, useEffect, useMemo, useState } from 'react'

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50
    },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',

    },
    {
        title: 'Код',
        dataIndex: 'code',
        key: 'code',
        width: 80
    },
    // {
    //     title: 'Класс',
    //     dataIndex: 'class',
    //     key: 'class',
    //     width: 80
    // },
]

interface ITablePreviewProps {
    targetClassId: number | string, 
    filterClassId: number,
    filterObjectsIds: number[]
}

const TablePreview: FC<ITablePreviewProps> = (props) => {
    const { targetClassId, filterClassId, filterObjectsIds } = props
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const allClasses = useClassesStore(selectClasses)
    const allClassesIds = allClasses.map(i => i.id)
    const [ renderObjects, setRenderObjects ] = useState<IObject[]>([])

    useEffect(() => {
        if (targetClassId === filterClassId || typeof targetClassId === 'string') {
            const fullObjects = filterObjectsIds.map(id => getObjectByIndex('id', id))

            setRenderObjects(fullObjects)
        } else {
            const objectsByTargetClass = getObjectByIndex('class_id', targetClassId)
            const filterLinkingObjects = objectsByTargetClass.reduce((acc, item) => {
                const linkingObjects = findChildObjectsByBaseClasses({
                    childClassIds: allClassesIds,
                    targetClassIds: [filterClassId],
                    currentObj: item,
                })
                const fullObjects = linkingObjects.map(id => getObjectByIndex('id', id))
                    .filter(obj => filterObjectsIds.includes(obj.id))

                return [...acc, ...fullObjects]   
            }, [])

            setRenderObjects([...new Set(filterLinkingObjects)])
        }


    }, [targetClassId, filterClassId, filterObjectsIds])

    const rows = useMemo(() => renderObjects.map((obj, i) => ({
        key: `${i}`,
        id: obj?.id,
        name: obj?.name,
        code: obj?.codename,
    })
    ), [renderObjects])

    return (
        <EditTable 
            columns={columns}
            hideSettingsButton={true}
            sortDirections={['descend', 'ascend']}
            bordered={true}
            tableId="preview_objects-table"
            key="preview_objects-table"
            rows={rows}
            virtual={false}
            rowSelection={undefined}
        />
    )
}

export default TablePreview