import { ECTooltip } from '@shared/ui/tooltips'
import { getPriorityState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { FC, memo } from 'react'
import { IVisualSettings } from './OATreeCustomNodeMemoized'

interface IOATreeCustomTitleProps {
    title: string
    titleWidth?: number
    id: number
    visualSettings?: IVisualSettings['title']
    isClass?: boolean
}

type TComparePropsFn = (prevProps: IOATreeCustomTitleProps, nextProps: IOATreeCustomTitleProps) => boolean
const OATreeCustomTitle: FC<IOATreeCustomTitleProps> = ({ 
    title, titleWidth, id, visualSettings, isClass
}) => {
    const shortenTitle = visualSettings?.shortTitle
        ? {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        } : {}

    const priorState = getPriorityState('objects', [id])
    const viewParams = isClass
        ? {
            fill: '#000000',
            name: ''
        }
        : getStateViewParamsWithDefault(priorState)

    return (
        <ECTooltip 
            // title={title}
            title={title ? `${title} - ${viewParams.name}` : viewParams.name}
            color={viewParams.fill}
            overlayInnerStyle={{
                color: '#000000'
            }}
            placement="topLeft"
        >
            <span
                style={{
                    display: 'flex',
                    flex: 1,
                    color: viewParams.fill === '#fafafa'
                        ? '#000000'
                        : viewParams.fill,
                    // color: viewParams.textColor,
                    // backgroundColor: viewParams.fill,
                    // borderColor: viewParams.border,
                }}
            >
                <span
                    style={{
                        ...shortenTitle,
                        width: `calc(${titleWidth}px - 0px)`,
                    }}
                >
                    {title}
                </span>
            </span>
            {/* <span style={{}}>
                {statuses?.map((status, idx) => {
                    return (
                        <StateLabel
                            key={status.state.id ?? idx + status.state?.view_params?.name}
                            state={status.state}
                            wrapperStyles={{ lineHeight: '11px' }}
                        >
                            {status.count}
                        </StateLabel>
                    )
                })}
            </span> */}
        </ECTooltip>
    )
}

const comparingFn: TComparePropsFn = (prevProps, nextProps) => {
    return prevProps.title === nextProps.title &&
        prevProps.titleWidth === nextProps.titleWidth
}

const OATreeCustomTitleMemoized = memo(OATreeCustomTitle, comparingFn)

export default OATreeCustomTitleMemoized