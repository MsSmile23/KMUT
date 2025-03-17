import { ECTooltip } from '@shared/ui/tooltips'
import { getStateViewParamsWithStereotype } from '@shared/utils/states'
import { FC } from 'react'

export const OATreeCustomTitle: FC<{ 
    title: string
    viewParams: ReturnType<typeof getStateViewParamsWithStereotype>
}> = ({ title, viewParams }) => {
    return (
        <ECTooltip 
            // title={title}
            title={title ? `${title} - ${viewParams.name}` : viewParams.name}
            // color={viewParams.fill}
            // overlayInnerStyle={{
            //     color: '#000000'
            // }}
            placement="topLeft"
        >
            <span
                style={{
                    display: 'flex',
                    flex: 1,
                    // color: viewParams.textColor,
                    // backgroundColor: viewParams.fill,
                    // borderColor: viewParams.border,
                }}
            >
                <span
                    style={{
                        overflowX: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        // width: '400px',
                        width: 'calc(95% - 0px)',
                    }}
                >
                    {title}
                </span>
            </span>
        </ECTooltip>
    )
}