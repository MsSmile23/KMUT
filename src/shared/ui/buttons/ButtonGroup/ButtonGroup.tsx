import { FC } from 'react'
import { FloatButton } from 'antd'
import { ButtonSave } from '../ButtonSave/ButtonSave'
import { ButtonClearRow } from '../ButtonClearRow/ButtonClearRow'
import { ButtonDeleteRow } from '../ButtonDeleteRow/ButtonDeleteRow'
import { zIndex } from '@shared/config/zIndex.config'

interface IButtonsGroupProps {
    handleSave: () => void,
    handleCancel: () => void,
    handleDelete: () => void,
    direction?: 'column' | 'row',
    colorButtonSave?: string,
    colorButtonClear?: string,
    colorButtonDelete?: string,
    withConfirm?: boolean,
    top?: number | string,
    left?: number | string,
    right?: number | string,
    bottom?: number | string,
    gap?: number,
    size?: 'large' | 'middle' | 'small',
    position?: 'absolute' | 'fixed' | 'static'
}

const ButtonsGroup: FC<IButtonsGroupProps> = ({
    handleSave,
    handleCancel,
    handleDelete,
    direction = 'row',
    colorButtonSave = 'green',
    colorButtonClear,
    colorButtonDelete,
    withConfirm = false,
    top,
    left,
    right,
    bottom,
    gap,
    size = 'small',
    position = 'absolute'
}) => {

    return (
        <div  
            style={{ 
                width: 'min-content',
                display: 'flex', 
                flexDirection: direction,
                position: position,
                top: top,
                left: left,
                right: right,
                bottom: bottom,
                gap: gap,
                height: 'fit-content',
                zIndex: zIndex.buttonsGroup,
            }} 
        >
            <ButtonSave
                onClick={handleSave}
                color={colorButtonSave} 
                size={size}
            />
            <ButtonClearRow
                onClick={handleCancel}
                color={colorButtonClear}
                size={size}
            />
            <ButtonDeleteRow 
                withConfirm={withConfirm}
                onClick={handleDelete}
                color={colorButtonDelete}
                size={size}
            />
        </div>
    )
}

export default ButtonsGroup