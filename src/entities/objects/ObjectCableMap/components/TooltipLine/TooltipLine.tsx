import { FC } from 'react'
import { coordTooltipLineInitial } from '../../types'

interface TooltipLineProps {
    coordTooltipLine: coordTooltipLineInitial
    setVisible: any
}

const TooltipLine: FC<TooltipLineProps> = (props) => {

    const { coordTooltipLine, setVisible } = props

    return (
        <div 
            onMouseOver={() => setVisible(true)}
            onMouseOut={() => setVisible(false)}
            style={{
                position: 'absolute',
                top: coordTooltipLine.y,
                left: coordTooltipLine.x,
                backgroundColor: 'white',
                opacity: Object.keys(coordTooltipLine || {}).length ? 1 : 0,
                padding: 10,
                borderRadius: 5,
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                zIndex: 5001
            }}
        >
            {coordTooltipLine.content.map((link) => {
                return (
                    <div key={link.id} style={{ color: link?.color, fontSize: 10 }}>
                        {link?.custom?.cable?.name}
                    </div>
                )
            })}
        </div>
    )
}

export default TooltipLine