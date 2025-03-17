import { useEffect, useState } from 'react'
import { useConfigStore } from '@shared/stores/config'
import { getFrontSettingsSelect } from '@shared/utils/common'
import dayjs from 'dayjs'
import { tempModifArrayUnif } from './utilTempMod'


export const useTempModifications = () => {
    const [state, setState] = useState<string | null>(null)
    const getConfig = useConfigStore((state) => state.store.data)
    const config = getFrontSettingsSelect(getConfig)

    useEffect(() => {
        const today = dayjs().format('D-MMM')
        const holydayArray = config?.tempModifications
        const array = []

        for (let i = 0; i < holydayArray?.length; i++) {
            if (today >= dayjs(holydayArray[i]?.beginning).format('D-MMM') && 
                today <= dayjs(holydayArray[i]?.end).format('D-MMM') && holydayArray[i]?.holydayStatus === true ) {
                array.push(holydayArray[i])
            }
        }
        const result = tempModifArrayUnif(array)

        return setState(result)
    }, [getConfig])

    return state
}