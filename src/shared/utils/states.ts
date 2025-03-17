import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { useStateStereotypesStore } from '@shared/stores/statesStereotypes'
import { IObject, IObjectAttribute } from '@shared/types/objects'
import { IStateEntities, IStateEntity } from '@shared/types/state-entities'
import { IStateStereotype } from '@shared/types/state-stereotypes'
import { IParams, IState, IViewParams } from '@shared/types/states'

export const stateViewParamsDefault = {
    fill: '#fafafa',
    border: '#d9d9d9',
    borderWidth: 1,
    textColor: '#000000',
    icon: 'FileOutlined',
    name: 'Нет состояния',
}

export interface IAccumState extends Omit<IState, 'id'> {
    id: number | string
    states?: IState[]
    // view_params?: Omit<IViewParams, 'params'> & {
    //     params: typeof stateViewParamsDefault
    // }
}

// Получение дефолтных параметров стейта
export const getDefaultStateParams = () => {
    return ({
        fill: '#fafafa',
        border: '#d9d9d9',
        borderWidth: 1,
        textColor: '#000000',
        icon: 'FileOutlined',
        name: 'Нет состояния',
    })
}

// Получение стейта по id и типу (объект или атрибут)
export const getStateFromEntity = (id: IObject['id'], type: keyof IStateEntities): IState => {
    const stateEntitiy = useStateEntitiesStore.getState().getTypeStateEntityById(type, id)
    const state = useStatesStore.getState().getStateById(stateEntitiy?.state)

    return state
} 
export const getStateStereotypeFromEntity = (id: IObject['id'], type: keyof IStateEntities): IState => {
    const state = getStateFromEntity(id, type)
    const stereotype = useStateStereotypesStore.getState().getStateStereotypeById(state?.state_stereotype_id)
    
    return stereotype
} 

// Получение конкретного вью параметра
export const getStateViewParam = (state: IState | IAccumState, param: string) => {
    return state?.view_params?.params?.find((item) => item?.type === param)?.value
}

export const getStateViewParamsWithDefault = (state: IState | IAccumState | IStateStereotype) => {
    const viewParams = { ...stateViewParamsDefault }

    if (state) {
        Object.keys(viewParams).map((key) => {
            const tmpValue = (key == 'name')
                ? state?.view_params?.name
                : getStateViewParam(state, key)

            if (tmpValue) { viewParams[key] = tmpValue }
        })
    }

    return viewParams
}

export const tempMixStateParams = (state: IAccumState) => {
    const getStereotypeState = useStateStereotypesStore.getState().getStateStereotypeById
    const stereotypeState = getStereotypeState(state?.state_stereotype_id)
    const stereotypeParams = getStateViewParamsWithDefault(stereotypeState)
    const withDefaultParams: IParams[] = Object.entries(stateViewParamsDefault)
        .filter(([key,]) => {
            return ['fill', 'textColor', 'border', 'icon'].includes(key)
        })
        .map(([key, value]) => {
            return {
                type: key,
                value: String(value)
            }
        })

    const newStereotypeParams: IParams[] = Object.entries(stereotypeParams)
        .filter(([key,]) => {
            return ['fill', 'textColor', 'border', 'icon'].includes(key)
        })
        .map(([key, value]) => {
            return {
                type: key,
                value: String(value)
            }     
        })

    const newState: IAccumState = state?.state_stereotype_id 
        ? {
            ...state,
            view_params: {
                name: stereotypeState.view_params.name,
                params: newStereotypeParams
            }
        }
        : state.id === 'unknown'
            ? {
                ...state,
                view_params: {
                    name: stateViewParamsDefault.name,
                    params: withDefaultParams
                }
            } 
            : state

    return newState
}
export const getStateViewParamsWithStereotype = (state: IState, isGrouped?: boolean) => {    
    if (
        (state?.state_stereotype_id && state.view_params.params.length === 0) ||
        isGrouped
    ) {
        const currentStereotypeState = useStateStereotypesStore.getState()
            .getStateStereotypeById(state?.state_stereotype_id)

        return getStateViewParamsWithDefault(currentStereotypeState)
    } else {
        return getStateViewParamsWithDefault(state)
    }
}
// Получение всех вью параметров по стейту
export const getStateViewParamsFromState = (state: IState) => {
    const params = state?.view_params?.params.reduce((acc, cur) => {
        acc[cur.type] = cur.value

        return acc
    }, {}) as Record<'textColor'|'fill'|'border'|'icon', string>

    return params
}

// Получение всех вью параметров по id объекта/атрибута
export const getStateViewParamsFromEntity = (id: IObject['id'], type: keyof IStateEntities) => {
    const state = getStateFromEntity(id, type)

    return state ? getStateViewParamsFromState(state) : undefined
}

// Получение приоритетного состояния массива атрибутов/объектов
// (берётся наибольший priority, при его равенстве берется наибольший stateId) 
export const getPriorityState = (type: keyof IStateEntities, attrs: IObjectAttribute[] | IObjectAttribute['id'][]) => {
    const allStates = attrs.reduce((states, attr) => {
        const newAttr = typeof attr !== 'number' ? attr.id : attr
        const currAttrStatesObj = useStateEntitiesStore.getState().getAllTypeStateEntitiesById(type, newAttr)
        
        const currAttrStates = currAttrStatesObj?.map(item => {
            let state = useStatesStore.getState().getStateById(item?.state)

            if (!state) {
                const newParams: IViewParams['params'] = Object.keys(stateViewParamsDefault).reduce((acc, key) => {
                    if (['fill', 'border', 'textColor', 'icon'].includes(key)) {
                        acc.push({
                            type: key,
                            value: stateViewParamsDefault[key]
                        })
                    }
    
                    return acc
                }, [] as IViewParams['params'])
    
                state = {
                    view_params: {
                        params: newParams,
                        name: stateViewParamsDefault.name,
                    },
                    priority: 1
                }
            }

            return state
        })


        return states.concat(currAttrStates)

    }, [] as IState[])
 
    const filterByPriority = allStates.sort((a, b) => {
        if (a.priority === b.priority) {
            return a.id - b.id
        }

        return a.priority - b.priority
    })

    return filterByPriority[filterByPriority.length - 1]
}

// Получение аккумулированного состояния
export const getAccumulatedStateFromStates = (state_ids: IStateEntity[]) => {
    const accumulatedState = state_ids.reduce((stateAcc, curStateOfEntity) => {
        let state = useStatesStore.getState().getStateById(curStateOfEntity.state)

        if (!state) {
            const newParams: IViewParams['params'] = Object.keys(stateViewParamsDefault).reduce((acc, key) => {
                if (['fill', 'border', 'textColor', 'icon'].includes(key)) {
                    acc.push({
                        type: key,
                        value: stateViewParamsDefault[key]
                    })
                }

                return acc
            }, [] as IViewParams['params'])

            state = {
                view_params: {
                    params: newParams,
                    name: stateViewParamsDefault.name
                },
            }
        }

        if (!stateAcc['id']) {
            stateAcc = {
                ...state,
                view_params: {
                    ...state.view_params,
                    params: [...state.view_params.params],
                },
                id: state?.id,
                states: []
            }
        } else {
            const fillStateAccIdx = stateAcc.view_params.params?.findIndex(item => item.type === 'fill')
            const fillStateIdx = state.view_params.params?.findIndex(item => item.type === 'fill')
            const textColorStateAccIdx = stateAcc.view_params.params?.findIndex(item => item.type === 'textColor')
            const textColorStateIdx = state.view_params.params?.findIndex(item => item.type === 'textColor')
            const borderStateAccIdx = stateAcc.view_params.params?.findIndex(item => item.type === 'border')
            const borderStateIdx = state.view_params.params?.findIndex(item => item.type === 'border')
            const iconStateAccIdx = stateAcc.view_params.params?.findIndex(item => item.type === 'icon')
            const iconStateIdx = state.view_params.params?.findIndex(item => item.type === 'icon')

            if (fillStateAccIdx < 0 && fillStateIdx >= 0) {
                stateAcc.view_params.params.push({ 
                    type: 'fill', 
                    value: state.view_params.params[fillStateIdx].value
                })
            }

            if (textColorStateAccIdx < 0 && textColorStateIdx >= 0) {
                stateAcc.view_params.params.push({ 
                    type: 'textColor', 
                    value: state.view_params.params[textColorStateIdx].value
                })
            }

            if (borderStateAccIdx < 0 && borderStateIdx >= 0) {
                stateAcc.view_params.params.push({ 
                    type: 'border', 
                    value: state.view_params.params[borderStateIdx].value
                })
            }

            if (iconStateAccIdx < 0 && iconStateIdx >= 0) {
                stateAcc.view_params.params.push({ 
                    type: 'icon', 
                    value: state.view_params.params[iconStateIdx].value
                })
            }
            
            stateAcc.id += '-' + state?.id
            stateAcc.view_params.name += ', ' + state?.view_params?.name
        }
        

        stateAcc.states.push(state)

        return stateAcc
    }, {} as IAccumState)

    // console.log('accumulatedState', accumulatedState)
    
    return accumulatedState
}

export const findStateColor = (state: IState, field: string): string | undefined => {
    return state?.view_params?.params?.find((p) => p.type === field)?.value
}