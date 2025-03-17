import { useStatesStore } from '@shared/stores/states';
import { ECTooltip } from '@shared/ui/tooltips';
import { getStateViewParamsWithDefault } from '@shared/utils/states';
import { Typography } from 'antd';
import { CSSProperties, FC, PropsWithChildren } from 'react';

interface IStateTab extends PropsWithChildren {
    id?: number
    style?: CSSProperties
    onClick?: () => void,
    showStateName?: boolean
}

export const StateTab: FC<IStateTab> = ({
    id,
    style,
    onClick,
    children,
    showStateName = false
}) => {
    const state = useStatesStore((st) => st.store.data.find((el) => el.id === id))
    const viewParams = getStateViewParamsWithDefault(state)

    return (
        <ECTooltip title={viewParams.name} color={viewParams.textColor}>
            <Typography.Text
                style={{
                    display: 'flex',
                    borderRadius: 4,
                    padding: 8,
                    margin: '1px 0',
                    color: viewParams?.textColor,
                    backgroundColor: viewParams?.fill,
                    border: `1px solid ${viewParams?.border}`,
                    userSelect: 'none',
                    cursor: onClick ? 'pointer' : 'default',
                    ...style
                }}
                onClick={onClick}
            >
                { showStateName ? viewParams.name : children }
            </Typography.Text>
        </ECTooltip>
    )
}