import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    format: string,
    active?: boolean,
}

const ToolbarButton: FC <PropsWithChildren<ToolbarButtonProps>> = (props) => {
    const { children, format, active, ...rest } = props

    return (
        <button 
            className={`toolbar-button ${active ? 'btnActive' : ''}`} 
            title={format}  
            {...rest} 
            style={{ width: '30px', height: '20px', margin: '0 2px' }}
        >
            {children}
        </button>
    )
}

export default ToolbarButton