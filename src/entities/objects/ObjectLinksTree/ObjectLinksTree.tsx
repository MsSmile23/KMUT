import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { FC, useEffect, useState } from 'react'
import { Row, Space, Tree } from 'antd'
import { ArrowDownOutlined, FolderOutlined, SwapOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import { useNavigate } from 'react-router-dom'
import { getURL } from '@shared/utils/nav'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'

const { Text } = Typography

interface DataNode {
    title: string | JSX.Element
    key: string
    isLeaf?: boolean
    children?: DataNode[]
    parent?: any
    icon?: JSX.Element
    links?: any
}

interface IObjectLinksTree {
    objectId: number
    cancelTreeModalHandler?: () => void
}

const ObjectLinksTree: FC<IObjectLinksTree> = ({ objectId, cancelTreeModalHandler }) => {
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const object = getObjectByIndex('id', objectId)
    const navigate = useNavigate()
    const [treeKeys, seTreeKeys] = useState<number[]>([])
    const [treeData, setTreeData] = useState<DataNode[]>([])

    //*Функция обновления дерева
    const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
        list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                }
            }

            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                }
            }

            return node
        })

    //*Функция загрузки данных при клике на элемент дерева
    const onLoadData = ({ key, children, parent, links }: any) =>
        new Promise<void>((resolve) => {
            if (children) {
                resolve()
                
                return
            }
            setTimeout(() => {
                if (key.includes('obj_')) {
                    const localObject = getObjectByIndex('id', Number(key.split('_')[1]))

                    setTreeData((origin) => updateTreeData(origin, key, createLinksData(localObject)))
                } else {
                    setTreeData((origin) => updateTreeData(origin, key, createRelationChilds(links, parent)))
                }

                resolve()
            }, 1000)
        })

    //*Функция создания элемента дерева(объект)
    const createObjectItem = (object) => {
        const icon = <ECIconView icon={object?.class?.icon ?? 'CopyOutlined'} />
        const treeObj = {
            title: (
                <Text
                    onClick={() => {
                        cancelTreeModalHandler()
                        navigate(
                            getURL(
                                // eslint-disable-next-line max-len
                                `${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${object.id}?class_id=${object.class_id}`,
                                'manager'
                            )
                        )
                    }}
                >
                    {object.name} [{object.id}]
                </Text>
            ),
            key: `obj_${object.id}`,
            icon: icon,
        }

        return treeObj
    }

    //*Функция создания relations полей для объекта
    const createRelationChilds = (links, parent) => {
        const children: DataNode[] = []

        links.forEach((link) => {
            const localObject =
                parent.id == link.left_object_id
                    ? getObjectByIndex('id', link.right_object_id)
                    : getObjectByIndex('id', link.left_object_id)

            if (treeKeys.includes(localObject.id) == false) {
                children.push(createObjectItem(localObject))
            }
        })

        return children
    }

    //*Функция создания элемента дерева (связь)
    const createLinksTreeItem = (links, keys, direction, object) => {
        const relIds: number[] = []
        const children: DataNode[] = []

        links.forEach((childLink) => {
            if (relIds.includes(childLink.relation_id) == false && keys.includes(childLink.id) == false) {
                keys.push(childLink.id)
                relIds.push(childLink.relation_id)
                const relName = childLink?.relation?.name
                const relationItem = {
                    title: (
                        <Row
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '2px',
                                borderRadius: '5px',
                            }}
                        >
                            <div>
                                <FolderOutlined style={{ fontSize: '25px', marginRight: '5px' }} />

                                {direction == 'down' ? (
                                    <ArrowDownOutlined style={{ position: 'absolute', left: '11px', top: '9px' }} />
                                ) : (
                                    <SwapOutlined style={{ position: 'absolute', left: '11px', top: '9px' }} />
                                )}
                            </div>
                            {relName} [{childLink.id}]
                            <Space style={{ marginLeft: '5px' }}>
                                <Space.Compact>
                                    <Buttons.ButtonAdd color="green" shape="default" text={false} size="small" />
                                    <Buttons.ButtonLink shape="default" />
                                </Space.Compact>
                            </Space>
                        </Row>
                    ),
                    key: `rel_${childLink.id}`,
                    parent: object,
                    links: links.filter((chl) => chl.relation_id == childLink?.relation_id) ?? [],
                }

                children.push(relationItem)
            }
        })

        return children
    }

    //* Функция получения связей по объекту и создания на их основе пунктов дерева
    const createLinksData = (object: IObject) => {
        const leftHorizontalLinks = object.links_where_left.filter(
            (item) => item.relation.relation_type == 'association'
        )
        const rightHorizontalLinks = object.links_where_right.filter(
            (item) => item.relation.relation_type == 'association'
        )
        const childrenLinks = object.links_where_right.filter((item) => item.relation.relation_type !== 'association')

        const horizontalLinks = [...leftHorizontalLinks, ...rightHorizontalLinks]

        const keys = [...treeKeys]

        const children: DataNode[] = [
            ...createLinksTreeItem(horizontalLinks, keys, 'horizontal', object),
            ...createLinksTreeItem(childrenLinks, keys, 'down', object),
        ]

        seTreeKeys(keys)

        return children
    }

    //*Создаем дерево из полученного id Объекта
    useEffect(() => {
        setTreeData([createObjectItem(object)])
        seTreeKeys([object.id])
    }, [objectId])

    return <Tree loadData={onLoadData} showIcon showLine treeData={treeData} />
}

export default ObjectLinksTree