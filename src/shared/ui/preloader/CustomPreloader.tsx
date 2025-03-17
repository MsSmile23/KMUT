import { Spin } from 'antd';
import { FC } from 'react';
import { SpinSize } from 'antd/es/spin';

interface CustomPreloader {
    size: SpinSize
    style?: any,
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const CustomPreloader: FC<CustomPreloader> = ({ 
    size = 'default', 
    style
}) => {
    return (
        <div style={style}>
            <Spin size={size} />
        </div>
    )
}

export default CustomPreloader