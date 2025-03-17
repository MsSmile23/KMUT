import AlignLeft from '../Toolbar/toolbaricons/align-left.svg'
import AlignCenter from '../Toolbar/toolbaricons/align-center.svg'
import AlignRight from '../Toolbar/toolbaricons/align-right.svg'
import Bold from '../Toolbar/toolbaricons/bold.png'
import Italic from '../Toolbar/toolbaricons/italic.png'
import Underline from '../Toolbar/toolbaricons/underline.png'
import { FC } from 'react'

interface IconProps {
    icon: string
  }

const iconList = {
    alignLeft: AlignLeft,
    alignCenter: AlignCenter,
    alignRight: AlignRight,
    bold: Bold,
    italic: Italic,
    underline: Underline,
}

const ToolbarIcon: FC <IconProps> = (props) => {
    const { icon } = props

    return (
        <img src={iconList[icon]} width={15} height={15} alt={icon} />
    )
}

export default ToolbarIcon