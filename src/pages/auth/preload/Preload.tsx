// import { generalStore } from '@shared/stores/general'
import { ReloadOutlined } from '@ant-design/icons'
import { useCombineStores } from '@shared/stores/utils/useCombineStore'
import { useGroupedStoresLoading } from '@shared/stores/utils/useGroupedStoresLoading'
import { StoreStates } from '@shared/types/storeStates'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { ECTooltip } from '@shared/ui/tooltips'
import { Progress } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import './preload.css'
import { DefaultModal } from '@shared/ui/modals'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
export const Preload = ({ selectedStores, loadingInterface }) => {
    useGroupedStoresLoading()
    const stores = useCombineStores()
    const [show, setShow] = useState(false)
    const [errorModalIsOpen, setErrorModalIsOpen] = useState<boolean>(false)
    const [errors, setErrors] = useState<any[]>([])
    const [activeStores, setActiveStores] = useState({})

    useEffect(() => {
        if (selectedStores) {
            const newStores = Object.entries(stores).reduce((acc, [key, value]) => {
                if (selectedStores.includes(String(key))) {
                    return [...acc, value]
                }

                return acc
            }, [])

            setActiveStores(newStores)

            return
        }

        setActiveStores(stores)
    }, [selectedStores])

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    const textColor = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)
    const backgroundColor2 = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'

    const colors: Record<StoreStates, string> = {
        [StoreStates.NONE]: 'rgba(0, 0, 0, 0.2)',
        [StoreStates.CACHE]: 'brown',
        [StoreStates.ERROR]: 'red',
        [StoreStates.FINISH]: 'green',
        [StoreStates.LOADING]: 'blue',
        [StoreStates.REFRESHING]: 'yellow',
    }

    const storesArray = selectedStores && Object.keys(selectedStores).length > 0
        ? Object.entries(stores).reduce((acc, [key, value]) => {
            if (selectedStores.includes(String(key))) {
                return [...acc, value]
            }

            return acc
        }, [])
        : Object.values(stores)
    const percentage =
        (storesArray.filter((store) => {
            return store.store.state === StoreStates.FINISH
        }).length /
            storesArray.length) *
        100

    useEffect(() => {
        Object.entries(activeStores).forEach(([, value]) => {
            if (value.store.error && value.store.error !== '' && value.store.state == StoreStates.ERROR) {
                const checkError = errors.some((err) => err.name == value.name)

                if (!checkError) {
                    setErrorModalIsOpen(true)
                    setShow(true)
                    setErrors((prev) => [...prev, { name: value.name, value: value }])
                }
            }
        })
    }, [storesArray])

    useEffect(() => { { errors?.length > 0 && console.log('Ошибки', errors) } }, [errors])

    const modalStyles = useMemo(() => `
            .ant-modal-content {
                background-color: ${backgroundColor} !important;
            }
            .ag-body {
                background-color: ${backgroundColor} !important;
            }
        `, [backgroundColor]);

    return (
        <>
            <style>{modalStyles}</style>
            <DefaultModal
                title={
                    <span
                        style={{ backgroundColor: backgroundColor, color: textColor }}
                    >Ошибка загрузки данных приложения
                    </span>
                }
                width="40%"
                isModalVisible={errorModalIsOpen}
                handleCancel={() => {
                    setErrorModalIsOpen(false)
                }}
            >
                <>
                    {errors.map((value, idx) => (
                        <div
                            key={idx + 1}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                // justifyContent: 'space-between',
                                color: textColor,
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.05)',
                                padding: 5,
                                borderRadius: 5,
                                marginBottom: 5,
                                backgroundColor: backgroundColor
                            }}
                        >
                            <span>
                                {idx + 1}.&nbsp;{value.name}:{' '}
                                {value?.value.store?.error?.message || 'Неизвестная ошибка загрузки'}
                            </span>
                        </div>
                    ))}
                </>
            </DefaultModal>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'start',
                    gap: 20,
                    height: '100vh',
                    backgroundColor: backgroundColor,
                    margin: 0,
                    padding: 0
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        height: '55%',
                        alignItems: 'end',
                        color: textColor,
                    }}
                >
                    <CustomPreloader size="default" />
                    {loadingInterface
                        ? <>Загружаем данные для интерфейса {loadingInterface}...</>
                        : <>Загружаем данные приложения...</>}
                    <ECTooltip title={show ? 'Скрыть данные загрузки' : 'Показать данные загрузки'}>
                        <div
                            onClick={() => {
                                setShow(!show)
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <ECIconView icon={show ? 'UpCircleOutlined' : 'DownCircleOutlined'} />
                        </div>
                    </ECTooltip>
                    {errors?.length > 0 && (
                        <ECTooltip title="Ошибка загрузки данных">
                            <div
                                onClick={() => {
                                    setErrorModalIsOpen(true)
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <ECIconView icon="WarningOutlined" />
                            </div>
                        </ECTooltip>
                    )}
                </div>
                <Progress
                    percent={Math.round(percentage)}
                    style={{ width: '80%', height: '17%' }}
                    format={percent => (<div style={{ color: textColor }}>{percent}%</div>)}
                />
                {show && (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'column',
                            alignContent: 'space-between',
                            width: '95%',
                            maxHeight: 300,
                            height: '29%',
                            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                            borderRadius: 10,
                            gap: 10,
                            padding: 10,
                            overflowX: 'auto',
                            backgroundColor: backgroundColor
                        }}
                    >
                        {Object.entries(stores)
                            .sort(([, prevValue], [, value]) => {
                                const orderByLoad = prevValue.params.loadOrder - value.params.loadOrder
                                // const alphabetOrder = prevValue.name.localeCompare(value.name)

                                return orderByLoad /* && alphabetOrder */
                            })
                            .filter(([store, value]) => {
                                if (selectedStores) {
                                    return selectedStores.includes(store)
                                }
                                
                                return store
                            })
                            .map(([store, value], idx) => {
                                if (
                                    value.store.error &&
                                    typeof value.store.error === 'string' &&
                                    value.store.error !== ''
                                ) {
                                    console.log('error of', value.name, ' [', value.store.error, ']')
                                }

                                return (
                                    <div
                                        key={store}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                            // justifyContent: 'space-between',
                                            width: '31%',
                                            background: 'rgba(0, 0, 0, 0.05)',
                                            padding: 5,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <span
                                            style={{
                                                flex: 1,
                                                color: textColor
                                                // maxWidth: '60%'
                                            }}
                                        >
                                            {idx + 1}.&nbsp;{value.name}
                                        </span>
                                        <span>
                                            <span style={{ color: colors[value.store.state] }}>
                                                {value.store.state}
                                            </span>
                                            {(value.store.state == StoreStates.ERROR || value.store.error) && (
                                                <span
                                                    onClick={() => {
                                                        value.fetchData()
                                                        setErrors(errors.filter((error) => error.name !== value.name))
                                                    }}
                                                    style={{
                                                        marginLeft: 5,
                                                        cursor: 'pointer',
                                                        color: textColor
                                                    }}
                                                >
                                                    <ECTooltip
                                                        title="Обновить"
                                                    // color={colors[value.store.state]}
                                                    >
                                                        <ReloadOutlined
                                                            className="is-active"
                                                            style={{
                                                                fontSize: '14px',
                                                            }}
                                                        />
                                                    </ECTooltip>
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )
                            })}
                    </div>
                )}
            </div>
        </>
    )
}