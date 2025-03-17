import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { FC, PropsWithChildren } from 'react'

export const IsBuildTree: FC<PropsWithChildren<{ isBuild: boolean }>> = ({ children, isBuild }) => {
    if (!isBuild) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    gap: 16,
                }}
            >
                <span>Построение дерева объектов</span>
                <CustomPreloader size="small" />
            </div>
        )
    }

    return children
}