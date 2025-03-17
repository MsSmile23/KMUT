import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { useState, useEffect } from 'react'
import { IObject } from '@shared/types/objects'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { utils } from '@features/objects/FilterForm/filters';
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById'

type TUseVTemplate = {
    vTemplate: dataVtemplateProps<paramsVtemplate>,
    isLoaded: boolean,
    object: IObject
}

type TvTemplateAndObject = {
    vTemplate: TUseVTemplate['vTemplate']
    object: TUseVTemplate['object']
}

export const useObjectVTemplate = (id: IObject['id']): TUseVTemplate => {

    const getByIndex = useObjectsStore(selectObjectByIndex)
    const [isLoaded, setLoaded] = useState<boolean>(false)
    const [vTemplateAndObject, setVTemplateAndObject] = useState<TvTemplateAndObject>(null)

    const vTemplatesList = useVTemplatesStore(selectVTemplates)
        .filter(vTemplate => vTemplate.params.dataToolbar.purpose === 2)

    useEffect(() => {

        const fetchData = async () => {
            setLoaded(false)
            let vTemplate: any = null

            let object = getByIndex('id', Number(id))
 
            if (!object) {
                object = (await getObjectById(id)).data
            }

            for (let i = 0; i < vTemplatesList.length; i++) {
                const vTemp = vTemplatesList[i]
    
                // console.log('vTemp', vTemp, vTemplatesList, object)
                //*Добавляем проверку на доп фильтрацию
                if (vTemp?.params?.dataToolbar?.filters) {
                    const checkVTemp = utils.applyFiltersToObject(object, vTemp.params.dataToolbar.filters)
    
                    if (checkVTemp) {
                        vTemplate = { ...vTemp }
                        break
                    }
                }
    
                if (vTemp?.params?.dataToolbar?.objectBindings?.includes(object?.id)) {
                    vTemplate = { ...vTemp }
                    break
                } else if (
                    vTemp?.params?.dataToolbar?.classes?.includes(object?.class_id) &&
                    !vTemp?.params?.dataToolbar?.objectBindings?.length
                ) {
                    vTemplate = { ...vTemp }
                }
            }
    
            setVTemplateAndObject({ vTemplate, object })
    
            setLoaded(true)
        }

        fetchData()
    }, [id])

    return {
        ...vTemplateAndObject,
        isLoaded
    }
}