import { FC, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Card } from 'antd'
import ObjectFormContainer from '@containers/objects/ObjectFormContainer/ObjectFormContainer/ObjectFormContainer'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { ECPage404 } from '@shared/ui/ECUIKit/errors/ECPage404/ECPage404'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { IObject } from '@shared/types/objects'

const Update: FC = () => {
    const { id = '' } = useParams<{ id?: string; classId?: string }>()
    // const findObject = useObjectsStore(selectFindObject)
    // const object = findObject(Number(id))
    const classes = useClassesStore(selectClasses)
    const location = useLocation()
    const classId = location.search.split('=')[1]
    const [object, setObject] = useState<IObject>(null)
    const className = classes.find((cl) => cl.id == object?.class_id || cl.id == Number(classId))?.name
    const {
        name = ' ',
        class_id,
        // classData
    } = object || {}

    const title = `Редактирование объекта ${name} [${id}] класса ${className ?? ''} [${class_id ?? classId ?? ''}]`


    useDocumentTitle(title)


    return (
        <>
            <PageHeader
                title={title}
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${class_id ?? classId ?? ''}`,
                        breadcrumbName: `Таблица объектов класса ${className ?? '[объект не найден]'}`,
                    },
                    {
                        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: title,
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <> {object !== undefined ? (
                    <ObjectFormContainer
                        setObject={setObject}
                        id={Number(id)} 
                        classId={classId} 
                        key="meinObject"
                    />
                ) : (
                    <ECPage404
                        text="Такого объекта не существует"
                        url={
                            classId
                                ? `/manager/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${
                                    class_id ?? classId ?? ''
                                }`
                                : undefined
                        }
                    />
                )}
                </>
            </Card>
        </>
    )
}

export default Update