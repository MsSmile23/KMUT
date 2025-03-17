import { ENTITY } from '@shared/config/entities'

export const createApi = (
    name: keyof typeof ENTITY, 
    methods?: ['get' | 'post' | 'patch' | 'delete', 's' | 'ById'][]
) => {
    let _methods = [
        ['get', 's'], 
        ['get', 'ById'], 
        ['post', 'ById'],
        ['patch', 'ById'],
        ['delete', 'ById'],
    ]

    if (methods) {
        _methods = methods
    }

    const createEndpoint = (method: string, suffix: string) => {
        return `${method}${name.charAt(0).toLocaleUpperCase()}${name.toLowerCase().slice(1)}${suffix}`
    }

    const endpoints = _methods.map(([ method, suffix ]) => {
        return createEndpoint(method, suffix)
    })

    return {
        endpoints,
        scheme: _methods.reduce((obj, [ method, suffix ]) => {
            return {
                ...obj,
                [createEndpoint(method, suffix)]: {
                    method: method.toUpperCase(),
                    url: `${ENTITY[name.toUpperCase()].API_ROUTE}${suffix === 'ById' ? '/:id' : ''}`
                }
            }
        }, {})
    } as const
}