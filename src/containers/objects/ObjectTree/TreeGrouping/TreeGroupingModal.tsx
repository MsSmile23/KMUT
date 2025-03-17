import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { FC, useEffect, useState } from 'react'
import { Button, Col, Row, Select, SelectProps } from 'antd'
import { DndGroupList } from './DndGroupList'
import { ITreeGroupingModalProps, ITreeStore, ITreeStoreProperties } from '../treeTypes'
import { useTreeStore } from '@shared/stores/trees'
import { CheckBox } from '@shared/ui/forms'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useAccountStore } from '@shared/stores/accounts'
import { saveTreeIdSettings } from '../utils'
import { StoreStates } from '@shared/types/storeStates'
import { ECTooltip } from '@shared/ui/tooltips'

export const TreeGroupingModal: FC<ITreeGroupingModalProps> = ({
    classifiers, closeModal, id
}) => {
    const groupingOrder = useTreeStore((state: ITreeStore) => state.groupingOrder[id])
    const setGroupingOrder = useTreeStore((state: ITreeStore) => state.setGroupingOrder)
    const treeObjectFilter = useTreeStore((state: ITreeStore) => state.treeObjectFilter[id])
    const accountData = useAccountStore((st) => st.store.data?.user)
    const storeState = useAccountStore((st) => st.store.state)
    const [updatingState, setUpdatingState] = useState('idle')
    const [selectValues, setSelectValues] = useState<ITreeStoreProperties['groupingOrder']>([])
    const [dragOrder, setDragOrder] = useState<ITreeStoreProperties['groupingOrder']>(selectValues)
    const [classes, setClasses] = useState<ITreeStoreProperties['visibleClassIds']>([])
    const [visibleClasses, setVisibleClasses] = useState<ITreeStoreProperties['visibleClassIds']>([])
    const [hierarchy, setHierarchy] = useState<ITreeStoreProperties['showHierarchy']>(false)
    const [intermediateClasses, setIntermediateClasses] = useState<ITreeStoreProperties['visibleClassIds']>([])

    const trackId = useTreeStore((state: ITreeStore) => state.trackId[id])
    const visibleClassIds = useTreeStore((state: ITreeStore) => state.visibleClassIds[id])
    const setVisibleClassIds = useTreeStore((state: ITreeStore) => state.setVisibleClassIds)
    const intermediateClassIds = useTreeStore((state: ITreeStore) => state.intermediateClassIds[id])
    const setIntermediateClassIds = useTreeStore((state: ITreeStore) => state.setIntermediateClassIds)
    const showHierarchy = useTreeStore((state: ITreeStore) => state.showHierarchy[id])
    const setShowHierarchy = useTreeStore((state: ITreeStore) => state.setShowHierarchy)

    useEffect(() => {
        setVisibleClasses(visibleClassIds ?? [])
        setIntermediateClasses(intermediateClassIds ?? [])
        setSelectValues(groupingOrder)
        setDragOrder(groupingOrder)
        setHierarchy(showHierarchy)
    }, [groupingOrder])

    useEffect(() => {
        if (trackId === 'none') {
            setHierarchy(false)
            // setShowHierarchy(false, id)

            /* saveTreeIdSettings(
                accountData?.settings,
                {
                    showHierarchy: false,
                },
                id
            ) */
        }
    }, [trackId])
    useEffect(() => {
        const classes = treeObjectFilter.reduce((acc, item) => {
            item.linking.forEach(link => {
                const idx = acc.findIndex(cl => cl.id === String(link.id))

                if (idx < 0) {
                    acc.push({
                        id: String(link.id),
                        name: link.name
                    })
                }
                
            })

            return acc
        }, [] as ITreeStoreProperties['visibleClassIds'])

        setClasses(classes)
    }, [treeObjectFilter])

    const handleSelect: SelectProps['onChange'] = (value, option) => {
        const currValues = option.map(item => ({
            id: item.key,
            name: item.children
        }))

        setSelectValues(currValues)
        setDragOrder(currValues)
    }
    const handleSelectVisible: SelectProps['onChange'] = (value, option) => {
        const currValues = option.map(item => ({
            id: item.key,
            name: item.children
        }))
        
        setVisibleClasses(currValues)
    }
    /* const handleSelectIntermediate: SelectProps['onChange'] = (value, option) => {
        const currValues = option.map(item => ({
            id: item.key,
            name: item.children
        }))

        setIntermediateClasses(currValues)
    } */

    const clearBlockDragAndDrop = () => {
        setSelectValues([])
        setDragOrder([])
    }

    const handleApplyGrouping = () => {
        setUpdatingState('updating')
        saveTreeIdSettings(
            accountData?.settings,
            {
                groupingOrder: dragOrder,
                visibleClasses,
                intermediateClasses,
                showHierarchy: hierarchy
            },
            id
        )

        if (storeState === StoreStates.FINISH) {
            setGroupingOrder(dragOrder, id)
            setIntermediateClassIds(intermediateClasses, id)
            setVisibleClassIds(visibleClasses, id)
            setShowHierarchy(hierarchy, id)
            
            setUpdatingState('finish')
            closeModal()
        }
    }

    const filterOption = (input, option,) => {
        return (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const setOrder = (order: ITreeStoreProperties['groupingOrder']) => {
        setDragOrder(order)
    }

    const intermediateOnChange = (e: CheckboxChangeEvent) => {
        setHierarchy(e.target.checked)
    }

    return (
        <Row
            style={{
                display: 'flex',
                gap: '10px',
                opacity: updatingState === 'updating' ? 0.3 : 1,
            }}
        >
            <Col style={{ width: 350 }}>
                <Button
                    key="0"
                    onClick={handleApplyGrouping}
                    disabled={updatingState === 'updating'}
                    // type="primary"
                    style={{ 
                        backgroundColor: '#26ADE4',
                        color: '#ffffff',
                        width: '100%', 
                        marginBottom: '10px'
                    }}
                >
                    Применить
                </Button>
                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    mode="multiple"
                    onChange={handleSelect}
                    placeholder="Выберите типы группировки"
                    maxTagCount="responsive"
                    autoClearSearchValue={false}
                    allowClear
                    onClear={() => { return }}
                    showSearch
                    filterOption={filterOption}
                    defaultValue={selectValues.map((item) => item.id) ?? []}
                    value={selectValues.map((item) => item.id) ?? []}
                >
                    {Object.entries(classifiers).map(([classId, classifier]) => {
                        return (
                            <Select.Option value={classId} key={classId}>
                                {classifier.name}
                            </Select.Option>
                        )
                    })}
                </Select>
                {trackId === 'lastOpened' && (
                    <>
                        <CheckBox
                            onChange={intermediateOnChange}
                            defaultChecked={showHierarchy}
                            style={{ 
                                width: '100%', 
                                marginBottom: '10px',
                                // backgroundColor: '#26ADE4',
                                // color: '#ffffff', 
                            }}
                        >
                            Отображение дерева объектов с иерархией
                        </CheckBox>
                        {hierarchy && (
                        // {showHierarchy && (
                            <>
                                <Select
                                    style={{ width: '100%', marginBottom: '10px' }}
                                    mode="multiple"
                                    onChange={handleSelectVisible}
                                    placeholder="Выберите видимые классы"
                                    maxTagCount="responsive"
                                    autoClearSearchValue={false}
                                    allowClear
                                    onClear={() => { setVisibleClasses([]) }}
                                    showSearch
                                    filterOption={filterOption}
                                    defaultValue={visibleClasses.map((item) => item.id) ?? []}
                                    value={visibleClasses.map((item) => item.id) ?? []}
                                >
                                    {classes
                                        .filter(classItem => {
                                            return intermediateClasses.findIndex(vis => vis.id === classItem.id) < 0
                                        })
                                        .map((classItem) => {
                                            return (
                                                <Select.Option value={classItem.id} key={classItem.id}>
                                                    {classItem.name}
                                                </Select.Option>
                                            )

                                        })}
                                </Select>
                                {/* <Select
                                    style={{ width: '100%', marginBottom: '10px' }}
                                    mode="multiple"
                                    onChange={handleSelectIntermediate}
                                    placeholder="Выберите промежуточные классы"
                                    maxTagCount="responsive"
                                    autoClearSearchValue={false}
                                    allowClear
                                    onClear={() => { setIntermediateClasses([]) }}
                                    showSearch
                                    filterOption={filterOption}
                                    defaultValue={intermediateClasses.map((item) => item.id) ?? []}
                                    value={intermediateClasses.map((item) => item.id) ?? []}
                                >
                                    {classes
                                        .filter(classItem => {
                                            return visibleClasses.findIndex(vis => vis.id === classItem.id) < 0
                                        })
                                        .map((classItem) => {
                                            return (
                                                <Select.Option value={classItem.id} key={classItem.id}>
                                                    {classItem.name}
                                                </Select.Option>
                                            )
                                        })}
                                </Select> */}
                            </>)}
                    </>
                )}
            </Col>
            <Col
                style={{
                    display: (selectValues.length === 0 || undefined || null) ? 'none' : 'initial',
                    width: 350,
                    border: '1px solid #d9d9d9',
                    borderRadius: '3px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        margin: '10px',
                        padding: '5px',
                        cursor: 'pointer'
                    }}

                >
                    <span>Задайте порядок группировки</span>
                    <span onClick={clearBlockDragAndDrop}>
                        <ECTooltip placement="topRight" title="Сбросить выбранные типы группировки" >
                            <ECIconView icon="CloseCircleOutlined" />
                        </ECTooltip>
                    </span>
                </div>
                <DndGroupList
                    dragOrder={dragOrder}
                    setOrder={setOrder}
                />
            </Col>
        </Row>
    )
}