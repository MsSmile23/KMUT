import { ColProps, RowProps } from 'antd/lib'

export const rowStyles: RowProps = {
    gutter: [32, 0],
}

export const colStyles: ColProps = {
    xs: 12
}

export interface PortInfo {
    proto: string;
    port: string;
    state: 'open' | 'close';
    service: string;
}

export const REPRESENT_OPTIONS = [
    {
        label: 'Карточки статусов',
        value: 'status_card'
    }
]