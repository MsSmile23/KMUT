import { Col, Row, Tabs, Tag } from 'antd';
import { FC, ReactNode, useState } from 'react'
import { getLinks } from '@shared/api/Links/Models/getLinks/getLinks';
import { IObject } from '@shared/types/objects';
import { useApi2 } from '@shared/hooks/useApi2';
import { ILink } from '@shared/types/links';
import { relationsTypes } from '@shared/types/relations';
import { LoadingRows, LoadingTab } from '@shared/ui/loadings';
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById';
import { getObjectProps } from '@shared/utils/objects';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { getVtemplate } from '@shared/utils/vtempaltes';
import { useTheme } from '@shared/hooks/useTheme';
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects';
import ObjectRacksContainer from '@containers/objects/ObjectRacksContainer/ObjectRacksContainer';
import { StateTab } from '@entities/states/StateTab/StateTab';
import { useStateEntitiesStore } from '@shared/stores/state-entities';
import './ObjectCardContainer.css'
import { selectThemeName, useThemeStore } from '@shared/stores/theme';
import { getClassFromClassesStore } from '@shared/utils/common';

interface IObjectCardContainer {
    id: number | string
    recursive?: boolean
    customTabs?: Array<'arm'>
    objectTypeKey?: 'torm' | 'inspection'
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
            overlayStyle={{ marginTop: 30 }}
        >
            <div>{name}</div>
        </Dropdown>
    )
}

const ObjectCardContainer: FC<IObjectCardContainer> = ({ 
    id, 
    recursive, 
    objectTypeKey 
}) => {
    const [ selectedAggrTabObjectId, setSelectedAggrTabObjectId ] = useState(recursive ? id : 0)
    const [ activeKey, setActiveKey ] = useState('1')
    const links = useApi2<ILink[]>(() => getLinks({ all: true }))
    const objects = useApi2<IObject[]>(() => getObjects({ all: true }))
    const object = useApi2<IObject>(() => getObjectById(id), { state: { links_where_left: [] } })

    const stateEntities = useStateEntitiesStore((st) => st.store.data?.objects || [])
    const findStateId = (obj: Partial<IObject>) => stateEntities.find((se) => se.entity === obj?.id)?.state

    const objectLinks = [...object?.data?.links_where_left  ?? [], ...object?.data?.links_where_right  ?? []]
    const objectAggLinks = objectLinks.filter((link) => {
        // Links (берём из object.link_where_left),
        // у которых link.relation.relation_type aggregation и link.left_class.package_id 1
        return (
            link?.relation?.relation_type === relationsTypes.aggregation
            && getClassFromClassesStore(link?.relation?.left_class_id)?.package_id == 1
            && link.right_object_id === Number(id)
        )
    })


    const fullTheme = useTheme();
    const theme = useTheme()?.vtemplates?.classes
    const { isCustomLayout, component, tabs } = getVtemplate({ 
        type: theme,  
        id: objects.data.find(obj => obj.id == id)?.class_id,
        page: 'object' 
    })
    
    const currentTheme = useThemeStore(selectThemeName)
    const ShowCaseComponent: FC<any> = component

    const additionalTabs = tabs && tabs?.length > 0 
        ? tabs?.map((tab, i: number) => {
            const ShowCaseComponent: FC<any> = tab.component

            const activeStateStyle: React.CSSProperties = activeKey === `${i + 1}`
                ? {                
                    backgroundColor: fullTheme.components.tabs.showcase.backgroundColorActive,
                    // 'rgba(38, 173, 228, 1)',
                    color: fullTheme.components.tabs.showcase.color,
                    // 'rgba(255, 255, 255, 1)',
                } : {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    color: 'rgba(0, 0, 0, 1)',
                }
            
            return {
                key: `${i + 1}`,
                label: (
                    <Tag 
                        onClick={() => setActiveKey(`${i + 1}`)} 
                        id={String(findStateId(object.data))}
                        style={{
                            ...activeStateStyle,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: fullTheme.components.tabs.showcase.padding,
                            // '6px 11px',
                            marginLeft: i === 0 ? '10px' : 'auto',
                            boxSizing: 'border-box',
                            boxShadow: fullTheme.components.tabs.showcase.boxShadow,
                            // '0px 0px 8px 0px rgba(0, 0, 0, 0.4)',
                            borderRadius: fullTheme.components.tabs.showcase.borderRadius,
                            // '16px',
                            margin: fullTheme.components.tabs.showcase.margin,
                            border: fullTheme.components.tabs.showcase.border,
                            borderTopLeftRadius: i === 0 ? '8px' : '0',
                            borderTopRightRadius: i === (tabs.length - 1) ? '8px' : '0',                          
                            fontSize: '16px',
                            cursor: 'pointer' 
                        }}
                    >
                        {tab.name ?? 'Нет названия'}
                    </Tag>
                ),
                children:
                    <ShowCaseComponent 
                        object={objects.data.find(obj => obj.id == id)} 
                        style={{
                            overflow: 'auto',
                        }}
                    />,
            }
        })
        : []

    const selectedObject = {
        key: '1',
        label: (
            <StateTab onClick={() => setActiveKey('1')} id={findStateId(object.data)}>
                {Object.keys(object.data).length > 0
                    ? getObjectProps(object.data as IObject)?.name
                    : 'Нет названия'}
            </StateTab>
        ),
        children:
            <ShowCaseComponent object={objects.data.find(obj => obj.id == id)} />,
    }

    // Выпадающий список левых объектов links для этого relation
    // Если есть несколько линков одного link.relation.id, то объединить их в выпадающий список
    // группируем вкладки по relations
    const aggregationTabs2: [string, ILink[]][] = Object.entries(objectAggLinks.reduce((hash, link) => {
        if (hash[link.relation_id]) {
            return { ...hash, [link.relation_id]: hash[link.relation_id].concat(link) }
        } else {
            return { ...hash, [link.relation_id]: [link] }
        }
    }, {}))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const relationItems: any[] = aggregationTabs2.map(([ relationId, links ], i) => {
        const dropdownItems = links.map((link) => {
            const object = objects.data.find((obj) => obj.id === link.left_object_id)


            return {
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
                        {getObjectProps(object as IObject)?.name  ?? ''}
                    </StateTab>
                ),
            }
        })
        const object = objects.data.find((obj) => obj.id === links[0]?.left_object_id)
        
        return {
            key: `${i + 2}`,
            label: links.length < 2
                ? (
                    <StateTab id={findStateId(object)} onClick={() => setActiveKey(`${i + 2}`)}>
                        {getObjectProps(object as IObject)?.name }
                    </StateTab>
                )
                : (
                    <TabLabel
                        items={dropdownItems}
                        name={<StateTab id={findStateId(object)}>{getClassFromClassesStore(links[1].relation.left_class_id)?.name}</StateTab>}
                    />
                ),
            children: links.length > 1
                ? (selectedAggrTabObjectId
                    ? (
                        <ObjectCardContainer 
                            id={selectedAggrTabObjectId} 
                            recursive
                        />
                    )
                    : 'Не выбран объект')
                : (object?.id ? (
                    <ObjectCardContainer id={object.id} recursive />
                ) : 'Не выбран объект')
        }
    })

    let items = [selectedObject]
    let extraItems = relationItems

    //Для инспекций(фнс) хардкодим отключение вкладок и стойки
    if (objectTypeKey === 'inspection') {
        items.push({
            key: 'ObjectRacksContainer',
            label: <div onClick={() => setActiveKey('ObjectRacksContainer')}>Стойки</div>,
            children: <ObjectRacksContainer object={object.data as IObject} />
        })
        extraItems = []
    }

    //Для ТОРМ (фнс) хардкодим отключение вкладок
    if (objectTypeKey === 'torm') {
        extraItems = []
    }

    items = isCustomLayout ? [...additionalTabs] : [...items, ...extraItems] 

    return (
        <Row className="ObjectCardContainer" gutter={[20, 20]} style={{ marginBottom: '-12px' }}>
            <Col xs={24} /* style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} */>
                <Tabs
                    defaultActiveKey="1"
                    activeKey={activeKey}
                    tabBarGutter={isCustomLayout ? 0 : 10}
                    items={
                        links.loading || objects.loading 
                            ? [{
                                key: 'loading',
                                label: <LoadingTab />,
                                children: <LoadingRows />
                            }] 
                            : items
                    }
                    onChange={() => {
                        setSelectedAggrTabObjectId(0)
                    }}
                    className={`${isCustomLayout ? 'tabs-align-right' : ''} 
                    ${currentTheme}-no-underline ${currentTheme}-header-no-border
                    ${currentTheme}-ant-tabs-nav-list`}
                />
            </Col>
        </Row>
    )

}

export default ObjectCardContainer