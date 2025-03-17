/* eslint-disable react/jsx-max-depth */
import { SettingOutlined } from '@ant-design/icons'
import { TreeButton } from '@containers/objects/ObjectTree/TreeHeader/TreeButton'
import { TreeGroupingForm } from '@features/objects/TreeGroupingForm/TreeGroupingForm'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Row, Badge, Button, Modal, Divider } from 'antd'
import { SearchInput } from '../LayoutQuickTreeWrapper/components/SearchInput/SearchInput'
import { TreeSettingsForm } from '../LayoutQuickTreeWrapper/components/TreeSettingsForm/TreeSettingsForm'
import { useEffect, useState } from 'react'
import { FilterForm, FilterOption } from '@features/objects/FilterForm/FilterForm'
import { FormTreeGrouping } from '@features/objects/TreeGroupingForm/types'
import { TreeSettingsParameters } from '../LayoutQuickTreeWrapper/components/TreeSettingsForm/types'
import { QuickTreeDataNode } from '@containers/objects/ObjectTree2/types'
import { useTheme } from '@shared/hooks/useTheme'
import { useDebounce } from '@shared/hooks/useDebounce'
import { IObject } from '@shared/types/objects'

interface IObjectTreeHeaderProps {
    treeData: QuickTreeDataNode[],
    setExpandedKeys?: (keys: string[]) => void;
    expandedKeys?: string[];

    onSettingsChange?: (value: TreeSettingsParameters | null) => void;
    onGroupingOptionsChange?: (value: FormTreeGrouping[]) => void;
    onFiltersChange?: (value: FilterOption[]) => void;
    onTextChange?: (value: string) => void;

    showTrackParentOptions?: boolean;
    trackedObject?: IObject | null | undefined;
    text?: string;
}

export const ObjectTreeHeader = ({
    treeData,
    setExpandedKeys,
    expandedKeys,
    onFiltersChange,
    onGroupingOptionsChange,
    onSettingsChange,
    onTextChange,
    trackedObject,
    text,
    showTrackParentOptions,
}: IObjectTreeHeaderProps) => {
    const theme = useTheme();

    const [textFilterInput, setTextFilterInput] = useState('');
    const textFilterInputDebounced = useDebounce(textFilterInput, 300);

    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [groupingModalOpen, setGroupingModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const [currentFilterFormValue, setCurrentFilterFormValue] = useState<FilterOption[]>([]);
    const [currentGroupingOptions, setCurrentGroupingOptions] = useState<FormTreeGrouping[]>([]);
    const [currentTreeSettings, setCurrentTreeSettings] = useState<TreeSettingsParameters | null>(null);

    const [selectedGroupingOptions, setSelectedGroupingOptions] = useState<FormTreeGrouping[]>([]);
    const [selectedFiltersValue, setSelectedFiltersValue] = useState<FilterOption[]>([]);
    const [treeSettings, setTreeSettings] = useState<TreeSettingsParameters | null>(null);

    const expandAllKeys = () => {
        function getNodeKeys(node: QuickTreeDataNode): string[] {
            const childrenKeys: string[] = (node.children || []).map(node => getNodeKeys(node)).flat();

            return [node.key as string, ...childrenKeys];
        }
        const allNodesKeys = treeData.map(node => getNodeKeys(node)).flat();

        setExpandedKeys?.(allNodesKeys.slice(0, 5000));
    }

    const collapsAllKeys = () => setExpandedKeys?.([]);

    const expandButtonHandler = () => {
        expandedKeys?.length === 0 ? expandAllKeys() : collapsAllKeys();
    }

    const onApplyFilters = () => {
        setSelectedFiltersValue(currentFilterFormValue);
        setFilterModalOpen(false);
    }

    const onApplyGrouping = () => {
        setSelectedGroupingOptions(currentGroupingOptions);
        setGroupingModalOpen(false);
    }

    const onApplySettings = () => {
        setTreeSettings(currentTreeSettings);
        setSettingsModalOpen(false);
    }

    useEffect(() => {
        onSettingsChange?.(treeSettings);
    }, [treeSettings]);

    useEffect(() => {
        onFiltersChange?.(selectedFiltersValue);
    }, [selectedFiltersValue]);

    useEffect(() => {
        onGroupingOptionsChange?.(selectedGroupingOptions);
    }, [selectedGroupingOptions]);

    useEffect(() => {
        onTextChange?.(textFilterInputDebounced);
    }, [textFilterInputDebounced])

    useEffect(() => {
        if (text !== undefined) {
            setTextFilterInput(text);
        }
    }, [text]);

    return (
        <>
            <Col style={{ padding: '0 16px', paddingRight: 32, position: 'relative' }}>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Col>
                        <TreeButton
                            onClickHandler={expandButtonHandler}
                            iconSize={25}
                            title={expandedKeys?.length === 0 ? 'Раскрыть все' : 'Закрыть все'}
                            icon={expandedKeys?.length === 0 ? 'FolderOutlined' : 'FolderOpenOutlined'}
                        />
                    </Col>

                    <Col>
                        <ECTooltip title="Параметры группировки">
                            <Badge
                                color={theme?.components?.tree?.showcase?.badges?.background}
                                count={selectedGroupingOptions?.length} offset={[-1, 5]} style={{ zIndex: 100, }}
                            >
                                <Button
                                    onClick={() => setGroupingModalOpen(true)}
                                    icon={<ECIconView icon="ClusterOutlined" style={{ fontSize: 25 }} />}
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        minWidth: 24,
                                        minHeight: 24,
                                        background: 'transparent',
                                    }}
                                />
                            </Badge>
                        </ECTooltip>
                        <ECTooltip title="Фильтры">
                            <Badge
                                color={theme?.components?.tree?.showcase?.badges?.background}
                                count={selectedFiltersValue.length} offset={[-1, 5]} style={{ zIndex: 100, }}
                            >
                                <Button
                                    onClick={() => setFilterModalOpen(true)}
                                    icon={<ECIconView icon="FilterOutlined" style={{ fontSize: 25 }} />}
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        minWidth: 24,
                                        minHeight: 24,
                                        background: 'transparent',
                                        marginLeft: 8,
                                    }}
                                />
                            </Badge>
                        </ECTooltip>
                    </Col>
                </Row>

                <div
                    style={{ position: 'absolute', right: 6, top: -10, cursor: 'pointer' }}
                    onClick={() => setSettingsModalOpen(true)}
                >
                    <ECTooltip title="Настройки дерева">
                        <SettingOutlined />
                    </ECTooltip>
                </div>

                <Modal
                    width={1200}
                    open={filterModalOpen}
                    onCancel={() => setFilterModalOpen(false)}
                    onOk={onApplyFilters}
                    title="Фильтры дерева"
                    okText="Применить"
                >
                    <FilterForm
                        onChange={setCurrentFilterFormValue}
                        targetClassIds={treeSettings?.targetClassesIds || []}
                    />
                </Modal>

                <Modal
                    width={800}
                    open={groupingModalOpen}
                    onCancel={() => setGroupingModalOpen(false)}
                    onOk={onApplyGrouping}
                    okText="Применить"
                    title="Параметры группировки"
                >
                    <TreeGroupingForm
                        onChange={(options) => setCurrentGroupingOptions(options)}
                        targetClassesIds={treeSettings?.targetClassesIds}
                        groupingClassesIds={treeSettings?.groupingClassesIds}
                        trackedObject={trackedObject}
                    />
                </Modal>

                <Modal
                    width={1000}
                    open={settingsModalOpen}
                    onCancel={() => setSettingsModalOpen(false)}
                    onOk={onApplySettings}
                    title="Настройки дерева"
                    okText="Применить"
                >
                    <Divider style={{ margin: '16px 0' }} />
                    <TreeSettingsForm
                        onChange={settings => setCurrentTreeSettings(settings)}
                        showTrackParentOptions={showTrackParentOptions}
                    />
                </Modal>
            </Col>
            <Col style={{ padding: '0 16px' }}>
                <SearchInput handleSearch={(e) => setTextFilterInput(e.target.value)} searchValue={textFilterInput} />
            </Col>
        </>
    )
}