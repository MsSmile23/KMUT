import { TestFormVtemplate } from '../TestFormVtemplate'
import { Col } from 'antd'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { useNavigate } from 'react-router-dom'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
// import { NewPie } from './Pie/NewPie'
import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { TestNegativeIncidentsCount } from './TestNegativeIncidentsCount'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import MultipleChartContainer from '@entities/attributes/MultipleChartContainer/MultipleChartContainer'
import { CenterAnalysisMetrics } from '@containers/widgets/WidgetCenterAnalysisMetrics/CenterAnalysisMetrics'
import { TestEventLoopInReact } from './TestEventLoopInReact/TestEventLoopInReact'
// import { TreeTemplate } from './TreeTemplate'
import { LocaleDatePicker } from './LocaleDatePicker'
import { useObjectAttributesStore } from '@shared/stores/objectAttributes/useObjectAttributesStore'
// import { OuterForm } from './TestFormInsideForm/TestFormInsideForm'
// import { OAForm } from '@containers/widgets/WidgetMeasuredAttributes/ObjectAttributesForm/OAForm'
// import { IObjectAttributesForm } from '@containers/widgets/WidgetMeasuredAttributes/newTypes'

export const VladimirTest = () => {
    const getByIndex = useObjectsStore(selectObjectByIndex) 
    const isExternalObjectAttributes = useObjectsStore(st => st.isExternalObjectAttributes) 
    const setOASource = useObjectsStore(st => st.setOASource) 
    const oas = useObjectAttributesStore(st => st.index.object_id)
    const currentOas = useObjectAttributesStore(st => st.getByIndex)('object_id', 10046)
    console.log('isExternalObjectAttributes', isExternalObjectAttributes)
    // console.log('currentOas', 10046, currentOas)
    // console.log('oas', oas)
    // console.log('length', Object.keys(oas).length)
    const object1 = getByIndex('id', 10046)
    console.log('object', 10046, object1)
    const object2 = getByIndex('id', 456454)
    console.log('object', 456454, object2)
    /* const object = getByIndex('id', 10178)
    const navigate = useNavigate()
    const newObject = getByIndex('id', 12301)
    
    const chartProps = {
        ...forumThemeConfig.main.statuses.chart,
        legendSettings: {
            ...forumThemeConfig.main.statuses.chart.legendSettings,
            chart: {
                ...forumThemeConfig.main.statuses.chart.legendSettings.chart,
                height: 500
            }
        }
    } */
    /* console.log('index', useStateEntitiesStore().index)
    const getSEByIndex = useStateEntitiesStore(st => st.getByIndex)
    console.log('state attrs 10001', getSEByIndex({
        indexMnemo: 'stateId',
        group: 'object_attributes',
        key: 10001
    }))
    console.log('state obj 10114', getSEByIndex({
        indexMnemo: 'stateId',
        group: 'objects',
        key: 10114
    }))
    console.log('object 10001', getSEByIndex({
        indexMnemo: 'id',
        group: 'objects',
        key: 10001
    })) */
    // const mts = getByIndex('id', 32970)
    // const children = findChildObjectsWithPaths({
    //     // childClassIds: [10320],
    //     childClassIds: [],
    //     currentObj: mts,
    //     targetClassIds: [10320],
    //     // targetClassIds: [],
    //     // allLevels: true
    // })
    // console.log('children', children.objectsWithPath.sort((a,b) => a.name.localeCompare(b.name)))

    // const formSet: IObjectAttributesForm[] = [{
    //     id: 'own',
    //     collapsed: false,
    //     enabled: true,
    //     formProps: {
    //         formFields: [{
    //             fieldId: 'own0',
    //             objectId: null,
    //             attributeIds: [],
    //             additionalName: '',
    //             classId: null,
    //             linkedClassIds: [],
    //             targetClassIds: [],
    //         }],
    //         isSingle: false,
    //         set: ['object', 'attribute']
    //     },
    //     label: 'own',
    // }, {
    //     id: 'linked',
    //     collapsed: false,
    //     enabled: true,
    //     formProps: {
    //         formFields: [{
    //             fieldId: 'linked0',
    //             objectId: null,
    //             attributeIds: [],
    //             additionalName: '',
    //             classId: null,
    //             linkedClassIds: [],
    //             targetClassIds: [],
    //         }],
    //         isSingle: false,
    //         set: ['object', 'attribute']
    //     },
    //     label: 'linked',
    // }, {
    //     id: 'other',
    //     collapsed: false,
    //     enabled: true,
    //     formProps: {
    //         formFields: [{
    //             fieldId: 'other0',
    //             objectId: null,
    //             attributeIds: [],
    //             additionalName: '',
    //             classId: null,
    //             linkedClassIds: [],
    //             targetClassIds: [],
    //         }],
    //         isSingle: false,
    //         set: ['object', 'attribute']
    //     },
    //     label: 'other',
    // }]

    return (
        <div 
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                overflowY: 'auto',
                minHeight: '100%',
                padding: '24px', 
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
                background: '#ebfcfb'
            }}
        >
            <button
                onClick={() => {
                    setOASource(isExternalObjectAttributes ? 'backend' : 'oaStore')
                }}
            >
                Source is [{isExternalObjectAttributes ? 'oaStore' : 'backend'}]
            </button>
            {/* <LocaleDatePicker /> */}
            {/* <OuterForm /> */}
            {/* <CenterAnalysisMetrics 
                vtemplateSettings={{
                    classId: 10320,
                    objectId: 10010,
                    vtemplateId: 1
                }}
            /> */}
           {/* <TestEventLoopInReact /> */}
           {/* <TreeTemplate /> */}
            {/* Incidents */}
            {/* <TestNegativeIncidentsCount /> */}
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Компонент линейных графиков измерений */}
            {/* <ObjectOAttrsWithHistory 
                object={getByIndex('id', 10013)}
                attributeIds={[10166]}
                asWidget={false}
            /> */}
            
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* <TestFormVtemplate 
                // mnemo="object.ObjectSummary"
                // mnemo="object.ObjectLinkedShares"
                // mnemo="object.ObjectsInOutHistory"
                mnemo="object.ObjectOAttrsWithAggregationTable"
                // object_id={10227}
                object_id={10018}
                // object_id={11081} // форум
                height="100%"
            /> */}
            
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Центр анализа метрик" */}
            {/* <div
                style={{
                    width: '100%'
                }}
            >
                <TestFormVtemplate 
                    mnemo="CenterAnalysisMetrics"
                    object_id={10001}
                    height="800px"
                />
            </div> */}

            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Доли дочерних объектов" и отдельно компонент пайчартов */}
            {/* <div style={{ display: 'flex' }}>
                <Col span={24}>
                    <TestFormVtemplate 
                        mnemo="object.ObjectLinkedShares"
                        object_id={10006}
                        height="600px"
                    />
                </Col>
                <Col span={12} style={{ height: 500 }}>
                    <ObjectLinkedShares  
                        {...chartProps}
                        parentObject={getByIndex('id', 10006)}
                    />
                </Col>
            </div> */}

            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Доли дочерних объектов" и виджет "Информация и статусы объекта" */}
            {/* <div style={{ display: 'flex' }}>
                <Col span={24}>
                    <TestFormVtemplate 
                        mnemo="object.ObjectLinkedShares"
                        // object_id={10293}
                        height="1000px"
                    />
                </Col>
                <Col span={24} style={{ height: 1000 }}>
                    <TestFormVtemplate 
                        mnemo="object.ObjectSummary"
                        object_id={10293}
                        height="600px"
                    />
                </Col>
            </div> */}

            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Доли дочерних объектов" */}
            {/* <TestFormVtemplate 
                mnemo="object.ObjectLinkedShares"
                // object_id={10006}
                height="600px"
            /> */}
            {/* <OuterForm /> */}
            {/* <OAForm formSet={formSet[0]} /> */}
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Измеряемые атрибуты тестовый"
            <TestFormVtemplate 
                mnemo="object.MeasuredAttributes"
                // object_id={11538} // ИБП
                object_id={12355} // коммутатор Л3
                // object_id={32970}
                // object_id={32993}
                height="100%"
            /> */}

            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Измеряемые атрибуты" */}
            {/* <TestFormVtemplate 
                mnemo="object.ObjectOAttrsWithHistory"
                // object_id={11538} // ИБП
                object_id={12355} // коммутатор Л3
                // object_id={32970}
                // object_id={32993}
                height="100%"
            /> */}
            
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Дерево объектов" */}
            {/* <TestFormVtemplate 
                mnemo="object.ObjectTree"
                height="100%"
            /> */}
            
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Мультиграфик" */}
            {/* <TestFormVtemplate 
                mnemo="multipleChart"
                object_id={10001}
                // object_id={32970}
                // object_id={32993}
                height="100%"
            /> */}
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Атрибуты истории с агрегацией" */}
            {/* <TestFormVtemplate 
                mnemo="object.ObjectOAttrStateWithAggregation"
                object_id={10018}
                height="100%"
            /> */}

            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "Информация и статусы объекта" */}
            {/* <TestFormVtemplate 
                mnemo="object.ObjectSummary"
                object_id={10001}
                height="400px"
            /> */}
           
            {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
            {/* Виджет "История статусов" */}
            {/* <TestFormVtemplate 
                mnemo="object.WidgetObjectStateHistory"
                object_id={10001}
                height="400px"
            /> */}
           
            {/* <NewPie /> */}

        </div>
    )
}
