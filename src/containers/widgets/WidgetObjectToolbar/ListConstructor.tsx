/* eslint-disable react/jsx-max-depth */
import { SortableList } from '@shared/ui/SortableList'
import { Buttons } from '@shared/ui/buttons'
import { DefaultModal2 } from '@shared/ui/modals'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import ListConstructorItem from './ListConstructorItem'
import ListConstructorForm from './ListConstructorForm'

const getInitTools = (form) => {
    return form.getFieldsValue().tools ?? []
}

const ListConstructor = ({ form, onChange, objId }) => {
    const [tools, setTools] = useState([])
    const [chosenToolId, setChosenToolId] = useState<number | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [pushMode, setPushMode] = useState<boolean>(false)
    const [id, setId] = useState<number>(0)
    const [addToolForm] = useForm();
    
    const handleCancelModal = () => {
        setIsModalVisible(false)
        addToolForm.resetFields()
        setChosenToolId(null)
    }

    useEffect(() => {
        setTools(getInitTools(form))
    }, [])

    useEffect(() => {
        onChange(tools)
        setId(tools.length)
    }, [tools])

    const handleSubmitButton = () => {
        const formData = addToolForm.getFieldsValue()

        let localMenuItems = [...tools]

        if (chosenToolId) {
            localMenuItems.forEach((item) => {
                if (item.id == chosenToolId) {
                    (item.name = formData.itemName),
                    (item.type = formData.itemType),
                    (item.icon = formData.itemIcon),
                    (item.description = formData.itemDescription),
                    (item.functional = formData.itemFunctional)
                }
            })
        } else {
            const newItem = {
                type: formData.itemType,
                icon: formData.itemIcon,
                name: formData.itemName,
                description: formData.itemDescription,
                functional: formData.itemFunctional,
                id: id + 1,
            }

            localMenuItems = pushMode ? [...localMenuItems, newItem] : [newItem, ...localMenuItems];
            setId(id + 1)
        }

        addToolForm.resetFields()
        setTools(localMenuItems)
        setIsModalVisible(false)
        setChosenToolId(null)
    }

    const handleDeleteButton = (id) => {
        setTools(prevTools => prevTools.filter(tool => tool.id !== id))
    }

    const handleEditButton = (item) => {
        addToolForm.setFieldsValue({
            itemType: item.type,
            itemIcon: item.icon,
            itemName: item.name,
            itemDescription: item.description,
            itemFunctional: item.functional,
        })
        setChosenToolId(item.id)
        setIsModalVisible(true)
    }

    return (
        <>
            <WrapperCard title="Конструктор инструментов">
                <Buttons.ButtonAddRow
                    size="small"
                    style={{ margin: '10px 20px' }}
                    onClick={() => {
                        setIsModalVisible(true)
                        setPushMode(false)
                    }}
                />
                <div style={{ marginLeft: '20px', width: '90%', userSelect: 'none' }} className="constructorWrapper">
                    <Row align="middle" justify="space-between" style={{ width: '90%' }}>
                        <Col span={2} style={{ marginLeft: '10px' }}>
                            Тип
                        </Col>
                        <Col style={{ marginLeft: '10px' }}>
                            Имя
                        </Col>
                        <Col span={3} style={{ marginLeft: '10px' }}>
                            Описание
                        </Col>
                        <Col span={2} style={{ marginLeft: '10px' }}>
                            Иконка
                        </Col>
                        <Col span={4} style={{ marginLeft: '10px' }}>
                            Функционал
                        </Col>
                    </Row>
                    <SortableList
                        items={tools}
                        onChange={setTools}
                        renderItem={(item) => (
                            <ListConstructorItem
                                key={item.id}
                                item={item}
                                onEdit={handleEditButton}
                                onDelete={handleDeleteButton}
                            />
                        )}
                    />
                </div>
                <Buttons.ButtonAddRow
                    size="small"
                    style={{ margin: '10px 20px' }}
                    onClick={() => {
                        setIsModalVisible(true)
                        setPushMode(true)
                    }}
                />
            </WrapperCard>
            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                title={`${chosenToolId ? 'Редактирование' : 'Создание'} инструмента`}
                onCancel={handleCancelModal}
                open={isModalVisible}
            >
                <ListConstructorForm
                    form={addToolForm}
                    handleSubmitButton={handleSubmitButton}
                    objId={objId}
                />
            </DefaultModal2>
        </>
    )
}

export default ListConstructor