
import { Form, Select, SelectProps, Space } from 'antd';
import { SpaceCompactProps } from 'antd/es/space/Compact';

export interface IMultiplicitySelect2 extends SelectProps {
    space?: SpaceCompactProps
    required?: boolean
}

const options = new Array(10).fill(0).map((_el, i) => {
    return { value: i + 1, label: `*${i + 1}` }
})

/**
 * Компонент "Кратность". Использовать только внутри Form.Item!
 * 
 * Выдает опции от 1 до 9.
 * 
 * TODO?: сделать для использования отдельно
 * 
 * @param space - настройки компонента Space
 */
export const MultiplicitySelect2: React.FC<IMultiplicitySelect2> = ({ space, required, ...props }) => {
    return (
        <Space.Compact style={{ width: '100%' }} {...space} >
            {['left', 'right'].map((k) => (
                <Form.Item 
                    key={k} 
                    noStyle 
                    name={['multiplicity', k]}
                    // todo: посмотреть как сделать поле required нормальным образом
                    rules={[{ required: Boolean(required), message: k === 'left' ? 'Обязательно' : ' ' }]} 
                >
                    <Select options={options} style={{ width: '100%' }} placeholder="*" {...props} />
                </Form.Item>
            ))}
        </Space.Compact>
    )
}