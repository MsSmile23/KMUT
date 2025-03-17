
import { FC } from 'react'
import { ButtonAdd } from '@shared/ui/buttons'

interface IAttributeCategoriesAddButton {
    onClick?: React.MouseEventHandler<HTMLAnchorElement> &
        React.MouseEventHandler<HTMLButtonElement>
}
const AttributeCategoriesAddButton: FC<IAttributeCategoriesAddButton> = ({ onClick }) => {
    return <ButtonAdd shape="circle" text={false} onClick={onClick ? onClick : () => null} />
}

export default AttributeCategoriesAddButton