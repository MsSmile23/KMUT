import { getURL } from '@shared/utils/nav'
import { Button } from 'antd'
import { FC, PropsWithChildren, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon422 } from './Icon422'
import { useTheme } from '@shared/hooks/useTheme'
import { generalStore } from '@shared/stores/general';

interface I422 {
    text?: string
    url?: string
}

export const ECPage422: FC<PropsWithChildren<I422>> = ({ 
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
            <Icon422 
                fontColor={theme.layout?.notFoundPage?.color}
                backgroundColor={theme.layout?.notFoundPage?.background}
            />
            <div>{text || 'Недостаточно прав'}</div>
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