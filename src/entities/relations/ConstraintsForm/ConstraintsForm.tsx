import { SERVICES_CONSTRAINTS } from '@shared/api/Constraints'
import { IConstraint } from '@shared/types/constraints'
import { Buttons } from '@shared/ui/buttons'
import { Forms } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import { SortableList } from '@shared/ui/SortableList'
import { Col, Form, FormInstance, Row } from 'antd'
import { FC, useState } from 'react'

interface IConstraintsForm {
    constraints: IConstraint[]
    setConstraints: React.Dispatch<React.SetStateAction<IConstraint[]>>
    form: FormInstance<any>
}
const ConstraintsForm: FC<IConstraintsForm> = ({ constraints, setConstraints, form }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [chosenConstraintName, setChosenConstraintName] = useState<string>(null)

    const cancelModal = () => {
        setModalVisible(false)

        form.setFieldsValue({
            constraintName: null,
            constraintRule: null,
        })
    }

    const addButtonHandler = () => {
        setModalVisible(true)
    }

    const handleAddConstraint = () => {
        let localConstraints = [...constraints]

        if (chosenConstraintName) {
            const updatedConstraints = localConstraints.map((constraint) => {
                if (constraint.name === chosenConstraintName) {
                    return {
                        ...constraint,
                        name: form.getFieldValue('constraintName'),
                        describe_rules: form.getFieldValue('constraintRule') || null,
                    }
                }

                return constraint
            })

            localConstraints = updatedConstraints
        } else {
            localConstraints.push({
                name: form.getFieldValue('constraintName'),
                describe_rules: form.getFieldValue('constraintRule') || null,
            })
        }
        setConstraints(localConstraints)
        setModalVisible(false)

        form.setFieldsValue({
            constraintName: null,
            constraintRule: null,
        })
        setChosenConstraintName(null)
    }

    const editButtonHandler = (constraint) => {
        form.setFieldsValue({
            constraintName: constraint?.name,
            constraintRule: constraint?.describe_rules,
        })
        setModalVisible(true)
        setChosenConstraintName(constraint?.name)
    }

    const deleteButtonHandler = (item) => {
        const updatedConstraints = constraints.filter((constraint) => constraint.name !== item.name)

        if (item.id) {
            SERVICES_CONSTRAINTS.Models.deleteConstraint({ id: String(item.id) }).then()
        }

        setConstraints(updatedConstraints)
    }

    const onChangeSorterData = (data) => {
        const localData: any = []

        data.forEach((item, index) => {
            localData.push({
                name: item.name,
                describe_rules: item.describe_rules,
            })

            if (typeof data[index]?.id === 'number') {
                localData[index].id = data[index]?.id
            }
        })

        setConstraints(localData)
    }

    return (
        <Col span={24} style={{ width: '30%' }}>
            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                open={modalVisible}
                title="Создание ограничения"
                onCancel={cancelModal}
            >
                {' '}
                <Form.Item label="Название" required name="constraintName" labelAlign="left">
                    <Forms.Input placeholder="Название" style={{ maxWidth: '300px' }} />
                </Form.Item>{' '}
                <Form.Item label="Правила" name="constraintRule" labelAlign="left">
                    <Forms.TextArea placeholder="Правила" style={{ maxWidth: '300px' }} />
                </Form.Item>
                <Buttons.ButtonAdd
                    onClick={handleAddConstraint}
                    color="rgb(92, 184, 92)"
                    customText="Добавить"
                    icon={null}
                />
            </DefaultModal2>
            <Buttons.ButtonAddRow size="large" onClick={addButtonHandler} />

            <SortableList
                items={constraints.map((item) => ({ ...item, id: item?.id ? item?.id : item.name }))}
                onChange={(data) => onChangeSorterData(data)}
                renderItem={(item) => (
                    <SortableList.Item
                        id={item?.id ? item?.id : item.name}
                        customItemStyle={{ padding: 5, borderRadius: '5px' }}
                    >
                        <Row align="middle" justify="space-between" style={{ width: '100%' }}>
                            <Col span={12}>{item.name}</Col>

                            <Row gutter={4} justify="space-between">
                                <Col>
                                    {' '}
                                    <Buttons.ButtonEditRow
                                        onClick={() => {
                                            editButtonHandler(item)
                                        }}
                                    />
                                </Col>

                                <Col>
                                    {' '}
                                    <Buttons.ButtonDeleteRow
                                        withConfirm
                                        onClick={() => {
                                            deleteButtonHandler(item)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Row>
                        <SortableList.DragHandle />
                    </SortableList.Item>
                )}
            />
        </Col>
    )
}

export default ConstraintsForm