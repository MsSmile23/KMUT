import { Spin } from 'antd'
import { SpinProps } from 'antd/es/spin'
import { FC } from 'react'

const ECLoader: FC<SpinProps> = ({ ...props }) => {
    return <Spin {...props} />
}

export default ECLoader