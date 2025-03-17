import { SortableList } from '@shared/ui/SortableList'
import { Buttons } from '@shared/ui/buttons'
import { Forms } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, Form, FormInstance, message, Modal, Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import { IMenuItem, IPage, stereotypeOptions } from '../utils'
import MenuItem from '../MenuItem/MenuItem'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { TPage } from '@shared/types/common'

interface IMenuConstructor {
    form: FormInstance<any>
    value?: IMenuItem[]
    onChange?: any
}
const MenuConstructor: FC<IMenuConstructor> = ({ form, value, onChange }) => {
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([])

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [chosenMenuItemPseudoId, setChosenItemMenuPseudoId] = useState<number | null>(null)
    const [parentPseudoId, setParentPseudoId] = useState<number | null>(null)
    const [pseudoId, setPseudoId] = useState<number>(0)
    const [isModalMovingVisible, setIsModalMovingVisible] = useState<boolean>(false)
    const [chosenMenuItemIdForMoving, setChosenMenuItemIdForMoving] = useState<number | null>(null)
    const [pages, setPages] = useState<TPage[]>([])
    const [screens, setScreens] = useState<any[]>([])
    const [isDisabledURLInput, setIsDisabledURLInput] = useState<boolean>(false)

    //*Принудительное очищение формы в модалке
    const clearForm = () => {
        form.setFieldsValue({
            menuItemName: '',
            menuItemIcon: null,
            menuItemOn: false,
            menuItemPage: null,
            menuItemURL: null,
            menuItemTarget: false,
            menuItemStereoType: null,
            menuItemScreen: null, 
            menuItemSize: null
        })
    }

    //*Обработчики закрытия/открытия модалок

    const handleCancelModal = () => {
        setIsModalVisible(false)
        setChosenItemMenuPseudoId(null)
        setIsDisabledURLInput(false)
        clearForm()
    }

    const handleCancelMovingModal = () => {
        setIsModalMovingVisible(false)
        setChosenMenuItemIdForMoving(null)
        form.setFieldsValue({
            movingMenuItem: null,
        })
    }

    const handleMovingItemButton = () => {
        const localMenuItems = [...menuItems]

        localMenuItems.forEach((item) => {
            if (item.pseudoId == chosenMenuItemIdForMoving) {
                item.parentPseudoId = form.getFieldValue('movingMenuItem')
            }
        })
        setMenuItems(localMenuItems)
        form.setFieldsValue({
            movingMenuItem: null,
        })
        setIsModalMovingVisible(false)
    }

    const onChangePageSelectHandler = (id: string, data) => {
        if (id) {
            setIsDisabledURLInput(true)
            const selectedPage = data.find((page) => page.id === id)
            const pageURL: string = selectedPage?.url
            // const label = selectedPage?.fullScreen ? `${selectedPage?.name} (полный экран)` : selectedPage?.name

            form.setFieldsValue({ menuItemURL: pageURL })
            form.setFieldsValue({ menuItemPage: selectedPage?.id })
        }
    }

    const handleSubmitButton = () => {
        const formData = form.getFieldsValue()

        if (!formData.menuItemPage && !formData.menuItemURL) {
            Modal.warning({
                title: 'Ошибка сохранения пункта меню',
                content: 'Выберите страницу или введите URL',
                zIndex: 999999
            })
        }
        else {
            const localMenuItems = [...menuItems]

            if (chosenMenuItemPseudoId) {
                localMenuItems.forEach((item) => {
                    if (item.pseudoId == chosenMenuItemPseudoId) {
                        item.name = formData.menuItemName
                        item.icon = formData.menuItemIconText ? formData.menuItemIconText : formData.menuItemIcon
                        item.on = formData.menuItemOn ?? false
                        item.page = formData.menuItemPage
                        item.url = formData.menuItemURL,
                        item.target = formData.menuItemTarget ?? false,
                        item.stereotype = formData.menuItemStereoType,
                        item.screen = formData.menuItemScreen,
                        item.size = formData.menuItemSize
                        item.textIcon = formData.menuItemIconText
                    }
                })
            } else {
                localMenuItems.push({
                    name: formData.menuItemName,
                    icon: formData.menuItemIconText ? formData.menuItemIconText : formData.menuItemIcon,
                    on: formData.menuItemOn ?? false,
                    page: formData.menuItemPage,
                    url: formData.menuItemURL,
                    parentPseudoId: parentPseudoId,
                    target: formData.menuItemTarget,
                    stereotype: formData.menuItemStereoType,
                    size: formData.menuItemSize,
                    screen: formData.menuItemScreen,
                    pseudoId: pseudoId + 1,
                    id: pseudoId + 1,
                    textIcon: formData.menuItemIconText
                })
                setPseudoId(pseudoId + 1)
            }
            
            clearForm()
            setMenuItems(localMenuItems)
            setIsModalVisible(false)
        } 
    }

    useEffect(() => {

        onChange(menuItems)
    }, [menuItems])

    //*Получаем страницы для селекта

    useEffect(() => {
        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES).then((resp) => {
            if (resp.success) {
                if (resp.data) {
                    setPages(JSON.parse(resp.data.value))
                }
            }
        })

        
        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_SCREENS).then((resp) => {
            if (resp.success) {
                if (resp.data) {
                    setScreens(JSON.parse(resp.data.value))
                }
            }
        })

        if (value) {
        
            let newPseudoId = pseudoId
            const localItems = value.map(item => {
                newPseudoId += 1
                
                return ({
                    ...item,
                    id: newPseudoId,
                    // pseudoId: newPseudoId
                })
            })

            setPseudoId(newPseudoId)
        

            setMenuItems(localItems)
        }

    }, [])


    return (
        <>
            <WrapperCard title="Конструктор меню">
                <Buttons.ButtonAddRow
                    size="large"
                    style={{ margin: '10px 20px' }}
                    onClick={() => {
                        setParentPseudoId(null)
                        setIsModalVisible(true)
                    }}
                />
                <div style={{ marginLeft: '20px', width: '80%' }} className="constructorWrapper">

                    <SortableList
                        items={menuItems}
                        onChange={setMenuItems}
                        renderItem={(item) => (
                            // eslint-disable-next-line react/jsx-no-useless-fragment
                            <>
                                {!item.parentPseudoId && (
                                    <SortableList.Item
                                        id={item.id}
                                        customItemStyle={{ padding: 0, borderRadius: '8px' }}
                                    >
                                        <MenuItem
                                            setChosenMenuItemIdForMoving={setChosenMenuItemIdForMoving}
                                            setIsModalMovingVisible={setIsModalMovingVisible}
                                            setMenuItems={setMenuItems}
                                            setIsModalVisible={setIsModalVisible}
                                            setParentPseudoId={setParentPseudoId}
                                            menuItem={item}
                                            menuItems={menuItems}
                                            setChosenItemMenuPseudoId={setChosenItemMenuPseudoId}
                                            form={form}
                                        />

                                        <SortableList.DragHandle
                                            customDragHandlerStyle={{
                                                padding: '15px 10px',
                                                alignSelf: 'baseline',
                                                marginTop: '5px',
                                            }}
                                        />
                                    </SortableList.Item>
                                )}
                            </>
                        )}
                    />
                </div>
            </WrapperCard>

        
            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                title={`${chosenMenuItemPseudoId ? 'Редактирование' : 'Создание'} пункта меню`}
                onCancel={handleCancelModal}
                open={isModalVisible}
            >
                <Row gutter={8}>
                    <Col span={10}>
                        <Form.Item label="Название" name="menuItemName">
                            <Forms.Input placeholder="Название" />
                        </Form.Item>

                        <Form.Item label="Иконка" name="menuItemIcon">
                            <Forms.IconSelect placeholder="Выберите иконку пункта меню" />
                        </Form.Item>
                        <Form.Item label="Иконка" name="menuItemIconText">
                            <Forms.Input placeholder="Иконка" />
                        </Form.Item>
                        <Form.Item label="Вкл/выкл" name="menuItemOn" valuePropName="checked">
                            <Forms.Switch />
                        </Form.Item>
                        <Form.Item label="Стереотип" name="menuItemStereoType">
                            <Forms.Select style={{ width: '100%' }} options={stereotypeOptions} />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        {form.getFieldValue('type') == 'mobile_bottom' || form.getFieldValue('type') == 'mobile_full' ?
                            <Form.Item label="Экран МП" name="menuItemScreen">
                                <Forms.Select
                                    onClear={() => {
                                        form.setFieldsValue({ menuItemURL: '' })
                                        setIsDisabledURLInput(false)
                                    }}
                                    onChange={(e) => {
                                        onChangePageSelectHandler(e, screens)
                                    }}
                                    placeholder="Выберите экран"
                                    customData={{
                                        data: screens ?? [],
                                        convert: {
                                            valueField: 'id',
                                            optionLabelProp: 'name',
                                        },
                                    }}
                                />
                            </Form.Item> :     
                            <Form.Item label="Страница" name="menuItemPage">
                                <Forms.Select
                                    onClear={() => {
                                        form.setFieldsValue({ menuItemURL: '' })
                                        setIsDisabledURLInput(false)
                                    }}
                                    onChange={(e) => {
                                        onChangePageSelectHandler(e, pages)
                                    }}
                                    placeholder="Выберите страницу"
                                    customData={{
                                    
                                        data: pages ?? [],
                                        convert: {
                                            valueField: 'id',
                                            optionLabelProp: 'name',
                                        },
                                    }}
                                />
                            </Form.Item>}
                        <Form.Item label="URL" name="menuItemURL">
                            <Forms.Input disabled={isDisabledURLInput} placeholder="Введите URL" />
                        </Form.Item>
                        <Form.Item label="Открытие в новом окне" name="menuItemTarget" valuePropName="checked">
                            <Forms.Switch />
                        </Form.Item>
                        <Form.Item label="Размер (в %)" name="menuItemSize">
                            <Forms.Input type ="number" min ={0} max ={100} />
                        </Form.Item>
                    </Col>
                </Row>
                <Buttons.ButtonAdd
                    onClick={handleSubmitButton}
                    color="rgb(92, 184, 92)"
                    customText={`${chosenMenuItemPseudoId ? 'Редактировать' : 'Создать'} пункт меню`}
                    icon={null}
                />
            </DefaultModal2>
            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                open={isModalMovingVisible}
                title="Перенос пункта меню в другой пункт"
                onCancel={handleCancelMovingModal}
            >
                <Col span={12}>
                    <Form.Item
                        label="Пункт для переноса"
                        name="movingMenuItem"
                        rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                        <Forms.Select
                            placeholder="Выберите пункт"
                            customData={{
                                data: menuItems.filter((item) => item.pseudoId !== chosenMenuItemIdForMoving),
                                convert: {
                                    valueField: 'pseudoId',
                                    optionLabelProp: 'name',
                                },
                            }}
                        />
                    </Form.Item>

                    <Buttons.ButtonAdd
                        onClick={handleMovingItemButton}
                        color="rgb(92, 184, 92)"
                        customText="Перенести"
                        icon={null}
                    />
                </Col>
            </DefaultModal2>
        </>
    )
}

export default MenuConstructor