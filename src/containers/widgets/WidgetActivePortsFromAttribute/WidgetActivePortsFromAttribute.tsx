import { FC, useMemo, useState } from 'react'
import { TWidgetSettings } from '../widget-types'
import { useObjectsStore } from '@shared/stores/objects'
import PortCardView from './PortCardView'
import { MLGetObjectAttributeByBind } from '@shared/lib/MLKit/MLKit'
import { PortInfo } from './utils'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

export interface WidgetActivePortsFromAttributeProps {
    activePortColor: string
    backgroundColor: string
    disablePortColor: string
    otherPortColor: string
    portCardColor: string
    representation: string
    selectAttribute: number
    widgetId: string
    noPortText: string
}

const statuses = ['open', 'close', 'filtered', 'unfiltered', 'open|filtered', 'closed|filtered']

const validateData = (data) => {
    return (
        Array.isArray(data) &&
        data?.length > 0 &&
        data.every(
            (port: PortInfo) =>
                typeof port.proto === 'string' &&
                typeof port.port === 'string' &&
                statuses.includes(port.state) &&
                typeof port.service === 'string' &&
                Object.keys(port).length == 4
        )
    )
}

const WidgetActivePortsFromAttribute: FC<TWidgetSettings<WidgetActivePortsFromAttributeProps>> = (props) => {
    const { settings } = props
    const { widget, baseSettings } = settings

    const objectId = settings?.vtemplate?.objectId
    const selectedAttrId = widget?.selectAttribute
    const noPortText = widget?.noPortText
    const [isValid, setIsValid] = useState(false)
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const getPortColor = (state) => {
        if (state === 'open') {
            return widget?.activePortColor
        }

        if (state === 'close') {
            return widget?.disablePortColor
        }

        return widget?.otherPortColor
    }

    const discovery = useMemo(() => {
        const objectAttributes = useObjectsStore.getState().getObjectById(objectId).object_attributes

        const attributeValue = MLGetObjectAttributeByBind({
            objectAttributeBindProps: { attribute_id: selectedAttrId },
            objectAttributes,
        })?.data?.attribute_value

        try {
            const parsedData = attributeValue && JSON.parse(attributeValue)

            if (validateData(parsedData)) {
                setIsValid(true)

                return parsedData
            } else {
                console.error('Недопустимый формат данных')

                return null
            }
        } catch (error) {
            console.error('Ошибка при разборе JSON:', error)

            return null
        }
    }, [objectId, selectedAttrId])

    return discovery && discovery?.length > 0 ? (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: backgroundColor,
                padding: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 20,
            }}
        >
            {isValid ? (
                discovery.map((port, idx) => {
                    return (
                        <PortCardView
                            key={idx}
                            portInfo={port}
                            portColor={getPortColor(port.state)}
                            cardColor={widget?.portCardColor}
                        />
                    )
                })
            ) : (
                <>Недопустимый формат данных или их отсутствие</>
            )}
            {}
        </div>
    ) : (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {noPortText ?? ''}
        </div>
    )
}

export default WidgetActivePortsFromAttribute