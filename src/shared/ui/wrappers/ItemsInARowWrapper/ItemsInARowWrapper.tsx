import { useWindowResizeCallback } from '@shared/hooks/useWindowResizeCallback'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { FC, PropsWithChildren, useEffect, useRef } from 'react'

/**
* @name ItemsInARowWrapper - предоставляет возможность поделить подаваемые блоки в ряд
* @param itemsInRow - количество блоков в ряду
* @param itemsGap - gap между блоками
* @param getDimensions - функция, которая записывает в стейт родителя ширину и высоту контейнера
*/

export const ItemsInARowWrapper: FC<PropsWithChildren<{
    itemsInRow: number
    itemsGap: number
    getDimensions?: ({
        width,
        height,
    }: {
        width: number,
        height: number
    }) => void
}>> = ({ children, itemsInRow, itemsGap, getDimensions }) => {
    const debug = false
    const windowSizes = useWindowResizeCallback()
    const { dataLayout } = useLayoutSettingsStore()
    const width = itemsInRow > 1 
        ? `calc((100% - ${itemsGap}px * ${itemsInRow + 2})/ ${itemsInRow})`
        : '100%'
    const wrapperRef = useRef<HTMLDivElement>(null)    

    debug && console.log('item width', width)
    debug && console.log('wrapperRef.current.clientWidth', wrapperRef?.current?.clientWidth)
    debug && console.log('wrapperRef.current.clientHeight', wrapperRef?.current?.clientHeight)

    useEffect(() => {
        if (wrapperRef.current.clientWidth !== 0 && wrapperRef.current.clientHeight !== 0) {
            getDimensions({ 
                width: wrapperRef.current.clientWidth,
                height: wrapperRef.current.clientHeight
            })
        }
    }, [
        itemsInRow,
        windowSizes.width,
        windowSizes.height,
        dataLayout.leftSidebar?.visibility,
        dataLayout.rightSidebar?.visibility,
    ])
    
    return (
        <div
            ref={wrapperRef}
            style={{
                width: width,
                // height: '100%',
                borderRadius: `${itemsGap}px`,
                // backgroundColor: '#fff',
                // backgroundColor: '#DFE3EB',
                padding: `
                    ${itemsGap}px
                    0px
                    ${itemsGap}px
                    ${itemsGap}px
                `,
                // padding: `${itemsGap}px`,
                // boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            }}
        >
            {children}
        </div>

    )
}