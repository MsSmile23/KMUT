import { ButtonProps } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
export interface IButton extends ButtonProps {
    text?: boolean
    size?: SizeType
    background?: string
    customText?: string
    color?: string
    icon?: boolean,
    tooltipTitle?: string,
    tooltipText?: string
    loading?: boolean
}

export interface IButtonRow extends ButtonProps {
    tooltipText?: string
    withConfirm?: boolean,
    popupTitle?: string,
    color?: string, 
    baseSettings?: boolean
}