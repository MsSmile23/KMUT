import { Col, Row, Tabs, Tag } from 'antd';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { IObject } from '@shared/types/objects';
import { ILink } from '@shared/types/links';
import { relationsTypes } from '@shared/types/relations';
import { getObjectProps } from '@shared/utils/objects';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { getVtemplate } from '@shared/utils/vtempaltes';
import { useTheme } from '@shared/hooks/useTheme';
import { StateTab } from '@entities/states/StateTab/StateTab';
import { useStateEntitiesStore } from '@shared/stores/state-entities';
import './ObjectCardContainer.css'
import { selectThemeName, useThemeStore } from '@shared/stores/theme';
import { useObjectsStore, selectObjectByIndex } from '@shared/stores/objects'
import { getClassFromClassesStore } from '@shared/utils/common';
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById';

interface IObjectCardContainer {
    id: number | string
    recursive?: boolean
    customTabs?: Array<'arm'>
}

interface IDropdown {
    items: MenuProps['items'],
    name: string | ReactNode
}

const TabLabel: FC<IDropdown> = ({ items, name }) => {
    return (
        <Dropdown
            menu={{ items }}
            trigger={['click']}
            overlayStyle={{ marginTop: '40px' }}
            overlayClassName="custom-dropdown custom-dropdown-item"
        >
            <div>{name}</div>
        </Dropdown>
    )
}

const ObjectCardContainer: FC<IObjectCardContainer> = ({ 
    id, 
    recursive, 
}) => {
    const getByIndex = useObjectsStore(selectObjectByIndex)
    const currentTheme = useThemeStore(selectThemeName)
    
    const [ selectedAggrTabObjectId, setSelectedAggrTabObjectId ] = useState(recursive ? id : 0)
    const [ activeKey, setActiveKey ] = useState('1')

    const stateEntities = useStateEntitiesStore((st) => st.store.data?.objects || [])
    const findStateId = useCallback((obj: Partial<IObject>) => {
        return stateEntities.find((se) => se.entity === obj?.id)?.state
    }, [stateEntities])

    const [object, setObject] = useState(getByIndex('id', Number(id)))

    // const object = useMemo(() => getByIndex('id', Number(id)), [id])

    useEffect(() => {
        const fetchData = async () => {
            if (!object) {
                const resp = await getObjectById(id)

                setObject(resp.data)
            }
        }

        fetchData()
    }, [id])

    const theme = useTheme();
    const { isCustomLayout, component, tabs = [], hideTabs } = useMemo(() => getVtemplate({ 
        type: theme?.vtemplates?.classes,  
        id: object?.class_id,
        page: 'object' 
    }), [object?.class_id, theme?.vtemplates?.classes])

    const ShowCaseComponent: FC<any> = component

    const additionalTabs = useMemo(() => tabs.map((tab: any, i: number) => {
        const ShowCaseComponent: FC<any> = tab.component
        const isActive = activeKey === `${i + 1}`
        const styles = {                
            backgroundColor: isActive
                ? theme.components.tabs?.showcase?.backgroundColorActive
                : 'rgba(255, 255, 255, 1)',
            color: isActive
                ? theme.components?.tabs?.showcase?.color
                : 'rgba(0, 0, 0, 1)'
        }

        return {
            key: `${i + 1}`,
            label: (
                <Tag 
                    onClick={() => setActiveKey(`${i + 1}`)} 
                    id={`${findStateId(object)}`}
                    style={{
                        ...styles,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: theme.components.tabs.showcase.padding,
                        marginLeft: i === 0 ? '10px' : 'auto',
                        boxSizing: 'border-box',
                        boxShadow: theme.components.tabs.showcase.boxShadow,
                        borderRadius: theme.components.tabs.showcase.borderRadius,
                        margin: theme.components.tabs.showcase.margin,
                        border: theme.components.tabs.showcase.border,
                        borderTopLeftRadius: i === 0 ? '8px' : '0',
                        borderTopRightRadius: i === (tabs.length - 1) ? '8px' : '0',                          
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    {tab.name ?? 'Нет названия'}
                </Tag>
            ),
            children:
                    <ShowCaseComponent 
                        object={object} 
                        style={{
                            overflow: 'auto',
                        }}
                    />,
        }
    }), [tabs, activeKey, object, theme])

    const selectedObject = useMemo(() => ({
        key: '1',
        label: (
            object !== undefined ?
                <StateTab onClick={() => setActiveKey('1')} id={findStateId(object)}>
                    {Object.keys(object).length > 0
                        ? getObjectProps(object as IObject)?.name
                        : 'Нет названия'}
                </StateTab>
                : `Объект с id${id} не найден`
        ),
        children: object !== undefined ? <ShowCaseComponent object={object} /> : '',
    }), [object])

    const objectAggLinks = useMemo(() => [
        ...object?.links_where_left ?? [], 
        ...object?.links_where_right ?? []
    ].filter((link) => (
        link?.relation?.relation_type === relationsTypes.aggregation
        && getClassFromClassesStore(link?.relation?.left_class_id)?.package_id == 1
        && link.right_object_id === Number(id)
    )), [object])

    // Выпадающий список левых объектов links для этого relation
    // Если есть несколько линков одного link.relation.id, то объединить их в выпадающий список
    // группируем вкладки по relations
    const aggregationTabs2: [string, ILink[]][] = useMemo(() => {
        return Object.entries(objectAggLinks.reduce((hash, link) => {
            const id = link.relation_id
    
            return { ...hash, [id]: hash[id] ? hash[id].concat(link) : [link] }
        }, {}))
    }, [objectAggLinks])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const relationItems: any[] = aggregationTabs2.map(([ relationId, links ], i) => {
        const object = getByIndex('id', links[0]?.left_object_id)

        const dropdownItems = links.map((link) => ({
            key: `dd-object-${link.id}`,
            label: (
                <StateTab
                    id={findStateId(object)}
                    onClick={() => {
                        setSelectedAggrTabObjectId(0)
                        setTimeout(() => {
                            setSelectedAggrTabObjectId(object.id)
                        }, 1)
                        setActiveKey(`${i + 2}`)
                    }}
                >
                    {getObjectProps(object as IObject)?.name ?? ''}
                </StateTab>
            ),
        }))

        return {
            key: `${i + 2}`,
            label:
                links.length < 2 ? (
                    <StateTab id={findStateId(object)} onClick={() => setActiveKey(`${i + 2}`)}>
                        {getObjectProps(object as IObject)?.name}
                    </StateTab>
                ) : (
                    <TabLabel
                        items={dropdownItems}
                        name={
                            <StateTab id={findStateId(object)}>
                                {getClassFromClassesStore(links[1].relation?.left_class_id)?.name}
                            </StateTab>
                        }
                    />
                ),
            children:
                links.length > 1 ? (
                    selectedAggrTabObjectId ? (
                        <ObjectCardContainer id={selectedAggrTabObjectId} recursive />
                    ) : (
                        'Не выбран объект'
                    )
                ) : object?.id ? (
                    <ObjectCardContainer id={object.id} recursive />
                ) : (
                    'Не выбран объект'
                ),
        }
    })

    let items = isCustomLayout ? [...additionalTabs] : [selectedObject, ...relationItems] 

    // Скрыть вкладки на макете услуг
    if (hideTabs) {
        items = [{
            key: '1',
            label: '',
            children: (
                <ShowCaseComponent 
                    object={object} 
                    style={{ overflow: 'auto' }}
                />)
        }]
    }

    return (
        <Row className="ObjectCardContainer" gutter={[20, 20]} style={{ marginBottom: '-12px' }}>
            <Col xs={24}>
                <Tabs
                    defaultActiveKey="1"
                    activeKey={activeKey}
                    tabBarGutter={isCustomLayout ? 0 : 10}
                    items={items}
                    onChange={() => {
                        setSelectedAggrTabObjectId(0)
                    }}
                    className={`
                        ${isCustomLayout ? 'tabs-align-right' : ''} 
                        ${currentTheme}-no-underline ${currentTheme}-header-no-border
                        ${currentTheme}-ant-tabs-nav-list
                        ${hideTabs ? 'hideTabs' : ''}
                    `}
                />
            </Col>
        </Row>
    )
}

export default ObjectCardContainer