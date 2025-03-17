import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { IWidgetObjectsLinkedTableForm } from './types'
import { Button, Divider, Flex, Form, Select, Space, Typography } from 'antd'
import { useAttributesStore } from '@shared/stores/attributes'
import { DeleteOutlined } from '@ant-design/icons'
import { useRelationsStore } from '@shared/stores/relations'
import { useClassesStore } from '@shared/stores/classes'
import { SortableColumns } from './SortableColumns'
import { ECTooltip } from '@shared/ui/tooltips'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { Input, Switch } from '@shared/ui/forms'
import { getClassFromClassesStore } from '@shared/utils/common'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, ColProps, Row, RowProps } from 'antd/lib'
import { TableViewForm } from '@shared/ui/tables'

export const rowStyles: RowProps = {
    gutter: [32, 32],
}

export const colStyles: ColProps = {
    xs: 32
}

/**
 * Форма для создания виджета таблицы связанного оборудования
 */
const WidgetObjectsLinkedTableForm: FC<IWidgetObjectsLinkedTableForm> = ({
    settings: { widget },
    onChangeForm
}) => {
    const [form] = Form.useForm()
    const [parentClassesCounter, setParentClassesCounter] = useState(0)

    const classesOptions = useClassesStore((st) => st.store.data.map(({ id, name }) => ({
        label: `${id} - ${name}`, value: id
    })))

    const attributesOptions = useAttributesStore((st) => st.store.data.map(({ id, name }) => ({
        label: `${id} - ${name}`, value: id
    })))
    const relationsOptions = useRelationsStore((st) =>
        st.store.data.map((rel) => ({
            // eslint-disable-next-line max-len
            label: `${getClassFromClassesStore(rel.left_class_id)?.name} -> ${getClassFromClassesStore(rel.right_class_id)?.name
            } (${rel.name})`,
            value: rel.id,
        }))
    )

    const parentClassesFormItems = useMemo(() => {
        return new Array(parentClassesCounter + 1).fill(null).map((_, i) => i)
    }, [parentClassesCounter])

    const deleteParentClass = () => {
        form.resetFields([
            ['parentClasses', parentClassesCounter, 'ids'],
            ['parentClasses', parentClassesCounter, 'attributeIds']
        ])

        setParentClassesCounter((p) => p > 0 ? p - 1 : p)
    }

    const deleteAdditionalParentClasses = () => {
        for (let i = 0; i < parentClassesCounter; i++) {
            form.resetFields([
                ['parentClasses', i, 'ids'],
                ['parentClasses', i, 'attributeIds']
            ])
        }

        setParentClassesCounter(0)
    }

    const changeForm = (value: any, values: any) => {
        const result = {
            ...values,
            parentClasses: Object.values(values?.parentClasses || {})
        }

        onChangeForm(result)
    }

    const listenParentClassesChanges = (field: string, prefix: string) => {
        const parentClasses = [
            ...new Set(Object.values(
                form.getFieldValue('parentClasses') || {}).flatMap((cls: any) => cls?.[field]
            ))
        ]

        form.setFieldValue('columnsOrder', [
            ...(widget?.columnsOrder || []).filter((col) => !col.includes(prefix)),
            ...parentClasses.map((id) => `${prefix}${id}`)
        ])
    }

    const listenTargetClassesChanges = () => {
        const targetAttributes = form.getFieldValue(['targetClasses', 'attributeIds'])

        form.setFieldValue('columnsOrder', [
            ...(widget?.columnsOrder || []).filter((col) => !col.includes('target_attr_')),
            ...targetAttributes.map((id: number) => `${'target_attr_'}${id}`)
        ])
    }

    useEffect(() => {
        onChangeForm(widget)
    }, [])

    useEffect(() => {
        setParentClassesCounter(widget?.parentClasses ? Object.keys(widget.parentClasses).length : 0)
    }, [])

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={changeForm}
            initialValues={widget}
        >
            <Form.Item name={['targetClasses', 'ids']} label="Целевые классы">
                <ClassesCascader />
            </Form.Item>
            <Form.Item name="childClassesIds" label="Связующие классы">
                {/* <Form.Item name="childClassesIds" label="Вспомогательные классы, которые отображать не надо"> */}
                <ClassesCascader />
            </Form.Item>
            <Form.Item name={['targetClasses', 'attributeIds']} label="Атрибуты целевых классов">
                <Select
                    options={attributesOptions}
                    mode="multiple"
                    onChange={listenTargetClassesChanges}
                />
            </Form.Item>
            <Form.Item name="relationIds" label="Связи">
                <Select options={relationsOptions} mode="multiple" />
            </Form.Item>
            <Form.Item name="statusColumn" label="Название столбца состояния">
                <Input />
            </Form.Item>
            <Form.Item name="classColumn" label="Название столбца класса">
                <Input />
            </Form.Item>
            {widget?.columnsOrder?.length > 0 && (
                <Form.Item name="columnsOrder" label="Текущий порядок столбцов">
                    <SortableColumns />
                </Form.Item>
            )}
            {parentClassesFormItems.map((num, i, arr) => (
                <Fragment key={`parentClass${num}`}>
                    <Form.Item
                        name={['parentClasses', num, 'id']}
                        label={arr.length > 1 && i === arr.length - 1 ? (
                            <Space>
                                <Typography.Text>Родительские классы</Typography.Text>
                                <ECTooltip title="Удалить данный пункт меню" mouseEnterDelay={1}>
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={deleteParentClass}
                                        icon={<DeleteOutlined />}
                                    />
                                </ECTooltip>
                            </Space>
                        ) : 'Родительские классы'}
                    >
                        <Select
                            options={classesOptions}
                            onChange={() => listenParentClassesChanges('id', 'parent_class_')}
                        />
                    </Form.Item>
                    <Form.Item name={['parentClasses', num, 'attributeIds']} label="Атрибуты родительских классов">
                        <Select
                            options={attributesOptions}
                            mode="multiple"
                            onChange={() => listenParentClassesChanges('attributeIds', 'parent_attr_')}
                        />
                    </Form.Item>
                    {(arr.length > 1 && i !== arr.length - 1) && <Divider />}
                </Fragment>
            ))}
            <Form.Item>
                <Flex gap={8}>
                    <Button
                        type="dashed"
                        style={{ width: '100%' }}
                        onClick={() => setParentClassesCounter((p) => p + 1)}
                    >
                        Добавить родительские классы
                    </Button>
                    {parentClassesCounter > 0 && (
                        <Button
                            type="dashed"
                            style={{ width: '100%' }}
                            onClick={deleteAdditionalParentClasses}
                        >
                            Удалить все дополнительные родительские классы
                        </Button>
                    )}
                </Flex>
            </Form.Item>

            <Form.Item label="Список ключей выбранных колонок" name="chosenDataIndex">
                <Input />
            </Form.Item>
            <Form.Item valuePropName="checked" label="Скрытие выбранных колонок" name="hideChosenColumns">
                <Switch />
            </Form.Item>


            <WrapperCard
                styleMode="replace"
                bodyStyle={{ padding: '10px' }}
                title="Настройки представления"
            >
                <div style={{ display: 'flex', alignItems: 'center', width: 500, justifyContent: 'space-between' }}>
                    <p>ID таблицы: </p>
                    <Form.Item
                        labelAlign="left"
                        name="tableId"
                        style={{ marginBottom: 0 }}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <TableViewForm />
            </WrapperCard>

        </Form>
    )
}

export default WidgetObjectsLinkedTableForm