import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { FC } from 'react'

interface IOAIconView {
    objectAttr: any
    style?: any
}
const OAIconView: FC<IOAIconView> = ({ objectAttr, style, ...props }) => {
    const icon = objectAttr?.attribute_value


    return <ECIconView {...props} style={style} icon={icon ? icon : ''} />
}

export default OAIconView