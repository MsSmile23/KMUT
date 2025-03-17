import { getURL } from '@shared/utils/nav'
import { Button } from 'antd'
import { FC, PropsWithChildren, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon404 } from './Icon404'
import { useTheme } from '@shared/hooks/useTheme'
import { generalStore } from '@shared/stores/general';

interface I404 {
    text?: string
    url?: string
}

export const ECPage404: FC<PropsWithChildren<I404>> = ({ 
    text,
    url,
    children
}) => {
    const navigate = useNavigate()
    const theme = useTheme()
    const interfaceMnemo = generalStore(state => state.interfaceView ?? 'showcase')
    const finalUrl = useMemo(() => {
        return (url) ?? getURL('', interfaceMnemo)
    }, [url])


    return (
        <div
            style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 24,
                height: '100%', 
                width: '100%',
            }}
        >
            <Icon404 
                fontColor={theme.layout?.notFoundPage?.color}
                backgroundColor={theme.layout?.notFoundPage?.background}
            />
            <div>{text || 'Данной страницы не существует'}</div>
            {children}
            <Button 
                type="primary"
                style={{
                    backgroundColor: theme.layout?.notFoundPage?.color,
                    color: theme.layout?.notFoundPage?.background,
                }}
                onClick={() => navigate(finalUrl)}
            >
                Вернуться на главную страницу
            </Button>
        </div>
    )
}