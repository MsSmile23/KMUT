import { FC, PropsWithChildren, ReactNode } from 'react';
import { Button } from 'antd';
import { wrapperBaseSize, buttonsData, buttonsMnemo } from './data';
import { IObjectAttribute } from '@shared/types/objects';
import { ECTooltip } from '@shared/ui/tooltips';
import './objectAttributeHistoryWrapper.css'
import { stateViewParamsDefault } from '@shared/utils/states';

const ObjectAttributeHistoryWrapper: FC<PropsWithChildren<{
    title?: string
    isSkeleton?: boolean
    wrapperFontSize?: string,
    buttons?: typeof buttonsData
    // buttonsMnemoFilter?: typeof buttonsMnemo[number][]
    toolbarButtons?: ReactNode[],
    objectAttribute?: IObjectAttribute
    stateParams?: {
        color?: string
        borderColor?: string
        textColor?: string
    }
}>> = ({
    title,
    isSkeleton,
    wrapperFontSize = wrapperBaseSize,
    buttons = buttonsMnemo,
    // buttonsMnemoFilter = buttonsMnemo,
    toolbarButtons = [],
    objectAttribute,
    stateParams,
    ...props
}) => {
    const renderButtons = buttons 
        ? buttons
        : buttonsData.filter( buttonData =>
            buttonsMnemo.includes(buttonData.mnemo)
            // buttonsMnemoFilter.includes(buttonData.mnemo)
        )

    const wrapperTitle = (title) ?? `${objectAttribute?.attribute?.name ?? ''} ${objectAttribute?.id ?? ''}`

    return (
        <div
            className={isSkeleton ? 'skeleton' : ''}
            style={{
                backgroundColor: stateParams?.color ?? '#cccccc',
                borderColor: stateParams?.borderColor ?? '#cccccc',
                color: stateParams?.textColor ?? '#000000',
                borderRadius: wrapperFontSize,
                padding: wrapperFontSize,
            }}
        >

            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 5,
                        height: 40,
                        width: '100%',
                        marginTop: `-${wrapperFontSize}`,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'start',
                            flex: 1,
                            marginLeft: 10,
                            marginRight: 10,
                            fontWeight: 'bold',
                            fontSize: 16,
                            minWidth: '100px',
                            color: stateParams?.color === stateViewParamsDefault.fill 
                                ? '#333333'
                                // ? '#000000'
                                : '#ffffff'
                        }}
                    >
                        <span
                            style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                        >
                            <ECTooltip title={wrapperTitle} placement="topLeft">
                                {wrapperTitle}
                            </ECTooltip>
                        </span>
                    </div>
                    {renderButtons.map((button, idx) => {
                    // {buttons.map((button, idx) => {
                        return (
                            <ECTooltip key={title + button.mnemo + idx} title={button.label} placement="topLeft" >
                                <Button
                                    size="small"
                                    shape="circle"
                                    onClick={button.onClick}
                                    // onClick={() => button.onClick( { title, children: props.children })}
                                >
                                    {button.icon}
                                </Button>
                            </ECTooltip>
                        )
                    })}
                    {toolbarButtons.map( (button, idx) => {
                        return (
                            <div key={title + 'button' + idx}>{button}</div>
                        )}
                    )}
                </div>
            </div>
            { props.children }
        </div >
    )
}

export default ObjectAttributeHistoryWrapper;