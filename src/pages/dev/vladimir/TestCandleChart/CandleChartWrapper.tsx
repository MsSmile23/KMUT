import { selectObject, useObjectsStore } from '@shared/stores/objects'
import { FC, PropsWithChildren } from 'react'

export const CandleChartWrapper: FC<PropsWithChildren<{ objectId?: number}>> = ({ objectId, children }) => {
    const findObj = useObjectsStore(selectObject)
    const currObj = findObj(objectId)
    const title = currObj ? currObj.name : 'chart'

    return (
        <>
            <div
                style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}
            >
                Динамика одиночных инцидентов {title}
            </div>
            {children}
        </>
    )
}