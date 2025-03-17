import { 
    AggregationMeasurementsResultsWidget 
} from '@entities/stats/AggregationMeasurementsResults/AggregationMeasurementsResultsWidget'

export const Aggregation = () => {
    return (
        <>
            <AggregationMeasurementsResultsWidget
                dataSource="getProcessTop"
                source="none"
                attributeId={253}
                targetObjectId={43}
            />
            ---
            <AggregationMeasurementsResultsWidget
                dataSource="getUserActivityTop"
                source="object"
                sourceObjectId={56}
                targetClassId={43}
                relationIds={[174, 161]}
                attributeId={253}
                targetObjectId={43}
            />
            ---
            <AggregationMeasurementsResultsWidget
                dataSource="getUserActivityTop"
                source="class"
                sourceClassId={56}
                sourceObjectId={56}
                targetClassId={43}
                relationIds={[174, 161]}
                attributeId={253}
                targetObjectId={43}
            />
        </>
    )
}