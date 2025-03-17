import { FC, PropsWithChildren } from 'react'
import { Icon418 } from './Icon418'

interface I404 {
    text?: string
    url?: string
}

export const ECPage418: FC<PropsWithChildren<I404>> = ({ text, url, children }) => {
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
            <Icon418 />
            <div>
                {text ||
                    // eslint-disable-next-line max-len
                    'Работа приложения приостановлена. Срок действия лицензии истек. Обратитесь к администратору системы.'}
            </div>
            {children}
        </div>
    )
}