/* eslint-disable react/jsx-max-depth */
import { useTheme } from '@shared/hooks/useTheme';
import { Col, Divider } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounceCallback } from '@shared/hooks/useDebounce';
import { selectAccount, useAccountStore } from '@shared/stores/accounts';
import { saveTreeSettings } from './utils/saveTreeSettings';
import { useConfigSection } from './hooks/useFrontPageConfig';
import { GroupingOption, QuickTreeDataNode, QuickTreeSettings } from '@containers/objects/ObjectTree2/types';
import { QuickTree } from '@containers/objects/ObjectTree2/QuickTree';
import { FilterOption } from '@features/objects/FilterForm/FilterForm';
import { FilterPresetsPanel } from './components/FilterPresetsPanel/FilterPresetsPanel';
import { FilterFormPreset } from '@features/objects/FilterPresetsForm/types';
import { FormTreeGrouping } from '@features/objects/TreeGroupingForm/types';
import { TreeSettingsParameters } from './components/TreeSettingsForm/types';
import { useTreeStore } from '@shared/stores/trees';
import { ObjectTreeHeader } from '../ObjectTreeHeader/ObjectTreeHeader';

interface LayoutQuickTreeWrapper {
    height: number;
    onChangeShowChildTree?: (showChildTree: boolean) => void;
}

export const LayoutQuickTreeWrapper = ({
    height,
    onChangeShowChildTree,
}: LayoutQuickTreeWrapper) => {
    console.log(11)
    const treeContainerRef = useRef<HTMLDivElement>(null);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<QuickTreeDataNode[]>([]);
    const [textFilter, setTextFilter] = useState('');

    const [selectedFilterPreset, setSelectedFilterPreset] = useState<null | FilterFormPreset>(null);
    
    const [selectedGroupingOptions, setSelectedGroupingOptions] = useState<FormTreeGrouping[]>([]);
    const [selectedFiltersValue, setSelectedFiltersValue] = useState<FilterOption[]>([]);
    const [treeSettings, setTreeSettings] = useState<TreeSettingsParameters | null>(null);
    
    const account = useAccountStore(selectAccount);
    const theme = useTheme();
    const treeOffset = 160;
    const horizontalScrollbarHeight = 16;
    
    const setTrackedParentClassesids = useTreeStore(st => st.setTrackedParentClassesids);
    
    const groupingOptions = useMemo(() => {
        const groupingOptions: GroupingOption[] = selectedGroupingOptions.map<GroupingOption>(option => {
            if (option.type === 'by_relation') {
                return `r${option.relation.id}`
            }
            
            if (option.type === 'by_class') {
                return 'c';
            }

            return 'c';
        });

        groupingOptions.reverse();

        return groupingOptions
    }, [selectedGroupingOptions, treeSettings]);

    const config = useConfigSection('front_settings');
    const horizontalScroll: boolean = treeSettings?.horizontalScroll ?? config?.tree?.treeHorizontalScroll ?? false;

    const saveSettingDebounced = useDebounceCallback(() => {
        const treeOptionsSettings: QuickTreeSettings = {
            textFilterValue: textFilter || '',
            horizontalScroll: true,
            expandedKeys,
        }
        
        saveTreeSettings(account.user.settings, treeOptionsSettings);
    }, 1000);
    
    const filters: FilterOption[] = useMemo(() => {
        const filters = selectedFilterPreset ? selectedFilterPreset.filters : selectedFiltersValue;
        
        const newFilters: FilterOption[] = [
            {
                parameters: {
                    text: textFilter,
                },
                type: 'textFilter',
            },
            ...filters,
        ];


        return newFilters;
    }, [textFilter, selectedFiltersValue, selectedFilterPreset]);

    useEffect(() => {
        saveSettingDebounced();
    }, [expandedKeys, textFilter]);
    
    useEffect(() => {
        const treeOptionsSettings: QuickTreeSettings | undefined = account.user.settings.treeV2;

        if (treeOptionsSettings) {
            setExpandedKeys(treeOptionsSettings.expandedKeys || []);
            setTextFilter(treeOptionsSettings.textFilterValue || '');
        }
    }, []);

    useEffect(() => {
        if (treeSettings) {
            onChangeShowChildTree?.(treeSettings.trackParentClass);
            setTrackedParentClassesids(treeSettings.parentClassesIds || []);
        }
    }, [treeSettings]);

    const calculateAntdScroolOffset = () => {
        const calculate = () => {
            const container = treeContainerRef.current;
            const antdScrollbar: HTMLDivElement = container
                .querySelector('.quickTree .ant-tree-list-scrollbar-vertical');
            const offset = 14;

            if (antdScrollbar) {
                antdScrollbar.style.left = `${container.clientWidth - offset + container.scrollLeft}px`;
            }
        }

        queueMicrotask(calculate);
    }

    useEffect(() => {
        // следим за скроллом
        const container = treeContainerRef.current;
        const andTreeList = document.querySelector('.quickTree .ant-tree-list');

        const observer = new MutationObserver(() => {
            calculateAntdScroolOffset();
        })

        observer.observe(container, {
            attributes: true,
            characterData: true,
        });
        observer.observe(andTreeList, {
            attributes: true,
            characterData: true,
            childList: true,
        });

        container.onscroll = () => calculateAntdScroolOffset();
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: 16,
                paddingRight: 0,
                paddingLeft: 0,
                paddingBottom: 0,
                borderRadius: theme?.components?.tree?.showcase?.borderRadius || 16,
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px',
                height: height,
            }}
        >
            <ObjectTreeHeader
                treeData={treeData}
                setExpandedKeys={setExpandedKeys}
                onFiltersChange={filters => setSelectedFiltersValue(filters)}
                onGroupingOptionsChange={options => setSelectedGroupingOptions(options)}
                onSettingsChange={settings => setTreeSettings(settings)}
                expandedKeys={expandedKeys}
                text={textFilter}
                onTextChange={value => setTextFilter(value)}
            />

            <Divider style={{ margin: '14px 0' }} />
            <Col
                style={{
                    overflowY: 'hidden',
                    overflowX: horizontalScroll ? 'auto' : 'hidden',
                    height: height - treeOffset,
                }}
                ref={treeContainerRef}
            >
                <QuickTree
                    height={height - treeOffset - horizontalScrollbarHeight}
                    expandedKeys={expandedKeys}
                    setExpandedKeys={setExpandedKeys}
                    groupingOptions={groupingOptions}
                    targetClassesIds={treeSettings?.targetClassesIds || []}
                    filters={filters}
                    treeProps={{
                        style: {
                            width: 700,
                        },
                    }}
                    onTreeDataLoaded={setTreeData}
                />
            </Col>

            <Col>
                <FilterPresetsPanel
                    onApplyPreset={preset => setSelectedFilterPreset(preset)}
                    appliedPresetId={selectedFilterPreset?.id}
                    onUnapplyPreset={() => setSelectedFilterPreset(null)}
                    selectedFilters={selectedFiltersValue}
                    targetClassesIds={treeSettings?.targetClassesIds || []}
                />
            </Col>
        </div>
    )
}