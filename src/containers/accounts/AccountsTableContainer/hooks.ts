import { patchConfigByMnemo } from '@shared/api/Config/Models/patchConfigByMnemo/patchConfigByMnemo';
import { IConfig } from '@shared/types/config';
import { useCallback, useState } from 'react';

export const usePatchConfig = (mnemo: string) => {
    const [ data, setData ] = useState<IConfig>()
    const [ loading, setLoading ] = useState(false)

    const patch = useCallback(async (payload: Partial<IConfig>) => {
        setLoading(true)

        try {
            const response = await patchConfigByMnemo(mnemo, payload)

            if (response?.success && response?.data) {
                setData(response.data)
            }
        } finally {
            setLoading(false)
        }
    }, [mnemo])

    return { data, loading, request: patch } as const
}