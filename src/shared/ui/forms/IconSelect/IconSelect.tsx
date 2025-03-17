import {  Space, Typography } from 'antd'
import { FC } from 'react'
// import * as Icons from '@ant-design/icons/lib/icons/'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ISelectProps, Select } from '../Select/Select'
import * as AntdIcons from '@ant-design/icons/lib/icons/'
import * as FiIcons from 'react-icons/fi';
const Icons =   { ...AntdIcons, ...FiIcons  } 
const { Text } = Typography

export const IconSelect: FC<ISelectProps> = ({ ...props }) => {
    const iconOptions: any[] = Object.keys(Icons).map((icon) => {
        return {
            value: icon,
            label: (
                <Space>
                    <ECIconView icon={icon as any} />
                    <Text>{icon}</Text>
                </Space>
            ),
        }
    })

    return (
        <Select
            placeholder="Выберите иконку"
            customData={{
                data: iconOptions?.slice(1, iconOptions?.length) ?? [],
                convert: {
                    valueField: 'value',
                    optionFilterProp: 'value',
                    optionLabelProp: 'label',
                },
            }}
            {...props}
        />
    )
}