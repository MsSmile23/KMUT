import { IManageMetricsReturn } from '../useManageMetrics'
import { ECTooltip } from '@shared/ui/tooltips'
import { CaretRightOutlined, CloseOutlined, ForwardOutlined, PlusOutlined } from '@ant-design/icons'
import { TObjectWithOAAttributesSet } from '../cam.types'
import { FC } from 'react'
import { Popover } from 'antd'
import { BaseButton } from '@shared/ui/buttons'
import { getStateViewParamsWithStereotype } from '@shared/utils/states'

export const OATreeCustomNode: FC<{
    id: number
    objectId: number
    classId: number
    name: string 
    handleActiveOAid: IManageMetricsReturn['methods']['handleActiveOAid']
    multigraphActiveIds: TObjectWithOAAttributesSet['multigraph']
    // multigraphActiveIds: TObjectAttributesSet['multigraph']
    graphActiveIds: TObjectWithOAAttributesSet['graph']
    // graphActiveIds: TObjectAttributesSet['graph']
    viewParams: ReturnType<typeof getStateViewParamsWithStereotype>
}> = ({
    id,
    objectId,
    // classId,
    name,
    handleActiveOAid,
    graphActiveIds,
    multigraphActiveIds,
    viewParams
}) => {
    // console.log('multigraphActiveIds', multigraphActiveIds)
    const title = `${name} [${id}]`

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                // color: viewParams.textColor,
                // backgroundColor: viewParams.fill,
                // borderColor: viewParams.border,
            }}
        >
            <span
                style={{
                    width: '16px',
                }}
                onClick={() => handleActiveOAid({
                    chartZone: 'graph', 
                    id,
                    objectId
                })}
            >
                <ECTooltip 
                    title={graphActiveIds?.findIndex(arrEl => arrEl.oaId === id) > -1 
                        ? 'Удалить измерение из зоны одиночных графиков' 
                        : 'Добавить измерение в зону одиночных графиков'}
                >
                    {graphActiveIds?.findIndex(arrEl => arrEl.oaId === id) > -1
                        ? (
                            <CloseOutlined 
                                style={{
                                    color: 'red'
                                }} 
                            />
                        )
                        : (
                            <CaretRightOutlined 
                                style={{
                                    color: '#188EFC'
                                }}    
                            />)}
                </ECTooltip>
            </span>
            {multigraphActiveIds?.some(arr => arr?.findIndex(arrEl => arrEl.oaId === id) > -1) 
                ? (
                    <ECTooltip 
                        title="Удалить измерение из мультиграфика"
                    >
                        <CloseOutlined 
                            style={{
                                color: 'red'
                            }} 
                            onClick={() => handleActiveOAid({
                                chartZone: 'multigraph', 
                                id,
                                objectId
                            })}
                        />
                    </ECTooltip>
                )
                : (
                    <Popover 
                        content={(
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 10
                                }}
                            >
                                {multigraphActiveIds.map((mg, mgIdx) => {
                                    if (mg.length > 0) {
                                        return (
                                            <BaseButton
                                                key={mg.join('-')} 
                                                // type="primary" 
                                                title={`Добавить на текущий мультиграфик ${mgIdx + 1}`}
                                                onClick={() => handleActiveOAid({
                                                    chartZone: 'multigraph', 
                                                    id,
                                                    objectId,
                                                    idx: mgIdx
                                                })}
    
                                            >
                                                Зона {mgIdx + 1}
                                            </BaseButton>
                                        )
                                    }
                                })}
                                {!multigraphActiveIds?.some(arr => arr?.findIndex(arrEl => arrEl.oaId === id) > -1) && (
                                    <BaseButton
                                        // type="primary" 
                                        title="Добавить на новый мультиграфик"
                                        onClick={() => handleActiveOAid({
                                            chartZone: 'multigraph', 
                                            id,
                                            objectId,
                                            idx: multigraphActiveIds.length
                                        })}
                                    >
                                        <PlusOutlined />
                                    </BaseButton>
                                )}
                            </div>
                        )} 
                        title="Добавить на мультиграфик"
                        trigger="click"
                        style={{
                            width: 150
                        }}
                    >
                        <span
                            style={{
                                width: '16px',
                            }}
                        >
                            <ECTooltip 
                                title="Добавить измерение на мультиграфик"
                                placement="bottomLeft"
                            >
                                <ForwardOutlined 
                                    style={{
                                        color: '#188EFC'
                                    }}
                                />
                            </ECTooltip>
                        </span>
                    </Popover>    
                )}
            <span
                style={{
                    display: 'flex',
                    flex: 1,
                }}
            >
                <ECTooltip 
                    // title={`${name} [${id}]`}
                    title={title ? `${title} - ${viewParams.name}` : viewParams.name}
                    placement="topLeft"
                    color={viewParams.fill}
                    overlayInnerStyle={{
                        color: '#000000'
                    }}
                >   
                    <span
                        style={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            width: 'calc(100% - 0px)',
                            color: viewParams.fill === '#fafafa'
                                ? '#000000'
                                : viewParams.fill,
                        }}
                    >
                        {name}
                    </span>
                </ECTooltip>
            </span>
        </div>
    )
}