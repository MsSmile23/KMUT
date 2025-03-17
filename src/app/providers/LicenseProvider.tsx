
import { generalStore } from '@shared/stores/general'
import { FC, PropsWithChildren } from 'react'

export const LicenseProvider: FC<PropsWithChildren> = ({ children }) => {
    const [licenseIsActive, ] = generalStore((state) => [
        state.licenseIsActive, 
    ])


    if (!licenseIsActive) {
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                <p>У вас закончилась лицензия</p>
            </div>
        )
    }

    return (
        <div>
            {children}
        </div>
    )
}