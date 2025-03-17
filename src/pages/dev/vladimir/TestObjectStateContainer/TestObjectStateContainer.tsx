import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectOAttrState } from '@containers/objects/ObjectOAttrState/ObjectOAttrState'
import { selectObject, useObjectsStore } from '@shared/stores/objects'
import { FC, PropsWithChildren } from 'react'

const TestItem: FC<PropsWithChildren<{
    title: string
    style?: React.CSSProperties
}>> = ({ children, title, style }) => {
    return (
        <div 
            style={{ 
                padding: 10,
                textAlign: 'center', 
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                borderRadius: 10,
                ...style, 
            }}
        >
            <h5>{title}</h5>
            {children}
        </div>
    )
}

export const TestObjectStateContainer: FC = () => {
    const getObj = useObjectsStore(selectObject)
    const obj = getObj(10178)
    const labelObj = getObj(10212)
    
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                gap: 10,
                width: '100%',
            }}
        >
            <TestItem title="Label">
                <ObjectOAttrState object={labelObj} representationType="label">
                    Услуга
                </ObjectOAttrState>
            </TestItem>
            <TestItem title="Horizontal tags" style={{ width: '400px' }}>
                <ObjectOAttrState 
                    object={obj} 
                    representationType="horizontalTags" 
                    oslProps={{ 
                        object_id: obj.id,
                        classes_id: forumThemeConfig.build.deviceStatuses.stateLabels.classes_id,
                        childClsIds: [], 
                        labelWidth: '100px',
                    }}

                />
            </TestItem>
            <TestItem title="Vertical tags" style={{ width: '300px' }} >
                <ObjectOAttrState 
                    object={obj} 
                    representationType="verticalTags" 
                    oslProps={{ 
                        object_id: obj.id,
                        classes_id: forumThemeConfig.build.deviceStatuses.stateLabels.classes_id,
                        childClsIds: [], 
                        labelWidth: '200px',
                    }}
                />
            </TestItem>
            <TestItem title="Pie chart" style={{ width: '300px' }}>
                <ObjectOAttrState 
                    object={obj} 
                    representationType="pieChart" 
                    statusChartProps={forumThemeConfig.build.deviceStatuses.chart}
                />
            </TestItem>
            
        </div>
    )
}