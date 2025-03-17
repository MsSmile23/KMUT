import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import { StateText } from '@entities/states';
import { useAttributesStore } from '@shared/stores/attributes';
import { useStateEntitiesStore } from '@shared/stores/state-entities';
import { useStatesStore } from '@shared/stores/states';
import { IObjectAttribute } from '@shared/types/objects';
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { FC, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CSSProperties } from 'react';
import { objectsStore, selectObjects } from '@shared/stores/objects';
import { getLocalTimeFromUTC } from '@shared/utils/datetime';
import { getURL } from '@shared/utils/nav';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { useTheme } from '@shared/hooks/useTheme';
import MLKit from '@shared/lib/MLKit';
import _ from 'lodash';
import OAJSONShortView from '@entities/object-attributes/OAJSONShortView/OAJSONShortView';
import { useGetObjects } from '@shared/hooks/useGetObjects';

interface IOAViewProps {
    objectAttribute: IObjectAttribute
    enableStateText?: boolean
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
    style?: CSSProperties
    props?: {
        [key: string]: any
    };
}

export const OAView: FC<IOAViewProps> = memo(({
    objectAttribute,
    enableStateText,
    onClick,
    style,
    props
}) => {

    const objects = useGetObjects()
    const theme = useTheme()
    const objectAttributeAttributeFieldValue = useAttributesStore((st) => st?.store?.data?.find((attr) => {
        return attr.id === objectAttribute?.attribute_id
    }))

    const stateEntity = useStateEntitiesStore((st) => st?.store?.data?.object_attributes?.find((oa) => {
        return oa.entity === objectAttribute?.id
    }))

    const state = useStatesStore((st) => st?.store?.data?.find((state) => state.id === stateEntity?.entity))

    if (!objectAttribute?.attribute) {
        objectAttribute.attribute = objectAttributeAttributeFieldValue
    }

    const innerType = objectAttribute?.attribute?.data_type.inner_type
    const incidentAttributeId = forumThemeConfig?.incidents?.attributesBind?.externalTickedId?.id
    const isObjectAttributeIncident = objectAttribute?.attribute_id === incidentAttributeId
    const isObjectAttributeIcon = objectAttribute?.attribute?.view_type_id === 17

    const convertedValue = useMemo( () => {
        return MLKit.getOAValue({ oa: objectAttribute })
    }, [objectAttribute.attribute_value])

    let value: any = ''

    switch (true) {
        case objectAttribute?.attribute?.attribute_stereotype?.mnemo == 'incident_id_object': {
            const objectById = objects.find((obj) => obj.id === Number(convertedValue))

            value = (
                <Link
                    to={getURL(`${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${objectById?.id}`, 'showcase')}
                    // to={`/objects/show/${objectById?.id}`} 
                    target="_blank"
                    style={{ borderBottom: '1px dotted' }}
                >
                    {`[${objectById?.id}]` + ' ' + objectById?.name}
                </Link>
            )
            break
        }
        case isObjectAttributeIncident: {
            const url = `${theme?.externalTicketUrl ?? 'https://fest2024.kmyt.ru'}/${convertedValue ?? ''}`

            value = (convertedValue)
                ?
                <Link
                    target="_blank"
                    onClick={onClick}
                    to={getURL(url, 'showcase')}
                >
                    {convertedValue}
                </Link>
                : '-'
            break
        }
        case objectAttribute?.attribute?.params?.select?.enable: {
            const label = objectAttribute?.attribute?.params?.select?.options?.find((option: any) => {
                return option?.value == convertedValue
            })?.label

            value = label
            break
        }
        case objectAttribute?.attribute?.data_type?.mnemo === 'datetime_UTC': {
            value = (convertedValue)
                //? moment.utc(convertedValue).local().format('YYYY-MM-DD HH:mm:ss')
                ? getLocalTimeFromUTC(convertedValue)
                : '-'
            break;
        }
        case ['integer', 'double', 'string'].includes(innerType):
            value = `${convertedValue || ''} ${objectAttribute?.attribute?.unit || ''}`
            break
        case innerType === 'boolean':
            value = convertedValue ? 'Да' : 'Нет'
            break
        case isObjectAttributeIcon: {
            const icon: any = convertedValue

            value = (
                <ECIconView {...props} style={style} icon={icon ?? ''} />
            )
            break
        }
        case innerType == 'jsonb': 
            value = (
                <OAJSONShortView value={objectAttribute.attribute_value} />
            )
            break
        default:
            value = convertedValue ? `${convertedValue}` : null
    }

    return enableStateText
        ?
        <StateText state={state}>
            {value}
        </StateText>
        : value
})