import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { SortOrder } from 'antd/es/table/interface'
import { FC } from 'react'

/**
 * Компонент иконки сортировки для хедера таблицы
 * 
 * @param sortOrder - текущее состояние сортировки 
 */
export const SortIcon: FC<{ sortOrder: SortOrder, color?: string  }> = ({ sortOrder, color }) => {
    switch (sortOrder) {
        case 'ascend': {
            return <CaretUpOutlined style={{ color: color ??  'rgba(0, 0, 0, 0.29)' }} />
        }
        case 'descend': {
            return <CaretDownOutlined style={{  color: color ?? 'rgba(0, 0, 0, 0.29)' }} />
        }
        default: {
            return <div style={{ width: 14, height: 14 }} />
        }
    }
}