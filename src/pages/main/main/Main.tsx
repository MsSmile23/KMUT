import { FC } from 'react'
import { ConstructorMain } from './ConstructorMain/ConstructorMain'
import { generalStore } from '@shared/stores/general'
import { ManagerMain } from './ManagerMain/ManagerMain'
import { ShowcaseMain } from './ShowcaseMain/ShowcaseMain'

export const Main: FC = () => {
    const [interfaceView] = generalStore((state) => [state.interfaceView])

    switch (interfaceView) {
        case 'constructor':
            return (
                <ConstructorMain />
            )
        case 'manager':
            return (
                <ManagerMain />
            )
        case 'showcase':
            return (
                <ShowcaseMain />
            )
    }
}