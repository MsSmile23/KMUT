import { ITreeStore } from '@containers/objects/ObjectTree/treeTypes'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useAccountStore } from '../accounts'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'

export const useTreeStore = create<ITreeStore>()(
    devtools(
        immer(
            persist((set, get) => ({
                trackedParentClassesids: [],
                setTrackedParentClassesids: (ids: number[]) => {
                    set((state) => {
                        state.trackedParentClassesids = ids
                    })
                },
                chosenClassifiers: {},
                setChosenClassifiers: (value, id) => {
                    set((state) => {
                        state.chosenClassifiers[id] = value
                    })
                    // get().saveSettingsToAccount({ chosenClassifiers: value }, id)
                },
                chosenClassifiersCount: {},
                setChosenClassifiersCount: (count, id) => {
                    set((state) => {
                        state.chosenClassifiersCount[id] = count
                    })
                    // get().saveSettingsToAccount({ chosenClassifiersCount: value }, id)
                },
                groupingOrder: {},
                setGroupingOrder: (value, id) => {
                    set((state) => {
                        state.groupingOrder[id] = value
                    })
                    // get().saveSettingsToAccount({ groupingOrder: value }, id)
                },
                searchValue: {},
                setSearchValue: (searchValue, id) => {
                    set((state) => {
                        state.searchValue[id] = searchValue
                    })
                    // get().saveSettingsToAccount({ searchValue: value }, id)
                },
                lastTrackedObjectId: null,
                setLastTrackedObjectId: (value) => {
                    set((state) => {
                        state.lastTrackedObjectId = value
                    })
                    // get().saveSettingsToAccount({ lastTrackedObjectId: value }, id)

                },
                clearSettings: (id) => {
                    set((state) => {
                        state.chosenClassifiers[id] = {}
                        state.chosenClassifiersCount[id] = 0
                        state.groupingOrder[id] = []
                        state.visibleClassIds[id] = []
                        state.intermediateClassIds[id] = []
                        state.searchValue[id] = ''
                        state.showHierarchy[id] = false
                    })
                    /* get().saveSettingsToAccount({ 
                        chosenClassifiers: {},
                        chosenClassifiersCount: 0,
                        groupingOrder: [],
                        searchValue: '',
                        visibleClasses: [],
                        intermediateClasses: [],
                        showHierarchy: false
                    }, id) */
                },
                getStatePart: (state, id) => {
                    const statePart = get()[state]

                    if (statePart[id]) {
                        return get()[state][id]
                    }

                    return undefined
                },
                classIds: {},
                setClassIds: (value, id) => {
                    set((state) => {
                        state.classIds[id] = value
                    })
                    // get().saveSettingsToAccount({ classes: value }, id)
                },
                intermediateClassIds: {},
                setIntermediateClassIds: (value, id) => {
                    set((state) => {
                        state.intermediateClassIds[id] = value
                    })
                    // get().saveSettingsToAccount({ intermediateClasses: value }, id)

                },
                visibleClassIds: {},
                setVisibleClassIds: (value, id) => {
                    set((state) => {
                        state.visibleClassIds[id] = value
                    })
                    // get().saveSettingsToAccount({ visibleClasses: value }, id)
                },
                parentTrackedClasses: {},
                setParentTrackedClasses: (value, id) => {
                    set((state) => {
                        state.parentTrackedClasses[id] = value
                    })
                    // get().saveSettingsToAccount({ parentTrackedClasses: value }, id)
                },
                trackId: {},
                setTrackID: (value, id) => {
                    set((state) => {
                        state.trackId[id] = value
                    })
                    // get().saveSettingsToAccount({ trackId: value }, id)
                },
                expandedKeys: {},
                setExpandedKeys: (value, id) => {
                    set((state) => {
                        state.expandedKeys[id] = value
                    })
                    // get().saveSettingsToAccount({ expandedKeys: value }, id)
                },
                showHierarchy: {},
                setShowHierarchy: (value, id) => {
                    set((state) => {
                        state.showHierarchy[id] = value
                    })
                    // get().saveSettingsToAccount({ showHierarchy: value }, id)
                },
                treeObjectFilter: {},
                setAllTreeObjectFilter: (value, id) => {
                    set((state) => {
                        state.treeObjectFilter[id] = value
                    })
                    // get().saveSettingsToAccount({ treeObjectFilter: value }, id)
                },
                setEmptyTreeObjectFilter: (id) => {
                    set((state) => {
                        state.treeObjectFilter[id] = [{
                            target: [],
                            linking: []
                        }]
                    })
                    /* get().saveSettingsToAccount({ 
                        treeObjectFilter: [{
                            target: [],
                            linking: []
                        }]
                    }, id) */
                },
                saveSettingsToAccount: async (value, id) => {
                    const accountData = useAccountStore.getState()?.store?.data?.user

                    try {
                        const newSettings = {
                            ...accountData?.settings,
                            trees: {
                                ...accountData?.settings?.trees,
                                [id]: {
                                    ...accountData?.settings?.trees?.[id],
                                    ...value
                                }
                            }
                            // trees: {}
                        }

                        // console.log('store save settings', newSettings)
                        
                        // const response = await patchAccountById(`${accountData?.id}`, { 
                        //     settings: newSettings
                        // })

                        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({ 
                            settings: newSettings
                        }) 

                        if (response?.success) {
                            // console.log('successfully updated')
                            // message.success(`Настройки дерева ${accountData?.id ?? ''} сохранены`)
                        } else {
                            // console.log('error updating')

                            // message.error('Ошибка сохранения настроек')
                        }
                        // }
                    } catch {
                        // console.log('error catch updating')
                        // message.error('Ошибка сохранения настроек')
                    } finally {
                        // console.log('finish updating')
                    }
                }
            }),
            { name: 'treeStore' }
            )
        )
    )
)

export const clearSettingsSelect = (state: ITreeStore) => ({
    clearSettings: state.clearSettings,
    chosenClassifiersCount: state.chosenClassifiersCount,
    groupingOrder: state.groupingOrder,
    searchValue: state.searchValue,
})
export const lastTrackedObjectIdSelect = (state: ITreeStore) => ({
    lastTrackedObjectId: state.lastTrackedObjectId,
    setLastTrackedObjectId: state.setLastTrackedObjectId
})
export const groupingOrderSelect = (state: ITreeStore) => ({
    groupingOrder: state.groupingOrder,
    setGroupingOrder: state.setGroupingOrder
})
export const searchValueSelect = (state: ITreeStore) => ({
    searchValue: state.searchValue,
    setSearchValue: state.setSearchValue
})
export const chosenClassifiersSelect = (state: ITreeStore) => ({
    chosenClassifiers: state.chosenClassifiers,
    setChosenClassifiers: state.setChosenClassifiers
})
export const chosenClassifiersCountSelect = (state: ITreeStore) => ({
    chosenClassifiersCount: state.chosenClassifiersCount,
    setChosenClassifiersCount: state.setChosenClassifiersCount
})

export const getStatePartSelect = (state: ITreeStore) => state.getStatePart