import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { FC } from 'react'

interface WidgetStatusMainProps {
    settings: {
        widget: any,
        view: any
    }
}

const WidgetStatusMain: FC<WidgetStatusMainProps> = (props) => {

    return (
        <ObjectLinkedShares
            {...forumThemeConfig.main.deviceStatuses.chart}
            {...props}
        />
    )
}

export default WidgetStatusMain