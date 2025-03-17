import {
    Checkbox,
    Col,
    Form,
    InputNumber,
    Radio,
    Row,
    Select,
    Space,
} from 'antd';
import { RRule } from 'rrule';
import { hours, months, weekdays } from '../ReportForm/data';

const checkboxSpan = 3;
const capitalizeFirstChar = (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
};

/**
 * Компонент для отображения дней, месяцев и т.д.
 */
const RegularRow: React.FC<{
    items: { value: any; label: string }[];
    onChange?: any;
    span?: number;
}> = ({ items, onChange, span }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            {items.map(({ value, label }) => (
                <Col span={span || 3} key={Math.random().toString()}>
                    <Checkbox value={value} onChange={onChange}>
                        {capitalizeFirstChar(label)}
                    </Checkbox>
                </Col>
            ))}
        </Row>
    );
};

/**
 * Компонент для создания регулярного расписания (удалить)
 */
const Schedule: React.FC = () => {

    return (
        <Form
            labelCol={{ span: 3 }}
            labelAlign="left"
        >
            <Form.Item label="Частота" name={['scheduleRRule', 'freq']}>
                <Radio.Group style={{ width: '100%' }}>
                    <Row>
                        {[
                            ['HOURLY', 'час'],
                            ['DAILY', 'день'],
                            ['MONTHLY', 'месяц'],
                        ].map(([value, title]) => (
                            <Col key={`freq-${value}`} span={checkboxSpan}>
                                <Radio value={RRule[value]}>
                                    Каждый {title}
                                </Radio>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                valuePropName="checked"
                label="По дням недели"
                name={['scheduleRRule', 'byweekday']}
            >
                <Checkbox.Group style={{ width: '100%' }}>
                    <RegularRow items={weekdays.slice(0, 3)} />
                    <RegularRow items={weekdays.slice(3, 6)} />
                    <RegularRow items={weekdays.slice(-1)} />
                </Checkbox.Group>
            </Form.Item>
            <Form.Item
                valuePropName="checked"
                label="По месяцам"
                name={['scheduleRRule', 'bymonth']}
            >
                <Checkbox.Group style={{ width: '100%' }}>
                    <RegularRow items={months.slice(0, 3)} />
                    <RegularRow items={months.slice(3, 6)} />
                    <RegularRow items={months.slice(6, 9)} />
                    <RegularRow items={months.slice(9)} />
                </Checkbox.Group>
            </Form.Item>
            <Form.Item
                valuePropName="checked"
                label="По часам"
                name={['scheduleRRule', 'byhour']}
            >
                <Checkbox.Group style={{ width: '100%' }}>
                    <RegularRow span={1} items={hours.slice(0, 8)} />
                    <RegularRow span={1} items={hours.slice(8, 16)} />
                    <RegularRow span={1} items={hours.slice(16)} />
                </Checkbox.Group>
            </Form.Item>
            <Form.Item label="За период">
                <Space.Compact>
                    <Form.Item
                        noStyle
                        name={['pastPeriod', 'unit']}
                        rules={[{ required: true, message: '' }]}
                    >
                        <Select
                            placeholder="Тип периода"
                            style={{ width: 180 }}
                            options={[
                                [1, 'час'],
                                [2, 'день'],
                                [3, 'месяц'],
                            ].map(([value, label]) => ({ value, label }))}
                        />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        name={['pastPeriod', 'value']}
                        rules={[{ required: true, message: '' }]}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                            placeholder="Введите число"
                            min={1}
                        />
                    </Form.Item>
                </Space.Compact>
            </Form.Item>
        </Form>
    );
};

export default Schedule;