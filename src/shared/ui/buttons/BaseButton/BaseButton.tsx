import { Button, ButtonProps } from 'antd';
import { FC } from 'react';

export const BaseButton: FC<ButtonProps> = (props) => {
    return (
        <Button {...props} />
    )
}