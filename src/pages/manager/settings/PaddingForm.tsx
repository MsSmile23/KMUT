import { Forms } from '@shared/ui/forms'
import { Col, Form, Row, Switch, Collapse } from 'antd'
import Item from 'antd/es/list/Item'
import { ColProps, RowProps } from 'antd/lib'
const rowStyles: RowProps = {
    gutter: [16, 16],
}

const colStyles: ColProps = {
    xs: 8,
}

const PaddingForm = () => {
    return (
        <>
            <h4>Основные отступы</h4>
            <Row {...rowStyles}>
                <Col {...colStyles}>
                    <Forms.Label>Базовый отступ</Forms.Label>
                    <Form.Item
                        name="basePadding"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%', marginTop: 25 }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение базового отступа"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Левая граница - Меню"
                        name="leftPaddingMenu"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="leftPaddingMenuValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение левой границы"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Верхняя граница - Шапка"
                        name="headerPadding"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="headerPaddingValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение верхней границы"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Шапка - Контент"
                        name="headerContentPadding"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="headerContentPaddingValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение отступа шапки"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Правая граница - Контент"
                        name="rightPaddingContent"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="rightPaddingContentValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение правой границы"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Нижняя граница - Контент"
                        name="bottomPaddingContent"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="bottomPaddingContentValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение нижней границы"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <h4>Дополнительные отступы</h4>
            <Row {...rowStyles}>
                <Col {...colStyles}>
                    <Form.Item
                        label="Меню - Сайдбар"
                        name="menuSidebar"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="menuSidebarValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение отступа меню"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Верхнее дерево - Нижнее дерево"
                        name="upAndDownTreePadding"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="upAndDownTreePaddingValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение отступа деревьев"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Сайдбар - Контент страницы"
                        name="sidebarPageContentPadding"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="sidebarPageContentPaddingValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Значение отступа сайдбара"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Между виджетами (вертикальный)"
                        name="verticalWidgetPadding"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="verticalWidgetPaddingValue"
                        style={{ marginBottom: 16 }}
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Вертикальный отступ виджетов"
                        />
                    </Form.Item>
                </Col>
                <Col {...colStyles}>
                    <Form.Item
                        label="Между виджетами (горизонтальный)"
                        name="horizontalWidgetPadding"
                        valuePropName="checked"
                        labelCol={{ span: 14 }}
                        labelAlign="left"
                        style={{ marginBottom: 16 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="horizontalWidgetPaddingValue"
                        style={{ marginBottom: 16 }}
                        labelAlign="left"
                        initialValue={3}
                    >
                        <Forms.Input
                            style={{ width: '70%' }}
                            type="number"
                            min={0}
                            allowClear
                            placeholder="Горизонтальный отступ виджетов"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    )
}

export default PaddingForm