/* eslint-disable max-len */
import { FC, useMemo, useState } from 'react'
import { IOATreeToolbarProps } from './types'
import { useStateStereotypesStore } from '@shared/stores/statesStereotypes'
// import { getObjectsAsSelectOptions } from '@shared/lib/MLKit/MLKit'
import { ECButtonRowExpand } from '@shared/ui/ECUIKit/buttons/ECButtonRowExpand/ECButtonRowExpand'
import { ECSelect } from '@shared/ui/forms'
import { ECButtonRowPlay } from '@shared/ui/ECUIKit/buttons/ECButtonRowPlay/ECButtonRowPlay'
import { ECModal } from '@shared/ui/modals'
import { Button } from 'antd'
import { useDebounceCallback } from '@shared/hooks/useDebounce'
import OAForceMeas from '@pages/dev/nikita/nikitaDev/OAForceMeas/OAForceMeas'
import { getDefaultStateParams, getStateViewParamsFromState } from '@shared/utils/states'
import ECColorCircle from '@shared/ui/ECUIKit/common/ECColorCircle/ECColorCircle'
import { BaseButton } from '@shared/ui/buttons'
import { ECTooltip } from '@shared/ui/tooltips'
import { FilterOutlined } from '@ant-design/icons'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

const stateStereotypeAsOptions = (statuses = useStateStereotypesStore.getState().store.data) => {
    return [
        {
            value: 0,
            label: (
                <div style={{ display: 'flex' }}>
                    <ECColorCircle color={getDefaultStateParams().fill} />
                    Без состояния
                </div>
            ),
        },
        ...statuses.map((status) => {
            return {
                value: status.id,
                label: (
                    <div style={{ display: 'flex' }}>
                        <ECColorCircle color={getStateViewParamsFromState(status)?.fill} />
                        {status.view_params.name}
                    </div>
                ),
            }
        }),
    ]
}

export const OATreeToolbar: FC<IOATreeToolbarProps> = (props) => {
    const {
        allExpanded,
        objectAttributeIds,
        objectIds,
        classIds,
        stateIdsFilter,
        setOATreeToolbarSettings,
        visualSettings,
    } = props ?? {}
    const [openModal, setOpenModal] = useState(false)
    const [openRunMeasesModal, setOpenRunMeases] = useState(false)
    const storeClasses = useClassesStore(selectClasses)
    const getByIndex = useObjectsStore(selectObjectByIndex)
    const objectsOptions = useMemo(() => {
        // return getObjectsAsSelectOptions(classIds)

        const currentClasses = classIds ? storeClasses.filter((cls) => classIds.includes(cls.id)) : storeClasses

        return currentClasses
            .reduce((acc, cls) => {
                const idx = acc.findIndex((accItem) => accItem.value === cls.id)

                if (idx < 0 && cls.package_id === PACKAGE_AREA.SUBJECT) {
                    const currObjects = getByIndex('class_id', cls.id)

                    const groupIdx = acc.findIndex((accItem) => accItem.title === cls?.id)

                    if (groupIdx < 0) {
                        acc.push({
                            title: cls?.id,
                            label: cls?.name,
                            options: [],
                        })
                    }

                    currObjects.forEach((obj) => {
                        const newGroupIdx = groupIdx < 0 ? acc.length - 1 : groupIdx
                        const idx = acc[newGroupIdx].options.findIndex((accItem) => accItem.value === obj.id)

                        if (idx < 0) {
                            acc[newGroupIdx].options.push({
                                label: obj.name,
                                value: obj.id,
                            })
                        }
                    })
                }

                return acc
            }, [])
            .reduce((res, group) => {
                if (group.options.length > 0) {
                    res.push({
                        ...group,
                        options: group.options.sort((a, b) => a.label.localeCompare(b.label)),
                    })
                }

                return res
            }, [])
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [classIds])
    const [selectedStatuses, setSelectedStatuses] = useState(stateIdsFilter)
    const stateStereotypeOptions = useMemo(() => stateStereotypeAsOptions(), [])
    // const [probeIds, setProbeIds] = useState([])
    // const [meases, setMeases] = useState([])
    const [loading, setLoading] = useState(false)
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const color = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const background = isShowcase ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) : '#ffffff'

    // runProbes({ id: '4569839' }).then(response => console.log(response.data))

    // const startMeas = async () => {
    //     setLoading(true)
    //     const takenMeases = []

    //     setTreeControllerSettings({
    //         objectAttributeValues: []
    //     })

    //     try {
    //         const promises = probeIds.map(async probe => {
    //             const attributesMeas = (await runProbes({ id: `${probe}` })).data;

    //             attributesMeas.forEach(attributeMeas => {
    //                 if (objectAttributeIds?.includes(attributeMeas.obj_attr_id)) {
    //                     takenMeases.push({ id: attributeMeas?.obj_attr_id, value: attributeMeas?.value });
    //                 }
    //             });
    //         });

    //         await Promise.all(promises);
    //         setLoading(false)
    //         setMeases(takenMeases)
    //     } catch {
    //         throw new Error('Ошибка запуска измерений')
    //     } finally {
    //         setLoading(false)
    //     }

    // }

    // useEffect(() => {
    //     const fetchProbes = async () => {
    //         if (objectIds.length < 1) {
    //             setProbeIds([]);

    //             return
    //         }
    //         const probes = (await getProbes(objectIds)).data;

    //         setProbeIds(probes.map(probe => probe.prid));
    //     };

    //     fetchProbes();
    // }, [objectIds]);

    // useEffect(() => {
    //     if (meases.length > 0) {
    //         setTreeControllerSettings({
    //             objectAttributeValues: meases
    //         })
    //     }
    // }, [meases])

    const onStatusesApply = useDebounceCallback(() => {
        if (selectedStatuses?.length > 0) {
            const selected = stateStereotypeOptions.filter((el) => selectedStatuses.includes(el.value))

            setOATreeToolbarSettings({
                stateIdsFilter: selected?.map((el) => el.value),
            })
        } else {
            setOATreeToolbarSettings({
                stateIdsFilter: [],
            })
        }
        setOpenModal(false)
    }, 200)

    const setSelectedObjects = useDebounceCallback((selected) => {
        setOATreeToolbarSettings({
            objectIds: selected,
        })
    }, 200)

    const toggleExpandedAll = () => {
        setOATreeToolbarSettings({
            allExpanded: !allExpanded,
        })
    }

    const handleSearch = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    // TODO: Дебаунс на отправку селектов, доделать setSelectedObjects

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                gap: 10,
                padding: 10,
                height: '52px',
                // height: '6%',
                // width: '100%',
                backgroundColor: background ?? 'transparent',
                border: `${visualSettings?.layout?.borderWidth ?? 0}px solid ${
                    visualSettings?.layout?.borderColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                boxShadow: `0 0 ${visualSettings?.layout?.boxShadowWidth ?? 2}px ${
                    visualSettings?.layout?.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                borderRadius: `${visualSettings?.layout?.borderRadius ?? 8}px`,
            }}
        >
            <ECButtonRowExpand
                size="small"
                expanded={allExpanded}
                onClick={toggleExpandedAll}
                type="default"
                background={background}
                color={color}
                baseStyle={color || background ? false : true}
            />
            <ECSelect
                value={objectIds}
                onChange={(selected) => {
                    setSelectedObjects(selected)
                }}
                allowClear
                style={{ width: '100%' }}
                options={objectsOptions}
                placeholder="Выберите объекты"
                mode="multiple"
                maxTagCount="responsive"
                filterOption={handleSearch}
                showSearch
            />
            <ECButtonRowPlay
                tooltipText={
                    objectAttributeIds?.length > 0
                        ? 'Опросить измерения'
                        : 'Выберите хотя бы один атрибут в зоне списка объектов и атрибутов'
                }
                size="small"
                // background="#188EFC"
                loading={loading}
                disabled={objectAttributeIds?.length < 1 || objectIds.length < 1 || loading}
                type="default"
                background={background}
                color={color}
                baseStyle={color || background ? false : true}
                onClick={() => setOpenRunMeases(!openRunMeasesModal)}
            />

            <ECTooltip title="Выбрать статус">
                <BaseButton
                    type="default"
                    shape="circle"
                    size="small"
                    onClick={() => setOpenModal(true)}
                    style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                    icon={<FilterOutlined />}
                />
            </ECTooltip>
            <ECModal
                title="Выбор статусов"
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={
                    <Button
                        onClick={() => {
                            setOpenModal(false)
                            onStatusesApply()
                        }}
                        type="primary"
                    >
                        Применить
                    </Button>
                }
                width="max-content"
            >
                <ECSelect
                    style={{ width: '200px' }}
                    allowClear
                    maxTagCount="responsive"
                    value={selectedStatuses}
                    onChange={(selected) => setSelectedStatuses(selected)}
                    options={stateStereotypeOptions}
                    filterOption={handleSearch}
                    showSearch
                    placeholder="Выберите статусы"
                    mode="multiple"
                />
            </ECModal>
            <ECModal
                title="Запуск измерений"
                open={openRunMeasesModal}
                onCancel={() => setOpenRunMeases(false)}
                footer={() => <> </>}
                width="max-content"
            >
                <OAForceMeas objectAttributeIds={objectAttributeIds} objectId={objectIds} />
            </ECModal>
        </div>
    )
}