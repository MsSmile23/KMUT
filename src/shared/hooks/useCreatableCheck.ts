import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts'
import { selectLicense, useLicenseStore } from '@shared/stores/license'
import { useEffect, useMemo, useState } from 'react'
import { licensetooltipNames } from './useButtonCheckUtil/utilCreatable'

interface ICreatableCheckProps {
    entity: string 
}
export const useCreatableCheck = (props: ICreatableCheckProps) => {
    const licenseData = useLicenseStore(selectLicense)
    
    // const isCreatable = useLicenseStore(selectIsCreatable)
    const checkPermission = useAccountStore(selectCheckPermission)
    const [creatable, setCreatable] = useState<boolean>(
        licenseData?.current?.[props?.entity] <= licenseData?.limits?.[props?.entity]
    )
    // const [creatable, setCreatable] = useState<boolean>(isCreatable(props))
    // const prevCreatable = useRef(creatable)

    useEffect(() => {
        const subscription = useLicenseStore.subscribe(
            (state) => state.store.data,
            (data, prevLimits) => {
                const limitCondition = data?.current?.[props?.entity] <= data?.limits?.[props?.entity]
                
                setCreatable(limitCondition)
            }
        )
        
        return () => {
            subscription()
        }
    }, [props])

    // useEffect(() => {
    //     const newCreatable = (isCreatable(props))

    //     if (newCreatable !== prevCreatable.current) {
    //         setCreatable(newCreatable);
    //         prevCreatable.current = newCreatable;
    //     }
    // }, [licenseData, entities[props.entity]])

    const customTooltip = useMemo(() => {
        const LICENSE_TOOLTIP = `Внимание! Превышено количество 
            ${licensetooltipNames[props.entity][0]}, доступное по лицензии`
        const PERMISSION_TOOLTIP = `Внимание! Недостаточно прав для создания ${licensetooltipNames[props.entity][1]}`

        if (!creatable) {
            return LICENSE_TOOLTIP
        }

        if (!checkPermission([`create ${props.entity}`])) {
            return PERMISSION_TOOLTIP
        }
    }, [creatable])

    return {
        creatable: creatable || !checkPermission([`create ${props.entity}`]),
        customTooltip: customTooltip
    }
}