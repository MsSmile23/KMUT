import { useLocation } from 'react-router-dom'
import { AppRouterNew } from './app/AppRouterNew'
import { ConfigProvider } from 'antd'
import ruRu from 'antd/locale/ru_RU'
import 'dayjs/locale/ru'
import { useTheme } from '@shared/hooks/useTheme'
import { FC, useEffect, useState } from 'react'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { useHealth } from '@shared/hooks/useHealth'
import { Buttons } from '@shared/ui/buttons'
import { zIndex } from '@shared/config/zIndex.config'

/**
 * Компонент-обертка для изолирования запросов состояния от рендеринга приложения
 *
 * @param onChange - функция реагирования на инициализацию запроса и получение ошибки
 */
const Health: FC<{ onChange?: (inited: any, isError: any) => any }> = ({ onChange }) => {
    const health = useHealth()

    const isError = health.store.status === 'error'

    useEffect(() => {
        onChange?.(health.initialized, isError)
    }, [health.initialized, isError])

    return health.notificationContext
}

export default function App() {
    const theme = useTheme()

    const location = useLocation()
    const { fullScreen, setFullScreen, setHideMenu } = useLayoutSettingsStore()

    useEffect(() => {
        const parsePathName = location.pathname?.slice(1)?.split('/')?.[0] || ''

        if (parsePathName !== 'infopanels' && !location.pathname.includes('error')) {
            if (fullScreen) {
                setFullScreen(false)
                setHideMenu(false)
            }
        }
    }, [location, fullScreen])

    const [health, setHealth] = useState({ inited: false, isError: false })

    return (
        <>
            <Health onChange={(inited, isError) => setHealth({ inited, isError })} />
            {health.inited && (
                <div className={health.isError && theme?.checkHealthBlocking ? 'blocked' : ''}>
                    <ConfigProvider
                        locale={ruRu}
                        theme={{
                            token: { fontFamily: theme?.font, zIndexPopupBase: zIndex.modalIndex },
                        }} 
                    >
                        <AppRouterNew />
                    </ConfigProvider>
                </div>
            )}
        </>
    )
}