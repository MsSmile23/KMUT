import { FC } from 'react'
import { IECGridMap, IGridObject } from './types'

type IECGridMapObjectProps = Omit<IGridObject, 'x' | 'y'> & Pick<IECGridMap, 'onClick' | 'viewType'>

const ECGridMapObject: FC<IECGridMapObjectProps> = ({
    color,
    id,
    name,
    viewType,
    onClick,
}) => {
    return (
        <div
            onClick={onClick && color !== '#cdcbcc' ? () => onClick(id) : null}
            style={{ 
                color: 'black',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: color, 
                height: '100%', 
                width: '100%',
                cursor: color == '#cdcbcc' ? 'auto' : 'pointer',
                fontSize: 14
            }}
        >
            {name}
        </div>
    )
}

export default ECGridMapObject