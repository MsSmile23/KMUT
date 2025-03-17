import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ICustomTreeNode } from './treeTypes'
import { getStateViewParam } from '@shared/utils/states'
import { StateText } from '@entities/states/StateLabels'
import { ECTooltip } from '@shared/ui/tooltips'
import { getURL } from '@shared/utils/nav'

export const CustomTreeNode: FC<ICustomTreeNode> = ({ name, id, icon, state, styles }) => {

    const fill = getStateViewParam(state, 'fill') ?? '#000000'
    const textColor = getStateViewParam(state, 'textColor')
    // const border = getStateViewParam(state, 'border')
    // const stateIcon = getStateViewParam(state, 'icon') as IInputIcon['icon']

    return (
        <Link 
            to={getURL(`${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}`, 'showcase')} 
            // to={`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}`} 
            style={{
                textDecoration: 'none',
                color: fill,
                height: 20,
                ...styles
            }}
        >
            <ECTooltip
                // title={id}
                // title={name + ' - ' + (state.view_params?.name ?? 'Не определено')}
                placement="right"
                color={fill}
            // color={textColor}
            >
                <StateText
                    state={state}
                    styles={{
                        flex: 1,
                        overflowX: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}
                    icon={{
                        enabled: true,
                        name: icon ?? 'FileOutlined',
                        style: {
                            // display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            marginLeft: '-20px',
                            height: 20,
                            marginRight: '5px',
                            // color: fill
                            color: textColor
                        }
                    }}
                >
                    {name}
                </StateText>
            </ECTooltip>
        </Link>
    )
}