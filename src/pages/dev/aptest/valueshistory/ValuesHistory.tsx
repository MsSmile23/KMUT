/* eslint-disable max-len */
import ValuesHistoryAggregationWidget2 from '@entities/stats/ValuesHistoryAggregationWidget/ValuesHistoryAggregationWidget2'

export const ValuesHistory = () => {

    return (
        <ValuesHistoryAggregationWidget2
            source="class"
            sourceClassId={56}
            targetClassId={58}
            relationIds={[174]}
            attributeId={{ rcv: 292, trn: 290 }}
            regexp={{
                values: '%23((?:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(?:[^.?/]+.|)[^.?/]+.[^.?/]+?))(?:[/?].*|)$%23'
            }} 
            groupBy="day"
            dataSource="checkNetChart"
            chart={{
                name: 'История измерений с агрегированием',
                type: 'percents', 
                view: 'column',
                autoUpdated: false
            }}
            legend={{
                valuesType: 'absolute'
            }}
        />
    )
}