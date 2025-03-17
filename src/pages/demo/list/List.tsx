import { FC } from 'react'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Card } from 'antd'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import { Link } from 'react-router-dom'
import { demoPages } from '../demoPages'
import { breadCrumbs } from './utils'

const List: FC = () => {
    useDocumentTitle('Список демо страниц')
    
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
                title="Список демо-страниц"
                routes={breadCrumbs}
            />
            <Card style={{ marginTop: '10px' }}>
                <div>
                    {demoPages.map((page, index) => {
                        return (
                            <div
                                key={page.mnemo}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',                                    
                                }}
                            >
                                <div style={{ width: '25px' }}>{index + 1}.</div>
                                <Link 
                                    to={`/${ROUTES.DEMO}/${ROUTES_COMMON.SHOW}?mnemo=${page.mnemo}`}
                                    style={{
                                        color: '#000000',
                                        listStyle: 'none',
                                    }}
                                >
                                    {page.name}
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}

export default List