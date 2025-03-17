import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { FC } from 'react'

export const TestStatusWrapper: FC = () => {
    return (
        <>
            <ObjectLinkedShares 
                representationType="pieChart"
                filters={[
                    {
                        type: 'class', 
                        values: [1, 5, 47, 59, 66]
                    },
                    {
                        type: 'status', 
                        values: [1, 2]
                    }
                ]}
                groupingType="class"
                countInRow={2}
            />
            <ObjectLinkedShares 
                representationType="pieChart"
                filters={[
                    {
                        type: 'class', 
                        values: [5, 7, 12]
                    },
                ]}
                groupingType="class"
            />
            <ObjectLinkedShares 
                representationType="pieChart"
                filters={[
                    {
                        type: 'status', 
                        values: [2, 3]
                    },
                ]}
            />
            <ObjectLinkedShares 
                representationType="pieChart"

            />
            {/* <AttributeHistoryChartContainer
                ids={attributeIds}
            /> */}
        </>
    )
}