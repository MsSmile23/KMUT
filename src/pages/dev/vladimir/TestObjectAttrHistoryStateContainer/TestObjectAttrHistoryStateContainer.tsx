import { ObjectOAttrStateWithAggregation } from '@containers/object-attributes/ObjectOAttrStateWithAggregation/ObjectOAttrStateWithAggregation'
import { useObjectsStore, selectObject } from '@shared/stores/objects'
import * as Icons from '@ant-design/icons/lib/icons/'
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ObjectOAttrsWithAggregationTable } from '@containers/object-attributes/ObjectOAttrsWithAggregationTable/ObjectOAttrsWithAggregationTable'

export const TestObjectAttrHistoryStateContainer = () => {
    const getObj = useObjectsStore(selectObject)
    const server = getObj(10221)
    const objAttrs = server.object_attributes

    const icons = Object.keys(Icons) as IECIconView['icon'][]

    // console.log('Icons', Icons)
    // const icon = typeof IInputIcon['icon']

    return (
        <>
            <ObjectOAttrsWithAggregationTable 
                objectId={server.id}
                aggregations={['current', 'max', 'min', 'average']}
                viewType="table"
            />
            {/* {objAttrs
                .filter(oa => oa.attribute.history_to_db)
                .map(oa => {
                    const iconIdx = Math.floor(Math.random() * (icons.length - 0) + 0)

                    return (
                        <ObjectOAttrStateWithAggregation 
                            key={oa.id}
                            objectAttribute={oa}
                            icon={icons[iconIdx]}
                            value={{
                                enabled: true,
                                aggregation: 'max',
                                period: 48 * 60 * 60
                            }}
                        />
                    )
                })} */}
        </>
    )
}