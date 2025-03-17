import { FC } from 'react'
import * as AntdIcons from '@ant-design/icons/lib/icons/'
import * as FiIcons from 'react-icons/fi';
const Icons =   { ...AntdIcons, ...FiIcons } 


export interface IECIconView {
    icon?: keyof typeof Icons
    style?: React.CSSProperties
}
export const ECIconView: FC<IECIconView> = ({ icon, style, ...props }) => {
    type Keys = IECIconView['icon']
    type Values = typeof Icons[Keys]
    const IconComponent: Values = Icons[icon]

    return <IconComponent {...props} style={style} />
}