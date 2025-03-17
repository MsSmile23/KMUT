import { MLErrorBoundary } from '@shared/ui/MLErrorBoundary'
import { FC, PropsWithChildren } from 'react'

// Обёртка для выстраивания каких-либо айтемов в ряд

export const ItemsGrid: FC<PropsWithChildren<{
    styles?: React.CSSProperties
    gap: string
    itemsInRow: number
}>> = ({ 
    children, 
    styles,
    gap,
    itemsInRow
}) => {
    return (
        <MLErrorBoundary>
            <div
                style={{
                    width: `calc((100% - ${gap} * ${itemsInRow})/ ${itemsInRow})`,
                    ...styles
                }}
            >
                {children}
            </div>
        </MLErrorBoundary>
    )
}