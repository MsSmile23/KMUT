import { SystemLogTable } from '@entities/stats/SystemLogTable/SystemLogTable'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { PageHeader } from '@shared/ui/pageHeader'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Card } from 'antd'
import { FC } from 'react'

const Syslog: FC = () => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    return (
        <>
            <PageHeader
                title="Системный журнал"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Объекты',
                    },
                    {
                        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.SYSLOG}/:id`,
                        breadcrumbName: 'Системный журнал',
                    },
                ]}
            />
            <Card
                style={{
                    marginTop: '10px',
                    background: backgroundColor ?? 'transparent',
                    border: themeMode == 'dark' ? 'none' : '1px solid #f0f0f0',
                }}
            >
                <SystemLogTable chosenColumns={['hostname', 'appName']} hideChosenColumns />
            </Card>
        </>
    )
}

export default Syslog