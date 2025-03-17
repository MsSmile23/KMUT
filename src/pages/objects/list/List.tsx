import { FC, useEffect } from 'react'
import { Card } from 'antd';


import ObjectTableContainer from '@containers/objects/ObjectTableContainer/ObjectTableContainer'
import { useSearchParams } from 'react-router-dom';
import { useApi2 } from '@shared/hooks/useApi2';
import { getClassById } from '@shared/api/Classes/Models/getClassById/getClassById';

import { PageHeader } from '@shared/ui/pageHeader';
import { breadCrumbs } from '@pages/objects/list/objectsListData';
import { selectClasses, useClassesStore } from '@shared/stores/classes';

const List: FC = () => {

    const [searchParams] = useSearchParams()
    const classId = Number(searchParams.get('class_id'))
    const classes = useClassesStore(selectClasses)
    const className = classes.find(cl => cl.id == classId)?.name

    // const clsApi = useApi2(getClassById, { onmount: 'item', payload: { id: String(classId) } })

    // useEffect(() => {
    //     clsApi.request({ id: String(classId) }).then()
    // }, [classId])

    return (
        <>
            <PageHeader
                title={`Таблица объектов класса ${className}`}
                routes={breadCrumbs}
            />
            <Card style={{ marginTop: '10px' }}>
                <ObjectTableContainer />
            </Card>
        </>
    )
}

export default List