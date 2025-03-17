import VtemplateFormContainer from '@containers/vtemplates/VtemplateFormContainer/VtemplateFormContainer';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { selectGetClassById, useVTemplatesStore } from '@shared/stores/vtemplates';
import { PageHeader } from '@shared/ui/pageHeader';
import { Card } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Update = () => {

    const { id } = useParams<any>()
    const vTemplateStore = useVTemplatesStore(selectGetClassById)
    const object = vTemplateStore(Number(id))

    const [isFullScreenZone, setIsFullScreenZone] = useState<boolean>(object?.params.makroZone === 3)

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
                        path: `/${ROUTES.VTEMPLATES}/${ROUTES_COMMON.UPDATE}/${id}`,
                        breadcrumbName: 'Редактирование макета',
                    },
                ]}
            />
            <Card
                style={isFullScreenZone ? {
                    marginTop: '10px',
                    flex: 1,
                    height: '100%'
                } : { marginTop: '10px', flex: 1 }}
                bodyStyle={isFullScreenZone ? { height: 'calc(100% - 100px)' } : { height: '100%' }}
            >
                <VtemplateFormContainer
                    updateDataProp={vTemplateStore(Number(id))}
                    setIsFullScreenZone={setIsFullScreenZone}
                />
            </Card>
        </div>

    )
}

export default Update;