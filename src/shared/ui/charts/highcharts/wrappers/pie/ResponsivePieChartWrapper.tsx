import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { selectObject, useObjectsStore } from '@shared/stores/objects'
import { Slider } from 'antd'
import { useState } from 'react'

export const ResponsivePieChartWrapper = () => {
    const getObject = useObjectsStore(selectObject)
    const object = getObject(10177)
    const [dimensions, setDimensions] = useState({
        width: 200,
        height: 300,
    })
    
    const containerPadding = 10
    const props: typeof forumThemeConfig.build.deviceStatuses.chart & { width: number } = {
        ...forumThemeConfig.build.deviceStatuses.chart,
        height: dimensions.height - containerPadding * 2,
        width: dimensions.width - containerPadding * 2,
    }

    const handleBarChange = (type: 'width' | 'height', value: number) => {
        setDimensions(state => ({
            ...state,
            [type]: value,
        }))
    }

    return (
        <>
            Height
            <Slider 
                defaultValue={dimensions.height}
                min={100}
                max={(600)}
                tooltip={{ open: true }} 
                onChange={(value: number) => handleBarChange('height', value)}
            />  
            Width
            <Slider 
                defaultValue={dimensions.width}
                min={100}
                max={(600)}
                tooltip={{ open: true }} 
                onChange={(value: number) => handleBarChange('width', value)}
            />  
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: dimensions.width,
                    height: dimensions.height,
                    padding: containerPadding,
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                    borderRadius: 20,
                    backgroundColor: 'skyblue',
                    overflow: 'hidden',
                }}
            >
                <ObjectLinkedShares 
                    parentObject={object}
                    {...props}
                />
            </div>
        </>
    )
}