
import { Link } from 'react-router-dom'
import LocalStyle from '../../style.module.css'
import { useTheme } from '@shared/hooks/useTheme'
import { FC, useState } from 'react'
import { LinkArrSing } from '@containers/settings/layout/LayoutSettings'
import { getURL } from '@shared/utils/nav'

interface SubMenuProps {
    link: LinkArrSing
    width?: number,
    checkChildren: (index: number, link: string) => void,
    parentIndex: number,
    maketsAllowed?: number[] | 0
}

const SubMenu: FC<SubMenuProps> = (props) => {

    const theme = useTheme()

    const { link, width, checkChildren, parentIndex, maketsAllowed } = props

    const [hoverItemChildren, setHoverItemChildren] = useState<number | null>(null)

    const children =  maketsAllowed ? 
        link?.children.filter(item => maketsAllowed.includes(item.id)) :
        link?.children

    
    return (
        <div 
            style={{ left: width ?  width - 35 : 45, zIndex: 1000000 }}
            className={LocalStyle.SubMenu_wrapper} 
        >
            <div className={LocalStyle.SubMenu_content}>
                {
                    children.map((item, i) => {
                    
                        return (
                            <Link
                                key={`link-to-${i}`}
                                className={LocalStyle.SubMenu_link}
                                style={{
                                    position: item?.children?.length ? 'relative' : 'static',
                                    backgroundColor: item?.isActive || hoverItemChildren === i
                                        ? theme.layout.siderMenu.items.background?.active
                                        : theme.layout.siderMenu.items.background?.inactive,
                                }}
                                to={getURL(item.to === '' ? location.pathname : item.to, 'showcase')}
                                target={item?.target}
                                onClick={() => checkChildren(parentIndex, item.to)}
                                onMouseEnter={() => {
                                    setHoverItemChildren(i)
                                }}
                                onMouseLeave={() => {
                                    setHoverItemChildren(null)
                                }}
                            >
                                {item.title}
                                {/* {!!item?.children && Array.isArray(item?.children) && hoverItemChildren == index &&(
                                <SubMenu link={item} width={newWidth} checkChildren={checkChildren} />
                            )} */}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SubMenu