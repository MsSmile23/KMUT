import { FC } from 'react'

export const ObjectTableCell: FC<{ 
    item: { id: number }, 
    title?: string | ((obj: { id: number }) => string)
    onClick: (id: number) => void
}> = ({ item, title, onClick }) => (
    <div onClick={() => { onClick(item?.id)}} style={{ cursor: 'pointer' }}>
        {typeof title === 'function' ? title?.(item) : title}
    </div>
)