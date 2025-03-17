import { FC } from 'react'

import { ButtonDelete } from '@shared/ui/buttons'

interface IAttributeCategoriesDeleteButton {
    onClick?: React.MouseEventHandler<HTMLAnchorElement> &
        React.MouseEventHandler<HTMLButtonElement>
}

const AttributeCategoriesDeleteButton: FC<IAttributeCategoriesDeleteButton> = ({
    onClick,
}) => {
    return <ButtonDelete shape="circle" text={false} onClick={onClick ? onClick : () => null} />
}

export default AttributeCategoriesDeleteButton