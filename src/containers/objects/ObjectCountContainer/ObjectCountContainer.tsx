import { objectsStore, selectObjects } from '@shared/stores/objects'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Col, Row, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { Image } from 'antd'
import { useGetObjects } from '@shared/hooks/useGetObjects'

const { Text } = Typography

export interface IObjectCountContainer {
    title?: string
    icon?: IECIconView['icon']
    // todo: объединить с icon
    image?: {
        src: string
        width: string | number
    }
    textSize?: string
    indent?: string
    filters?: {
        mnemo: 'class_id'
        value: any[]
    }
    color?: string
    apiValue?: {
        func: (args?: any) => Promise<any>
        payload?: Record<string, any>
        key: string
    }
}
const ObjectCountContainer: FC<IObjectCountContainer> = ({
    title,
    icon,
    image,
    textSize,
    indent,
    filters,
    color,
    apiValue,
}) => {
    const objects = useGetObjects()

    const [countObjects, setCountObjects] = useState<number>(0)

    const [backendValue, setBackendValue] = useState<number>(0)

    useEffect(() => {
        if (apiValue === undefined) {
            return
        }

        apiValue.func(apiValue.payload).then((response) => {
            if (response?.success) {
                console.log('response.data', response.data)

                setBackendValue(response.data[apiValue?.key])
            }
        })
    }, [apiValue === undefined])

    useEffect(() => {
        if (filters.mnemo == 'class_id' && filters?.value !== undefined) {
            if (filters?.value?.length == 0) {
                setCountObjects(objects.length)
            } else {
                setCountObjects(objects.filter((obj) => filters?.value?.includes(obj.class_id))?.length)
            }
        }
    }, [filters, objects])


    return (
        <Col
            style={{
                marginRight: '7px',
                marginLeft: '7px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                maxWidth: '100%',
                width: '100%',
            }}
        >
            {title && (
                <Text
                    style={{
                        margin: '0',
                        fontSize: `${textSize ?? '16'}px`,
                        marginBottom: `${indent ?? '20'}px`,
                        minHeight: '50px',
                    }}
                >
                    {title.split(/\r?\n|\r|\n/g)?.map((title, idx) => {
                        return (
                            <div key={'title' + idx}>
                                {title}
                                <br />
                            </div>
                        )
                    })}
                </Text>
            )}

            <Row align="middle" justify="space-around">
                <Col span={18}>
                    <span
                        style={{
                            fontSize: '32px',
                            color: color ?? '#000000',
                            margin: '0px',
                            fontWeight: '700',
                        }}
                    >
                        {apiValue ? `${backendValue}` : countObjects}
                    </span>
                </Col>

                <Col style={{ display: 'flex', justifyContent: 'end', height: 62 }} span={6}>
                    {icon && (
                        <span
                            style={{
                                fontSize: '40px',
                                color: color ?? '#000000',
                                margin: '0',
                            }}
                        >
                            <ECIconView icon={icon} style={{ color: color ?? '#000000' }} />
                        </span>
                    )}
                    {image && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Image preview={false} src={image.src} width={image.width} />
                        </div>
                    )}
                </Col>
            </Row>
        </Col>
    )
}

export default ObjectCountContainer