import VtemplateMobileForm from '@app/vtemplateMobile/VtemplateMobileForm';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { selectGetClassById, useVTemplatesStore } from '@shared/stores/vtemplates';
import { PageHeader } from '@shared/ui/pageHeader';
import { Card } from 'antd';
import { FC } from 'react'
import { useParams } from 'react-router-dom';


const Update: FC = () => {

    const { id } = useParams<any>()
    const vTemplateStore = useVTemplatesStore(selectGetClassById)
    const object = vTemplateStore(Number(id))

    return (
        <div
            style={{
                height: '100%',
                margin: 10
            }}
        >
            <PageHeader
                title={`Редактирование макета [id${id}] ${object?.name}`}
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Таблица визуальных макетов',
                    },
                    {
                        path: `/${ROUTES.VTEMPLATES}/${ROUTES.MOBILE}/${ROUTES_COMMON.UPDATE}/${id}`,
                        breadcrumbName: 'Редактирование макета',
                    },
                ]}
            />
            <Card
                style={{ marginTop: '10px', flex: 1 }}
                bodyStyle={{ height: '100%' }}
            >
                <VtemplateMobileForm id={id} />
            </Card>
        </div>

    )
}

export default Update;