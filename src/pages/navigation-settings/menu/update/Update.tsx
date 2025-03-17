import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import MenuForm from '@pages/navigation-settings/menu/components/MenuForm/MenuForm'

const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()

    const title = 'Редактирование меню'

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
                        path: `${ROUTES.NAVIGATION}/${ROUTES.MENU}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Список сконструированных меню',
                    },
                    {
                        path: `/${ROUTES.MENU_CONSTRUCTOR}/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: 'Конструктор меню',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <MenuForm id={Number(id)} />
            </Card>
        </>
    )
}

export default Update