import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES } from '@shared/config/paths';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { Card } from 'antd';
import { FC } from 'react';
import { LicenseActionTableContent } from '@containers/license/LicenseActionsTableContainer/LicenseActionTableContainer';


const Show: FC = () => {
    const title = 'Лицензия'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Лицензия" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: ROUTES.LICENSE,
                        breadcrumbName: 'Лицензия',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <LicenseActionTableContent />
            </Card>
        </>
    )
}

export default Show