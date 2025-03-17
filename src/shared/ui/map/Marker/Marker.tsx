import { FC, useEffect, useState } from 'react'
import { CircleMarker, Popup } from 'react-leaflet'
interface IMarker {
    marker: any
}
export const Marker: FC<IMarker> = ({ marker }) => {
    const [content, setContent] = useState<any>(null)

    useEffect(() => {
        setContent(marker)
    }, [marker])

    return (
        <>
            {/* {console.log("цвета", marker.color, marker)} */}
            {content !== null && (
                <CircleMarker
                    center={[content.geometry.coordinates[1], content.geometry.coordinates[0]]}
                    //@ts-ignore
                    radius={8}
                    fillColor={content.color}
                    fillOpacity={1}
                    //@ts-ignore
                    color={content.color}
                    interactive={true}
                    pane="markerPane"
                    eventHandlers={{
                        mouseover: (e) => {
                            e.target.openPopup()
                        },
                        mouseout: (e) => {
                            e.target.closePopup()
                        },
                    }}
                >
                    <Popup>
                        <>
                            {content?.customTooltip ? (
                                
                                <div>
                                    {Object.keys(content.customTooltip).map((item) => {
                                        return (
                                            <>
                                                {' '}
                                                {item} <br /> {content.customTooltip[item]} <br />
                                            </>
                                        )
                                    })}
                                </div>
                                
                            ) : (
                                <>
                                    {' '}
                                    {content.title} <br /> {content.ip}
                                </>
                            )}
                            {/* {content.title} <br /> {content.ip} */}
                        </>
                    </Popup>
                </CircleMarker>
            )}
        </>
    )
}