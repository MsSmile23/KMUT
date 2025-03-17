import { FC } from 'react'
import { IMenuItem } from '../utils'
import { Col, Collapse, FormInstance, Row } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import { SortableList } from '@shared/ui/SortableList'
import './MenuItem.scss'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
interface IMenuItemComponent {
    menuItem: IMenuItem
    menuItems: IMenuItem[]
    setParentPseudoId: React.Dispatch<React.SetStateAction<number>>
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    setMenuItems: React.Dispatch<React.SetStateAction<IMenuItem[]>>
    setChosenItemMenuPseudoId: React.Dispatch<React.SetStateAction<number>>
    form: FormInstance<any>
    setChosenMenuItemIdForMoving: React.Dispatch<React.SetStateAction<number>>
    setIsModalMovingVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuItem: FC<IMenuItemComponent> = ({
    menuItem,
    menuItems,
    setParentPseudoId,
    setIsModalVisible,
    setMenuItems,
    setChosenItemMenuPseudoId,
    form,
    setChosenMenuItemIdForMoving,
    setIsModalMovingVisible,
}) => {
    //* Блок управления кнопочками в элементе меню
    const handleAddMenuItem = (pseudoParentId) => {
        setParentPseudoId(pseudoParentId)
        setIsModalVisible(true)
    }
    const handleDeleteMenuItem = (pseudoId: number) => {
        const localMenuItems = [...menuItems]

        const itemsForDelete: number[] = []
        const itemsAfterDeleted: IMenuItem[] = []

        localMenuItems.forEach((item) => {
            if (
                item.pseudoId == pseudoId ||
                item.parentPseudoId == pseudoId ||
                itemsForDelete.includes(item.parentPseudoId)
            ) {
                itemsForDelete.push(item.pseudoId)
            } else {
                itemsAfterDeleted.push(item)
            }
        })

        setMenuItems(itemsAfterDeleted)
    }

    const handleEditMenuItem = (pseudoId: number, menuItem: IMenuItem) => {
        
        form.setFieldsValue({
            menuItemName: menuItem.name,
            menuItemIcon: menuItem.textIcon ? null : menuItem.icon,
            menuItemOn: menuItem.on,
            menuItemPage: menuItem.page,
            menuItemURL: menuItem.url,
            menuItemTarget: menuItem.target,
            menuItemStereoType: menuItem.stereotype,
            menuItemScreen: menuItem.screen,
            menuItemSize: menuItem.size,
            menuItemIconText: menuItem.textIcon
        })
        setChosenItemMenuPseudoId(pseudoId)
        setIsModalVisible(true)
    }

    const handleMovingButton = (pseudoId: number) => {
        setChosenMenuItemIdForMoving(pseudoId)
        setIsModalMovingVisible(true)
    }

    //*Создание компонента лебла
    const labelComponent = (menuItemProp: IMenuItem) => {
        return (
            <Row align="middle" justify="space-between">
                <Col span={12}>
                    {(menuItemProp.icon && !menuItemProp.textIcon) && (
                        <ECIconView style={{ marginRight: '5px' }} icon={menuItemProp.icon as any} />
                    )}
                    {menuItemProp.name}
                </Col>
                <Row gutter={4} justify="space-between">
                    <Col>
                        <Buttons.ButtonAddRow
                            color="green"
                            tooltipText="Добавить подпункт"
                            onClick={() => {
                                handleAddMenuItem(menuItemProp.pseudoId)
                            }}
                        />
                    </Col>
                    <Col>
                        {' '}
                        <Buttons.ButtonEditRow
                            onClick={() => {
                                handleEditMenuItem(menuItemProp.pseudoId, menuItemProp)
                            }}
                        />
                    </Col>
                    <Col>
                        {' '}
                        <Buttons.ButtonMoving
                            text={false}
                            onClick={() => {
                                handleMovingButton(menuItemProp.pseudoId)
                            }}
                        />
                    </Col>
                    <Col>
                        {' '}
                        <Buttons.ButtonDeleteRow
                            onClick={() => {
                                handleDeleteMenuItem(menuItemProp.pseudoId)
                            }}
                        />
                    </Col>
                </Row>
            </Row>
        )
    }

    //*Функция создания элемента меню с рекурсией
    const createMenuItem = (menuItem: IMenuItem) => {

        const childrenMenuItems = menuItems.filter((item) => item.parentPseudoId == menuItem.pseudoId)

        const onChangeChildrenItems = (array?: any) => {
            const items = [...menuItems].filter((item) => item.parentPseudoId !== menuItem.pseudoId)

            setMenuItems([...items, ...array])
        }

        if (childrenMenuItems?.length > 0) {
            return (
                <Collapse
                    className="customStyle"
                    collapsible="icon"
                    style={{ width: '100%' }}
                    items={[
                        {
                            key: '1',
                            label: (
                                labelComponent(menuItem)
                            ),
                            children: (
                                <div style={{ width: '100%', paddingLeft: '15px' }}>
                                    <SortableList
                                        items={childrenMenuItems}
                                        onChange={onChangeChildrenItems}
                                        renderItem={(item) => (
                                            <SortableList.Item
                                                customItemStyle={{ padding: 0, borderRadius: '8px' }}
                                                id={item.id}
                                            >
                                                {createMenuItem(item)}
                                                <SortableList.DragHandle
                                                    customDragHandlerStyle={{
                                                        padding: '15px 10px',
                                                        alignSelf: 'baseline',
                                                        marginTop: '5px',
                                                    }}
                                                />
                                            </SortableList.Item>
                                        )}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        } else {
            return (
                <Collapse
                    className="customStyle withoutChildren"
                    style={{ width: '100%' }}
                    collapsible="disabled"
                    items={[
                        {
                            key: '1',
                            label: (
                                labelComponent(menuItem)
                            ),
                        },
                    ]}
                />
            )
        }
    }

    const OneMenuItem: React.ReactNode = createMenuItem(menuItem)

    return <>{OneMenuItem}</>
}

export default MenuItem