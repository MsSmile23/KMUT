import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { TMediaFilesInfoData } from '@shared/types/media-files'
import { getMediaFilesInfo } from '@shared/api/MediaFiles/Models/getMediaFilesInfo/getMediaFilesInfo'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IMediaFilesStore {
    store: {
        data: TMediaFilesInfoData[]
        state: StoreStates
        error: string
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IMediaFilesStore['store']['data']) => void
    addToData: (value: TMediaFilesInfoData[]) => void
    setState: (value: IMediaFilesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getMediaFileById: (id: number) => TMediaFilesInfoData
    getMediaFileUrlById: (id: number) => TMediaFilesInfoData['url']
}
export const useMediaFiles = create<IMediaFilesStore>()(
    immer((set, get) => ({
        store: {
            data: [],
            state: StoreStates.NONE,
            error: '',
        },
        params: {
            loadLoopTime: 60000,
            updateLoop: null,
            isLoadAtStart: true,
            loadOrder: 2,
        },
        localeName: 'Медиа файлы',
        setState: (value) => {
            set((state) => {
                state.store.state = value
            })
        },
        setData: (value) => {
            set((state) => {
                state.store.data = value
            })
        },
        addToData: (value) => {
            set((state) => {
                state.store.data = [...state.store.data, ...value]
            })
        },
        forceUpdate: () => {
            get().fetchData()
        },
        fetchData: async () => {
            get().setState(StoreStates.LOADING)

            try {
                const response = await getMediaFilesInfo({ all: true })

                if (response?.success) {
                    const isEqual = _.isEqual(get().store.data, response.data)

                    if (!isEqual) {
                        if (response.data !== null || undefined || [] || {}) {
                            get().setData(response.data)

                            get().setError(null)
                        }
                    }
                    get().setState(StoreStates.FINISH)
                } else {
                    set((state) => {
                        state.store.error = response?.error ?? 'Ошибка'
                    })

                    // if (response?.status === 403) {
                    //     get().setState(StoreStates.ERROR)
                    // }
                    interceptorErrorsStore({
                        errorCode: response?.status,
                        callBack: () => get().setState(StoreStates.FINISH),
                    })
                }
            } catch (error) {
                set((state) => {
                    state.store.error = error ?? 'Ошибка'
                })
            } finally {
                // console.log('')
            }
        },
        setError: (error) => {
            set((state) => {
                state.store.error = error
            })
        },
        setStartApiUpdateLoop: (time = get().params.loadLoopTime) => {
            const updateLoop = get().params.updateLoop

            if (updateLoop !== null) {
                set((state) => {
                    state.params.updateLoop = null
                })
            }

            set((state) => {
                state.params.updateLoop = setInterval(() => {
                    get().fetchData()
                }, time)
            })
        },
        setStopApiUpdateLoop: () => {
            const updateLoop = get().params.updateLoop

            if (updateLoop !== null) {
                clearInterval(updateLoop)
            }

            set((state) => {
                state.params.updateLoop = null
            })
        },
        setInitialStoreState: () => {
            set((state) => {
                state.store = {
                    data: [],
                    state: StoreStates.NONE,
                    error: '',
                }
            })
        },
        getMediaFileById: (id) => {
            return get().store.data.find((state) => state.id === id)
        },
        getMediaFileUrlById: (id) => {
            return get().store.data.find((state) => state.id === id).url
        },
    }))
)

export const selectMediaFiles = useMediaFiles.getState().store.data
export const addToMediaFilesStore = (value: TMediaFilesInfoData[]) => useMediaFiles.getState().addToData(value)
export const getState = (state: IMediaFilesStore) => state
export const selectMediaFile = (state: IMediaFilesStore) => state.getMediaFileById
export const getMediaFileUrlById = (state: IMediaFilesStore) => state.getMediaFileUrlById
export const selectMediaFilesUpdateParams = (state: IMediaFilesStore) => {
    return {
        store: state.store,
        name: state.localeName,
        params: state.params,
        fetchData: state.fetchData,
        setStartApiUpdateLoop: state.setStartApiUpdateLoop,
        setStopApiUpdateLoop: state.setStopApiUpdateLoop,
        setInitialStoreState: state.setInitialStoreState,
    }
}