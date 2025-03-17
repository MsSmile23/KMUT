import { FilterFilled, FilterOutlined } from '@ant-design/icons';
import { FC } from 'react';

/**
 * Компонент иконки фильтрации для хедера таблицы
 * 
 * @param filtered - состояние активности (есть данные в инпуте или нет) 
 */
export const FilterIcon: FC<{ filtered?: boolean, color?: string }> = ({ filtered, color }) => (
    /* todo: узнать почему иконка упирается в правый край таблицы */
    <div style={{ paddingRight: 8 }}>
        {filtered
            ? <FilterFilled style={{ color: filtered ? 'rgb(22, 119, 255)' : color }} />
            : <FilterOutlined style={{ color: color }} />}
    </div>
)