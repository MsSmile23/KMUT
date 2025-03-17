import { Input, Switch } from '@shared/ui/forms'
import { Col, Form, Row, Collapse } from 'antd'
import ECSelectColorsFromScheme from '@shared/ui/ECUIKit/forms/ECSelectColorsFromScheme/ECSelectColorsFromScheme'
import { TableViewForm } from '@shared/ui/tables'

const TableFormSettings = ({ colors }) => {
    return (
        <>
            <>
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Collapse
                            defaultActiveKey={['1']}
                            style={{ marginBottom: '10px' }}
                            items={[
                                {
                                    key: '1',
                                    label: 'Шапка',
                                    children: (
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Цвет текста"
                                                    name="tableHeaderTextColor"
                                                >
                                                    <ECSelectColorsFromScheme colors={colors} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Цвет фона"
                                                    name="tableHeaderBackgroundColor"
                                                >
                                                    <ECSelectColorsFromScheme colors={colors} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Отступ слева"
                                                    name="tableHeaderLeftPadding"
                                                >
                                                    <Input type="number" min={0} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Отступ справа"
                                                    name="tableHeaderRightPadding"
                                                >
                                                    <Input type="number" min={0} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Отступ сверху"
                                                    name="tableHeaderUpPadding"
                                                >
                                                    <Input type="number" min={0} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Отступ снизу"
                                                    name="tableHeaderDownPadding"
                                                >
                                                    <Input type="number" min={0} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ),
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <Collapse
                            defaultActiveKey={['1']}
                            style={{ marginBottom: '10px' }}
                            items={[
                                {
                                    key: '1',
                                    label: 'Контент',
                                    children: (
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Цвет текста"
                                                    name="tableContentTextColor"
                                                >
                                                    <ECSelectColorsFromScheme colors={colors} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Цвет фона"
                                                    name="tableContentBackgroundColor"
                                                >
                                                    <ECSelectColorsFromScheme colors={colors} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ),
                                },
                            ]}
                        />
                    </Col>
                </Row>
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Collapse
                            defaultActiveKey={['1']}
                            style={{ marginBottom: '10px' }}
                            items={[
                                {
                                    key: '1',
                                    label: 'Границы',
                                    children: (
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Цвет границ"
                                                    name="tableBorderColor"
                                                >
                                                    <ECSelectColorsFromScheme colors={colors} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Толщина границ"
                                                    name="tableBorderWidth"
                                                >
                                                    <Input type="number" min={1} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 11, offset: 0 }}
                                                    label="Закругление границ"
                                                    name="tableBorderRadius"
                                                >
                                                    <Input type="number" min={0} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ),
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <Collapse
                            defaultActiveKey={['1']}
                            style={{ marginBottom: '10px' }}
                            items={[
                                {
                                    key: '1',
                                    label: 'Сетка',
                                    children: (
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Цвет сетки"
                                                    name="tableNetColor"
                                                >
                                                    <ECSelectColorsFromScheme colors={colors} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 10, offset: 0 }}
                                                    label="Толщина сетки"
                                                    name="tableNetWidth"
                                                >
                                                    <Input type="number" min={1} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    valuePropName="checked"
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 11, offset: 0 }}
                                                    label="Отображение сетки"
                                                    name="tableNetShow"
                                                >
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ),
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </>

            <Collapse
                defaultActiveKey={['1']}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Настройки представления таблицы',
                        children: (
                            <TableViewForm />
                        ),
                    },
                ]}
            />
        </>
    )
}

export default TableFormSettings