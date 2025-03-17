import { useAttributesStore } from '@shared/stores/attributes'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { runProbes } from '@shared/api/Actions/Models/runProbes/runProbes'
import { Button, Card, Checkbox, Collapse } from 'antd'
import ProbeTable from '../ProbeTable/ProbeTable'
import { selectItem } from '../utils'
import { OATreeToolbar } from '@containers/widgets/WidgetCenterAnalysisMetrics/CenterAnalysisMetrics/OATreeToolbar/OATreeToolbar'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { DownOutlined, RightOutlined } from '@ant-design/icons'

const ObjectList = ({ data, objectAttributeFilter }) => {
    const getAttr = useAttributesStore().getAttributeById
    const [expandedPanels, setExpandedPanels] = useState([])
    const [selectedAll, setSelectedAll] = useState<boolean>(false)
    const [responses, setResponse] = useState([])
    const [loading, setLoading] = useState({})
    const [requestCount, setRequestCount] = useState(null)
    const [selectedItems, setSelectedItems] = useState({
        selectedObjects: {},
        selectedProbes: {},
        selectedAttributes: {},
    })

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const allPanelKeys = Array.from({ length: data?.length }, (_, index) => `${index}`)

    const handleCheckboxChange = useCallback((item, checked: boolean) => {
        setSelectedItems((prevState) => ({
            ...prevState,
            ...selectItem(prevState, item, checked),
        }))
    }, [])

    const expandAll = useCallback(() => {
        if (expandedPanels.length === allPanelKeys.length) {
            setExpandedPanels([])
            return
        }
        setExpandedPanels(allPanelKeys)
    }, [expandedPanels, allPanelKeys])

    const runSelectedProbes = useCallback(() => {
        setResponse([])
        const selectedProbes = selectedItems.selectedProbes
        const probesIds = new Set([
            ...Object.keys(selectedProbes).filter((key) => selectedProbes[key] == true),
            ...Object.keys(selectedItems.selectedAttributes).map((attr) => attr.split('-')[0]),
        ])
        setRequestCount(probesIds.size)

        probesIds.forEach((probeId) => {
            setLoading((prev) => ({ ...prev, [probeId]: { flag: true, attempts: 1 } }))
            runProbeWithRetries(probeId, 3)
        })
    }, [selectedItems.selectedProbes])

    const runProbeWithRetries = async (probeId, retries) => {
        let attempt = 1
        while (attempt <= retries) {
            const response = await runProbes({ id: probeId })
            console.log('response', response)
            if (!response.success) {
                if (response?.status === 504) {
                    setLoading((prev) => ({ ...prev, [probeId]: { flag: true, attempts: ++attempt } }))
                    if (attempt === retries + 1) {
                        setLoading((prev) => ({ ...prev, [probeId]: { flag: false, attempts: attempt } }))
                    }
                    continue
                }
                setLoading((prev) => ({ ...prev, [probeId]: { flag: false, attempts: attempt } }))
                break
            }
            setResponse((prev) => [...prev, { ...response, id: probeId }])
            setLoading((prev) => ({ ...prev, [probeId]: { flag: false, attempts: attempt } }))
            break
        }
    }

    const filterAttributes = (attributes) => {
        if (objectAttributeFilter) return attributes?.filter((attr) => objectAttributeFilter?.includes(attr.id))

        return attributes
    }

    const filterProbes = (probes) => {
        return probes
            ?.map((probe) => ({
                ...probe,
                object_attributes: filterAttributes(probe.object_attributes),
            }))
            ?.filter((probe) => probe.object_attributes?.length > 0)
    }

    const filtredData = useMemo(
        () =>
            data
                ?.map((item) => {
                    const filteredProbes = filterProbes(item.probes)
                    if (filteredProbes?.length > 0)
                        return {
                            ...item,
                            probes: filteredProbes,
                        }
                })
                .filter((item) => !!item),
        [data]
    )

    const generateStyles = () => {
        return `
            .ant-collapse-content-box {
                background-color: ${backgroundColor ?? '#ffffff'} !important;
                color: ${textColor ?? '#000000'} !important;
            }
            .ant-table-container {
                background-color: ${backgroundColor ?? '#ffffff'} !important;
                color: ${textColor ?? '#000000'} !important;
            }
                .ant-table-cell.ant-table-cell-row-hover {
                color: ${textColor ?? '#000000'} !important;
                background-color: ${backgroundColor ?? '#ffffff'} !important;
                }
                .ant-table-caption{
                    color: ${textColor ?? '#000000'} !important;}
        `
    }

    return (
        <div>
            <style>{generateStyles()}</style>
            <Button
                style={{ margin: '20px 0 20px 0', background: 'transparent', color: textColor || 'black' }}
                onClick={expandAll}
            >
                Раскрыть всё
            </Button>
            <Collapse
                expandIcon={({ isActive }) => (
                    <RightOutlined rotate={isActive ? 90 : 0} style={{ color: textColor || 'black' }} />
                )}
                activeKey={expandedPanels}
                onChange={(keys: string[]) => setExpandedPanels(keys)}
                size="small"
                items={filtredData?.map((item) => {
                    return {
                        key: item.id,
                        label: (
                            <>
                                <Checkbox
                                    key={item.id}
                                    onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                                    checked={selectedItems.selectedObjects[item.object.id]}
                                    onClick={(e) => e.stopPropagation()}
                                ></Checkbox>
                                <span style={{ color: textColor || '#000000' }}> {item.object.name}</span>
                            </>
                        ),
                        children: (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 30,
                                    background: backgroundColor || 'transparent',
                                }}
                                key={`object-${item.object.id}`}
                            >
                                {item.probes?.map((probe) => (
                                    <ProbeTable
                                        key={probe.prid}
                                        probe={probe}
                                        selectedItems={selectedItems}
                                        handleCheckboxChange={handleCheckboxChange}
                                        getAttr={getAttr}
                                        response={responses?.find((response) => response.id == probe.prid)?.data}
                                        loading={loading[probe.prid]}
                                    />
                                ))}
                            </div>
                        ),
                    }
                })}
            />
            <Card
                style={{
                    width: '100%',
                    marginTop: 20,
                    position: 'sticky',
                    bottom: 0,
                    background: backgroundColor || '#fafafa',
                    zIndex: 9999,
                }}
            >
                <div style={{ display: 'flex', gap: 20 }}>
                    <Button
                        style={{ color: textColor || 'black', background: 'transparent' }}
                        onClick={() => {
                            handleCheckboxChange(filtredData, !selectedAll)
                            setSelectedAll(!selectedAll)
                        }}
                    >
                        Выбрать всё
                    </Button>
                    <Button
                        style={{ color: textColor || 'black' }}
                        disabled={!Object.values(selectedItems.selectedAttributes).some((el) => el == true)}
                        onClick={runSelectedProbes}
                    >
                        Измерить выбранное
                    </Button>
                    <Button
                        style={{ color: textColor || 'black' }}
                        disabled={
                            !(responses.length > 0 && responses.length == requestCount) ||
                            !Object.values(selectedItems.selectedAttributes).some((el) => el == true)
                        }
                    >
                        Сохранить результаты
                    </Button>
                    <Button style={{ color: textColor || 'black' }} disabled>
                        Сохранить протокол
                    </Button>
                    <Button style={{ color: textColor || 'black' }} disabled>
                        Печать
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default ObjectList
