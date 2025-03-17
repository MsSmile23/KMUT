
import { FC, useEffect, useState } from 'react'
import { Card } from 'antd'
import { useSearchParams } from 'react-router-dom'
import ObjectFormContainer from '@containers/objects/ObjectFormContainer/ObjectFormContainer/ObjectFormContainer'

import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import { SERVICES_CLASSES } from '@shared/api/Classes'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';

const Create: FC = () => {
    const [searchParams] = useSearchParams()
    const classId = searchParams.get('class_id')
    // const classId = Number(searchParams.get('class_id'))
    const [className, setClassName] = useState(null)

    const title = `Создание объекта класса ${className ?? ''} [${classId ?? ''}]`

    useDocumentTitle(title)

    useEffect(() => {
        if (classId !== undefined && classId !== null) {

            SERVICES_CLASSES.Models.getClassById({ id: String(classId) }).then((response) => {
                if (response.success) {
                    if (response?.data !== undefined) {
                        setClassName(response?.data.name)

                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId])

    return (
        <>
            <PageHeader
                title={title} routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${classId}`,
                        breadcrumbName: 'Объекты',
                    },
                    {
                        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.CREATE}/:id`,
                        breadcrumbName: title,
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <ObjectFormContainer classId={classId} key="meinObject" />
            </Card>
        </>
    )
}


export default Create