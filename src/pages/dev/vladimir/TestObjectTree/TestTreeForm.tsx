/* eslint-disable react/jsx-max-depth */
import { Col, Form, Row, Divider } from 'antd'
import { Button, Select } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { ITestObjectTree } from './TestObjectTree'
import { useTreeStore } from '@shared/stores/trees'
import { ITrackedClass, ITreeStore } from '@containers/objects/ObjectTree/treeTypes'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { TargetLinkingClassesForm } from '@containers/classes/TargetLinkingClassesForm/TargetLinkingClassesForm'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { saveTreeIdSettings } from '@containers/objects/ObjectTree/utils'
import { StoreStates } from '@shared/types/storeStates'
import { Switch } from '@shared/ui/forms'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useTheme } from '@shared/hooks/useTheme'

export const TestTreeForm: FC<{
    dataWidget: ITestObjectTree
    setSettings: (settings: Partial<ITestObjectTree>) => void
    closeModal: () => void
    objClassIds: ITestObjectTree['classIds']
}> = ({ setSettings, dataWidget, closeModal, objClassIds }) => {
    const classes = useClassesStore(selectClasses).filter((cl) => cl.package_id === PACKAGE_AREA.SUBJECT)
    const storeState = useAccountStore((st) => st.store.state)
    const [updatingState, setUpdatingState] = useState('idle')
    const theme = useTheme()
    const userData = useAccountStore((st) => st.store.data?.user)
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const treeStore = {
        trackId: useTreeStore((state: ITreeStore) => state.trackId[dataWidget.id]),
        setTrackID: useTreeStore((state: ITreeStore) => state.setTrackID),
        classIds: useTreeStore((state: ITreeStore) => state.classIds[dataWidget.id]),
        setClassIds: useTreeStore((state: ITreeStore) => state.setClassIds),
        parentTrackedClasses: useTreeStore((state: ITreeStore) => state.parentTrackedClasses[dataWidget.id]),
        setParentTrackedClasses: useTreeStore((state: ITreeStore) => state.setParentTrackedClasses),
        treeObjectFilter: useTreeStore((state: ITreeStore) => state.treeObjectFilter[dataWidget.id]),
        setAllTreeObjectFilter: useTreeStore((state: ITreeStore) => state.setAllTreeObjectFilter),
        setEmptyTreeObjectFilter: useTreeStore((state: ITreeStore) => state.setEmptyTreeObjectFilter),
    }

    const textColor = useMemo(
        () => createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode),
        [theme?.sideBar?.textColor, theme?.colors, themeMode]
    )

    const [isShowHorizontalScroll, setIsShowHorizontalScroll] = useState<boolean>(
        userData?.settings?.trees?.showHorizontalScroll ?? false
    )
    const [formState, setFormState] = useState({
        classIds: treeStore.classIds ?? dataWidget.classIds,
        parentTrackedClasses: treeStore.parentTrackedClasses ?? dataWidget.parentTrackedClasses,
        trackId: treeStore.trackId ?? dataWidget.trackId,
    })
    const [TLState, setTLState] = useState(
        treeStore.treeObjectFilter.map((objFilter) => {
            return {
                target: objFilter.target.map((cl) => cl.id),
                linking: objFilter.linking.map((cl) => cl.id),
            }
        })
    )

    const [form] = Form.useForm()

    const selectClassOptions = objClassIds.map((item) => {
        return {
            value: item.id,
            label: item.name,
        }
    })

    const trackOptions = [
        {
            value: 'none',
            label: 'Не отслеживать',
        },
        {
            value: 'lastOpened',
            label: 'Последний открытый',
        },
    ]

    const handleChange = (value, opt, key) => {
        const newValue = opt.map((item) => ({
            id: item.value,
            name: item.label,
        }))

        switch (key) {
            case 'classIds': {
                setFormState({
                    ...formState,
                    classIds: newValue,
                })
                // treeStore.setClassIds(newValue, dataWidget.id)
                break
            }
            case 'parentTrackedClasses': {
                setFormState({
                    ...formState,
                    parentTrackedClasses: newValue,
                })
                // treeStore.setParentTrackedClasses(newValue, dataWidget.id)
                break
            }
        }
    }

    const handleClear = (key) => {
        switch (key) {
            case 'classIds': {
                setFormState({ ...formState, classIds: [] })
                // treeStore.setClassIds([], dataWidget.id)
                break
            }
            case 'parentTrackedClasses': {
                setFormState({ ...formState, parentTrackedClasses: [] })
                // treeStore.setParentTrackedClasses([], dataWidget.id)
                break
            }
            case 'trackId': {
                // treeStore.setTrackID('none', dataWidget.id)
                break
            }
        }
    }

    const handleApplyFilters = () => {
        setUpdatingState('updating')

        setSettings(formState)
        const newFilters = TLState.map((filter) => {
            return {
                target:
                    filter?.target?.map((cl) => ({
                        id: cl,
                        name: classes.find((item) => item.id === cl)?.name,
                    })) ?? [],
                linking:
                    filter?.linking?.map((cl) => ({
                        id: cl,
                        name: classes.find((item) => item.id === cl)?.name,
                    })) ?? [],
            }
        })

        const newClassIds: ITrackedClass[] =
            TLState.length > 0 && TLState[0]?.target.length > 0
                ? TLState.reduce((acc, item) => {
                      item.target.forEach((tgt) => {
                          const cls = classes.find((item) => item.id === tgt)
                          const idx = acc.findIndex((cl) => cl.id === cls.id)

                          if (idx < 0 && cls?.package_id === PACKAGE_AREA.SUBJECT) {
                              acc.push({
                                  id: cls.id,
                                  name: cls?.name,
                              })
                          }
                      })

                      return acc
                  }, [] as ITrackedClass[])
                : classes.map((item) => ({ id: item.id, name: item.name }))

        saveTreeIdSettings(
            userData?.settings,
            {
                parentTrackedClasses: formState.parentTrackedClasses,
                trackId: formState.trackId,
                targetClasses: newFilters,
            },
            dataWidget.id,
            isShowHorizontalScroll,
            setUpdatingState
        )
        if (storeState === StoreStates.FINISH) {
            treeStore.setClassIds(newClassIds, dataWidget.id)
            treeStore.setAllTreeObjectFilter(newFilters, dataWidget.id)
            treeStore.setParentTrackedClasses(formState.parentTrackedClasses, dataWidget.id)
            treeStore.setTrackID(formState.trackId, dataWidget.id)

            setUpdatingState('finish')
            closeModal()
        }
    }

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const handleOnFullClear = () => {
        setUpdatingState('updating')
        saveTreeIdSettings(
            userData?.settings,
            {
                parentTrackedClasses: [],
                trackId: 'none',
                targetClasses: [
                    {
                        target: [],
                        linking: [],
                    },
                ],
            },
            dataWidget.id,
            false,
            setUpdatingState
        )
        setFormState({
            classIds: [],
            parentTrackedClasses: [],
            trackId: 'none',
        })
        setTLState([
            {
                target: [],
                linking: [],
            },
        ])
        if (storeState === StoreStates.FINISH) {
            treeStore.setClassIds([], dataWidget.id)
            treeStore.setParentTrackedClasses([], dataWidget.id)
            treeStore.setTrackID('none', dataWidget.id)
            treeStore.setEmptyTreeObjectFilter(dataWidget.id)

            setUpdatingState('finish')
            closeModal()
        }
    }

    const getFormValues = (values) => {
        setTLState(values.classes)
    }

    const buttonStyles: React.CSSProperties = {
        width: 64,
        height: 40,
        backgroundColor: '#26ADE4',
        color: 'white',
        fontSize: 25,
    }

    return (
        <div
            style={{
                fontSize: 14,
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '100%',
                maxHeight: '70vh',
                opacity: updatingState === 'updating' ? 0.3 : 1,
            }}
        >
            <Divider style={{ margin: '10px 0' }} />
            <div
                style={{
                    marginBottom: 12,
                    fontWeight: 'bold',
                    color: textColor,
                }}
            >
                Визуальные настройки дерева
            </div>
            <div style={{ color: textColor }}>
                Скрытие/Показ горизонтальной прокрутки
                <Switch
                    onChange={(e) => setIsShowHorizontalScroll(e)}
                    checked={isShowHorizontalScroll}
                    style={{ marginLeft: '5px' }}
                />
            </div>
            <div>
                <Divider style={{ margin: '10px 0' }} />
                <Row style={{ marginRight: 5 }}>
                    <Col span={14}>
                        <div
                            style={{
                                marginBottom: 12,
                                fontWeight: 'bold',
                                color: textColor,
                            }}
                        >
                            Настройки отображения объектов в дереве
                        </div>
                        <TargetLinkingClassesForm
                            classes={TLState}
                            getFormValues={getFormValues}
                            styles={{
                                button: buttonStyles,
                            }}
                        />
                    </Col>
                    <Col span={10}>
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={(_value, values) => {
                                setFormState(values)
                            }}
                        >
                            <div style={{ marginLeft: 12, fontWeight: 'bold', color: textColor }}>
                                Настройки дочернего дерева
                            </div>
                            <Row style={{ border: '1px solid #d9d9d9', padding: 10, margin: '12px 0 12px 12px' }}>
                                <Form.Item
                                    label={<div style={{ color: textColor }}>{'Отслеживать класс родителя'}</div>}
                                    style={{ marginBottom: 12, width: '100%' }}
                                >
                                    <Select
                                        placeholder="Выберите тип отслеживания"
                                        // allowClear
                                        autoClearSearchValue={false}
                                        maxTagCount="responsive"
                                        onClear={() => handleClear('trackId')}
                                        defaultValue={formState.trackId}
                                        onChange={(value) => {
                                            // treeStore.setTrackID(value, dataWidget.id)
                                            setFormState({ ...formState, trackId: value })
                                        }}
                                        value={formState.trackId}
                                        options={trackOptions}
                                    />
                                </Form.Item>
                                {formState.trackId !== 'none' && (
                                    // {treeStore.trackId !== 'none' && (
                                    <Form.Item label="Класс родителя" style={{ marginBottom: 12, width: '100%' }}>
                                        <Select
                                            placeholder="Выберите класс родителя"
                                            mode="multiple"
                                            allowClear
                                            autoClearSearchValue={false}
                                            maxTagCount="responsive"
                                            onClear={() => handleClear('parentTrackedClasses')}
                                            onChange={(value, opt) => handleChange(value, opt, 'parentTrackedClasses')}
                                            defaultValue={formState.parentTrackedClasses.map((item) => item.id)}
                                            value={formState.parentTrackedClasses.map((item) => item.id)}
                                            options={selectClassOptions}
                                            showSearch
                                            filterOption={filterOption}
                                        />
                                    </Form.Item>
                                )}
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 16,
                    }}
                >
                    <Button
                        key="0"
                        onClick={handleApplyFilters}
                        disabled={updatingState === 'updating'}
                        style={{
                            backgroundColor: '#26ADE4',
                            color: '#ffffff',
                        }}
                    >
                        Применить
                    </Button>
                    <Button
                        key="1"
                        onClick={handleOnFullClear}
                        disabled={updatingState === 'updating'}
                        style={{
                            backgroundColor: '#26ADE4',
                            color: '#ffffff',
                        }}
                    >
                        Очистить
                    </Button>
                </div>
            </div>
        </div>
    )
}
