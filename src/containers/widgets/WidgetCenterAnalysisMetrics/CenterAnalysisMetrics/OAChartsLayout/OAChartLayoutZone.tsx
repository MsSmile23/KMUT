import { FC, PropsWithChildren } from 'react'

export const OAChartLayoutZone: FC<PropsWithChildren<{
    gap: number
}>> = ({
    children, gap = 10
}) => {
    return (
        <div
            className="OAChartLayoutZone"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'start',
                alignItems: 'start',
                // flex: 1,
                // overflowY: 'auto',
                gap: gap,
                width: '100%',
                // height: '100%',
            }}
        >
            {children}
        </div>
    )
}