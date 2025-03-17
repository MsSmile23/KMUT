import { PageHeader } from '@shared/ui/pageHeader'
import { FC, Suspense } from 'react'
import { Card, Flex, Spin } from 'antd'
import { demoPages } from '../demoPages'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
//import { DemoOAIndicators } from './DemoOAIndicators/DemoOAIndicators'


const Show: FC = () => {
    const location = useLocation()
    const currentMnemo = location.search.replace('?mnemo=', '')
    const currentPage = demoPages.find((page) => page.mnemo === currentMnemo) ?? demoPages[0]
    //const Component = React.lazy(() => import(`./${currentPage.component}`))

    const Component: FC<object> = React.lazy(() => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(import(`./${currentPage.component}/index.ts`)), 100);
        });
    });


    const breadCrumbs = [
        {
            path: ROUTES.MAIN,
            breadcrumbName: 'Главная',
        },
    
        {
            path: `/${ROUTES.DEMO}/${ROUTES_COMMON.LIST}`,
            breadcrumbName: 'Список демо-страниц',
        },
        {
            path: `/${ROUTES.DEMO}/${ROUTES_COMMON.SHOW}`,
            breadcrumbName: currentPage.name,
        },
    ]
    
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '10px',
            }}
        >
            <PageHeader
                title={currentPage.name ?? 'Демо-страница'}
                routes={breadCrumbs}
            />
            <Card key={currentMnemo} style={{ marginTop: 20 }}>
                <Suspense 
                    fallback={
                        <Flex
                            justify="center"
                            align="center"
                            style={{
                                height: '70vh'
                            }}
                        >
                            <Spin />
                        </Flex>
                    }
                >
                    <Component {...currentPage?.props} />
                </Suspense>
            </Card>
        </div>

    )
}

export default Show