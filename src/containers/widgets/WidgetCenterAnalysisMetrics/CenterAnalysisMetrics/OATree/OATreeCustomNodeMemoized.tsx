import { IManageMetricsReturn } from '../useManageMetrics'
import { ECTooltip } from '@shared/ui/tooltips'
import { PlusOutlined } from '@ant-design/icons'
import { TObjectWithOAAttributesSet } from '../cam.types'
import { CSSProperties, FC, memo, PropsWithChildren } from 'react'
import { Popover } from 'antd'
import { BaseButton } from '@shared/ui/buttons'
import { getPriorityState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { StateLabel } from '@entities/states'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
// import { useStateStereotypesStore } from '@shared/stores/statesStereotypes'
// import { useStatesStore } from '@shared/stores/states'
// import { useStateEntitiesStore } from '@shared/stores/state-entities'

interface INodeSettings extends React.CSSProperties {}
interface INodeTitleSettings extends React.CSSProperties {
    shortTitle?: boolean
}
interface INodeStateSettings extends React.CSSProperties {}
interface INodeButtonSettings extends React.CSSProperties {}

export interface IVisualSettings {
    node?: INodeSettings
    title?: INodeTitleSettings
    state?: INodeStateSettings
    button?: INodeButtonSettings
}
interface IOATreeCustomNodeProps {
    id: number
    objectId: number
    name: string
    handleActiveOAid: IManageMetricsReturn['methods']['handleActiveOAid']
    multigraphActiveIds: TObjectWithOAAttributesSet['multigraph']
    graphActiveIds: TObjectWithOAAttributesSet['graph']
    nodeWidth?: number
    attrValue?: string
    visualSettings?: IVisualSettings
}
type TComparePropsFn = (prevProps: IOATreeCustomNodeProps, nextProps: IOATreeCustomNodeProps) => boolean

const OATreeCustomNode: FC<IOATreeCustomNodeProps> = ({
    id,
    objectId,
    name,
    handleActiveOAid,
    graphActiveIds,
    multigraphActiveIds,
    nodeWidth,
    attrValue,
    visualSettings,
}) => {
    const shortenTitle = visualSettings?.title?.shortTitle
        ? {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        }
        : {}

    const priorState = getPriorityState('object_attributes', [id])
    const viewParams = getStateViewParamsWithDefault(priorState)
    const title = `${name} [${id}]`

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const color = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                // alignItems: 'start',
                alignItems: 'center',
                width: '100%',
                gap: 12,
                ...visualSettings?.node,
                // color: viewParams.textColor,
                // backgroundColor: viewParams.fill,
                // borderColor: viewParams.border,
            }}
        >
            <span
                style={{
                    display: 'flex',
                    flex: 1,
                }}
            >
                <ECTooltip
                    // title={`${name} [${id}]`}
                    title={title ? `${title} - ${viewParams?.name}` : viewParams?.name}
                    placement="topLeft"
                    color={viewParams.fill}
                    overlayInnerStyle={{
                        color: '#000000',
                    }}
                >
                    <span
                        style={{
                            ...shortenTitle,
                            width: `calc(${nodeWidth}px - 0px)`,
                            color: viewParams.fill === '#fafafa' ? color ?? '#000000' : viewParams.fill,
                        }}
                    >
                        {name}
                    </span>
                </ECTooltip>
            </span>
            <StateLabel
                state={priorState}
                wrapperStyles={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '14px',
                    fontSize: 10,
                    width: '100px',
                    ...visualSettings?.state,
                }}
            >
                {/* Недоступность */}
                {attrValue}
            </StateLabel>
            <ButtonWrapper
                customStyle={{
                    ...visualSettings?.button,
                }}
                onClick={() =>
                    handleActiveOAid({
                        chartZone: 'graph',
                        id,
                        objectId,
                    })}
            >
                <ECTooltip
                    title={
                        graphActiveIds?.findIndex((arrEl) => arrEl.oaId === id) > -1
                            ? 'Удалить измерение из зоны одиночных графиков'
                            : 'Добавить измерение в зону одиночных графиков'
                    }
                >
                    {graphActiveIds?.findIndex((arrEl) => arrEl.oaId === id) > -1 ? (
                        <ECIconView
                            icon="FiPlus"
                            style={{
                                transform: 'rotate(45deg)',
                                color: 'red',
                            }}
                        />
                    ) : (
                        <ECIconView
                            icon="FiChevronRight"
                            style={{
                                color: 'rgb(44, 160, 207)',
                            }}
                        />
                    )}
                </ECTooltip>
            </ButtonWrapper>
            {multigraphActiveIds?.some((arr) => arr?.findIndex((arrEl) => arrEl.oaId === id) > -1) ? (
                <ButtonWrapper
                    onClick={() =>
                        handleActiveOAid({
                            chartZone: 'multigraph',
                            id,
                            objectId,
                        })}
                >
                    <ECTooltip title="Удалить измерение из мультиграфика">
                        <ECIconView
                            icon="FiPlus"
                            style={{
                                transform: 'rotate(45deg)',
                                color: 'red',
                            }}
                        />
                    </ECTooltip>
                </ButtonWrapper>
            ) : (
                <Popover
                    content={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            {multigraphActiveIds.map((mg, mgIdx) => {
                                if (mg.length > 0) {
                                    return (
                                        <BaseButton
                                            key={mg.join('-')}
                                            // type="primary"
                                            title={`Добавить на текущий мультиграфик ${mgIdx + 1}`}
                                            onClick={() =>
                                                handleActiveOAid({
                                                    chartZone: 'multigraph',
                                                    id,
                                                    objectId,
                                                    idx: mgIdx,
                                                })}
                                        >
                                            Зона {mgIdx + 1}
                                        </BaseButton>
                                    )
                                }
                            })}
                            {!multigraphActiveIds?.some((arr) => arr?.findIndex((arrEl) => arrEl.oaId === id) > -1) && (
                                <BaseButton
                                    // type="primary"
                                    title="Добавить на новый мультиграфик"
                                    onClick={() =>
                                        handleActiveOAid({
                                            chartZone: 'multigraph',
                                            id,
                                            objectId,
                                            idx: multigraphActiveIds.length,
                                        })}
                                >
                                    <PlusOutlined />
                                </BaseButton>
                            )}
                        </div>
                    }
                    title="Добавить на мультиграфик"
                    trigger="click"
                    style={{
                        width: 150,
                    }}
                >
                    <ButtonWrapper>
                        <ECTooltip title="Добавить измерение на мультиграфик" placement="bottomLeft">
                            <ECIconView
                                icon="FiChevronsRight"
                                style={{
                                    // width: 10,
                                    // height: 10,
                                    color: 'rgb(44, 160, 207)',
                                }}
                            />
                            {/* <DoubleRightOutlined 
                                    style={{
                                        width: 10,
                                        height: 10,
                                        color: 'rgb(44, 160, 207)',
                                    }}
                                /> */}
                        </ECTooltip>
                    </ButtonWrapper>
                </Popover>
            )}
        </div>
    )
}

const ButtonWrapper: FC<
    PropsWithChildren<{
        customStyle?: CSSProperties
        onClick?: () => void
    }>
> = ({ children, onClick, customStyle }) => (
    <span
        style={{
            width: '24px',
            height: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(201, 234, 248)',
            borderRadius: 2,
            ...customStyle,
        }}
        onClick={onClick}
    >
        {children}
    </span>
)

const compareFn: TComparePropsFn = (prevProps, nextProps) => {
    return (
        prevProps.graphActiveIds.join('-') === nextProps.graphActiveIds.join('-') &&
        prevProps.multigraphActiveIds.join('-') === nextProps.multigraphActiveIds.join('-') &&
        prevProps.id === nextProps.id &&
        prevProps.objectId === nextProps.objectId &&
        prevProps.name === nextProps.name &&
        prevProps.nodeWidth === nextProps.nodeWidth
    )
}
const OATreeCustomNodeMemoized = memo(OATreeCustomNode, compareFn)
// const OATreeCustomNodeMemoized = memo(OATreeCustomNode)

export default OATreeCustomNodeMemoized