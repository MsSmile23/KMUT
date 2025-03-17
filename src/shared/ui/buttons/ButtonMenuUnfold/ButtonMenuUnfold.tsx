import { Button, ButtonProps } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { FC } from 'react';

interface IButtonMenu extends ButtonProps {
    open?: boolean
    revert?: boolean
}

export const ButtonMenu: FC<IButtonMenu> = ({ open, revert, ...props }) => {
    const styles = { color: 'white', fontSize: 22, transform: `rotate(${revert ? '180deg' : '0deg'})` }

    return (
        <Button
            type="text"
            icon={open ? (
                <MenuFoldOutlined 
                    style={styles} 
                />
            ) : (
                <MenuUnfoldOutlined style={styles} />
            )}    
            {...props}
        />
    )
}