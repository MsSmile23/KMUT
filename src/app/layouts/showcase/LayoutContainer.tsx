import { generalStore } from '@shared/stores/general'
import { CustomLayout } from './CustomLayout'
import { DefaultLayout } from './DefaultLayout'
import { FC, PropsWithChildren } from 'react'

export const LayoutContainer: FC<PropsWithChildren> = ({ children }) => {    
    const [layout] = generalStore((state) => [state.layout])

    switch (layout) {
        case 'custom':
            return (
                <CustomLayout>
                    {children}
                </CustomLayout>
            )
        case 'default':
            return (
                <DefaultLayout>
                    {children}
                </DefaultLayout>
            )
    }
}