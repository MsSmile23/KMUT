import { useMemo } from 'react'
import { IFilterFormProps } from '../types'
import { defaultFormValues } from '../utils'

export const useInitialFormValues = (props: IFilterFormProps): {initialFormValues: IFilterFormProps} => {
    const { 
        attrFilter, 
        classFilter, 
        objectFilter, 
        relationFilter, 
        stateFilter
    } = props ?? {}
    
    const initialFormValues = useMemo(() => {        
        const result: IFilterFormProps = Object.keys(defaultFormValues)
            .reduce((acc, key) => {
                const filterGroup = defaultFormValues[key]

                if (props?.[key]) {
                    
                    if (Array.isArray(filterGroup)) {
                        acc[key] = [ ...props[key] ]
                    } else {
                        acc[key] = { ...props[key] }
                        Object.keys(filterGroup).forEach(filterGroupKey => {
                            if (filterGroupKey in props[key]) {
                                if (Array.isArray(filterGroupKey)) {
                                    props[key][filterGroupKey].forEach(item => {
                                        acc[key][filterGroupKey].push(item)
                                    })
                                } else {
                                    acc[key][filterGroupKey] = props[key][filterGroupKey]
                                }
                            } else {
                                if (Array.isArray(filterGroupKey)) {
        
                                    acc[key][filterGroupKey] = [...defaultFormValues[key][filterGroupKey]]
                                } else {
                                    acc[key][filterGroupKey] = defaultFormValues[key][filterGroupKey]
                                }
                            }
                        })
                    }
                } else {
                    if (Array.isArray(defaultFormValues[key])) {

                        acc[key] = [...defaultFormValues[key]]
                    } else {
                        acc[key] = defaultFormValues[key]
                    }
                    // acc[key] = defaultFormValues[key]
                }

                return acc
            }, {} as IFilterFormProps)

        return result
    }, [
        attrFilter, 
        classFilter, 
        objectFilter, 
        relationFilter, 
        stateFilter
    ])
    
    return {
        initialFormValues
    }
}