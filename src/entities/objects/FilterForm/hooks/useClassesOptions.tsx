import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectClassStereotypes, useClassStereotypesStore } from '@shared/stores/classStereotypes/useClassStereotypes'
import { useMemo } from 'react'

interface IOption {
    label: string
    value: number
}

export const useClassesOptions = () => {
    const storeClasses = useClassesStore(selectClasses)
    const storeClassStereoTypes = useClassStereotypesStore(selectClassStereotypes)

    const stereotypeClassesList = useMemo<IOption[]>(() => {
        const result: IOption[] = []

        storeClassStereoTypes
            ?.forEach((stereo) => {
                if (stereo.package_id === PACKAGE_AREA.SUBJECT) {
                    result.push({
                        label: stereo.name,
                        value: stereo.id
                    })
                }
            })
            
        
        return result.sort((a, b) => a.label.localeCompare(b.label))
    }, [
        storeClassStereoTypes
    ])

    const abstractClassesList = useMemo<IOption[]>(() => {
        const result: IOption[] = []

        storeClasses.forEach(cls => {
            if (cls.package_id === PACKAGE_AREA.SUBJECT && cls.is_abstract) {
                result.push({
                    label: cls.name,
                    value: cls.id
                })
            }
        })

        return result.sort((a, b) => a.label.localeCompare(b.label))
    }, [
        storeClasses
    ])


    return {
        stereotypeClassesList,
        abstractClassesList
    }
}