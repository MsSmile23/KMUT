import { getIncidentChart } from '@shared/api/Stats/Models/getIncidentChart'
import { useInterval } from '@shared/hooks/useInterval'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { useHealthStore } from '@shared/stores/health/healthStore'
import { IObject } from '@shared/types/objects'
import { IIncidentData } from '@shared/types/stats'
import { InOutChart } from '@shared/ui/charts/highcharts'
import { DefaultModal2 } from '@shared/ui/modals'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Spin, Typography } from 'antd'
import { FC, PropsWithChildren, useEffect, useState } from 'react'

const { Title } = Typography

export interface IObjectsInOutHistoryProps {
    title?: string
    incidentsList?: (objectIds?: number[], periodForModal?: IPeriodForModal, message?: string) => React.ReactNode
    object?: IObject
    height?: number
    sourceClass: number
    objectIds?: IObject['id'][] //ВСЕ объекты для инцидентов, сбор пройдёт только по ним
    autoUpdate?: {
        enabled: boolean
        time: number
    }
}

interface IPeriodForModal {
    start: any
    end: any
}

const Wrapper: FC<PropsWithChildren<{ height: IObjectsInOutHistoryProps['height'] }>> = ({ children, height }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: height ?? 400,
        }}
    >
        {children}
    </div>
)

export const ObjectsInOutHistory: FC<IObjectsInOutHistoryProps> = ({
    title,
    incidentsList,
    object,
    height,
    sourceClass,
    objectIds,
    autoUpdate = {
        enabled: true,
        time: 60_000,
    },
}) => {
    const objectIdsFinal = objectIds ?? [object?.id]

    const payload = {
        class_id: sourceClass,
        object_ids: objectIdsFinal.join(','),
    }

    const [points, setPoints] = useState<IIncidentData>({})
    const [status, setStatus] = useState('idle')
    const [periodForModal, setPeriodForModal] = useState<IPeriodForModal>(undefined)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const isNetworkError = useHealthStore((st) => st.status === 'error')

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
        : '#ffffff'

    const getIncidents = async () => {
        setStatus('loading')

        if (objectIdsFinal?.length !== 0) {
            getIncidentChart(payload).then((res) => {
                setPoints(res.data)
                setStatus('finished')
            })
        } else {
            setStatus('finished')
        }
    }

    useEffect(() => {
        if (isNetworkError) {
            return
        }
        getIncidents().then()
    }, [sourceClass, objectIds, object, isNetworkError])

    useInterval(
        () => {
            getIncidents().then()
        },
        autoUpdate && autoUpdate.enabled ? autoUpdate.time : null
    )

    const objectData = points ? Object.values(points) : []

    const getRender = () => {
        switch (true) {
            case objectIdsFinal?.length !== 0 && objectData.length !== 0: {
                return (
                    <div style={{ width: '100%', height: '100%' }}>
                        <Title
                            style={{
                                margin: '0px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                fontSize: 14,
                                color: textColor,
                            }}
                            onClick={() => setOpenModal(true)}
                        >
                            {title?.length > 0 ? title : 'Динамика одиночных инцидентов'}
                        </Title>

                        <InOutChart
                            points={points}
                            height={height ?? 400}
                            setPeriodForModal={setPeriodForModal}
                            setOpenModal={setOpenModal}
                            textColor={textColor}
                            backgroundColor={backgroundColor}
                        />
                    </div>
                )
                break
            }
            case objectIdsFinal?.length === 0 && status === 'finished': {
                return <Wrapper height={height}>Новые инциденты отсутствуют</Wrapper>
                break
            }
            case objectData?.length === 0 && status === 'loading': {
                return (
                    <Wrapper height={height}>
                        <Spin />
                    </Wrapper>
                )
                break
            }
            case objectData?.length === 0 && status === 'finished': {
                return <Wrapper height={height}>Нет данных</Wrapper>
                break
            }
            default: {
                return (
                    <Wrapper height={height}>
                        <Spin />
                    </Wrapper>
                )
            }
        }
    }

    const getRenderForModal = () => {
        switch (true) {
            case objectIdsFinal?.length !== 0 && objectData.length !== 0 && periodForModal === undefined: {
                return (
                    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        {incidentsList(objectIdsFinal, undefined, 'Открытых инцидентов нет')}
                    </div>
                )
                break
            }
            case objectIdsFinal?.length !== 0 && objectData.length !== 0 && periodForModal !== undefined: {
                return (
                    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        {incidentsList(
                            objectIdsFinal,
                            periodForModal,
                            'Открытия/закрытия инцидентов в данный период нет'
                        )}
                    </div>
                )
                break
            }
            default: {
                return (
                    <Wrapper height={height}>
                        <Spin />
                    </Wrapper>
                )
            }
        }
    }

    const closeModal = () => {
        setOpenModal(false)
        setPeriodForModal(undefined)
    }

    return (
        <>
            {getRender()}
            {incidentsList !== undefined && (
                <DefaultModal2
                    open={openModal}
                    onCancel={closeModal}
                    showFooterButtons={false}
                    tooltipText="Таблица инцидентов"
                    height="80vh"
                    width="80vw"
                    centered
                >
                    {getRenderForModal()}
                </DefaultModal2>
            )}
        </>
    )
}