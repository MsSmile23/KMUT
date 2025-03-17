import { useTheme } from '@shared/hooks/useTheme';
import { ObjectTreeHeader } from '../ObjectTreeHeader/ObjectTreeHeader';
import { Col, Divider } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useObjectsStore } from '@shared/stores/objects';
import { useTreeStore } from '@shared/stores/trees';
import { TreeSettingsParameters } from '../LayoutQuickTreeWrapper/components/TreeSettingsForm/types';
import { IObject } from '@shared/types/objects';
import { GroupingOption, QuickTreeDataNode } from '@containers/objects/ObjectTree2/types';
import { FilterOption } from '@features/objects/FilterForm/FilterForm';
import { QuickTree } from '@containers/objects/ObjectTree2/QuickTree';
import { FormTreeGrouping } from '@features/objects/TreeGroupingForm/types';

interface ILayoutChildTreeWrapper {
    height: number;
}

export const LayoutChildTreeWrapper = ({ height }: ILayoutChildTreeWrapper) => {
    const treeContainerRef = useRef<HTMLDivElement>(null);

    const theme = useTheme();

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<QuickTreeDataNode[]>([]);
    const [textFilter, setTextFilter] = useState('');


    const [selectedGroupingOptions, setSelectedGroupingOptions] = useState<FormTreeGrouping[]>([]);
    const [selectedFiltersValue, setSelectedFiltersValue] = useState<FilterOption[]>([]);
    const [settings, setSettings] = useState<TreeSettingsParameters | null>(null);

    const [trackedObject, setTrackedObject] = useState<null | IObject>();

    const location = useLocation();
    const objectid = useParams().id;
    const getObjectByIndex = useObjectsStore(st => st.getByIndex);
    const trackedParentClassesids = useTreeStore(st => st.trackedParentClassesids);
    const setTrackedParentClassesids = useTreeStore(st => st.setTrackedParentClassesids);

    const horizontalScroll: boolean = settings?.horizontalScroll ?? false;
    const treeOffset = 128;

    const groupingOptions: GroupingOption[] = useMemo(() => {
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

        return groupingOptions;
    }, [selectedGroupingOptions, settings]);

    const filters: FilterOption[] = useMemo(() => {
        const newFilters: FilterOption[] = [
            {
                parameters: {
                    text: textFilter,
                },
                type: 'textFilter',
            },
            ...selectedFiltersValue,
        ];

        return newFilters;
    }, [textFilter, selectedFiltersValue]);

    useEffect(() => {
        if (!settings?.trackParentClass) {
            setTrackedObject(undefined);

            return ;
        }

        if (objectid) {
            const objectId = Number(objectid)
            const object = getObjectByIndex('id', objectId);

            if (
                object && trackedParentClassesids.includes(object?.class_id)
            ) {
                setTrackedObject(object);
            } else {
                setTrackedObject(null);
            }
        }
    }, [location.pathname, trackedParentClassesids, settings]);

    useEffect(() => {
        if (settings?.trackParentClass) {
            setTrackedParentClassesids(settings?.parentClassesIds || []);
        }
    }, [settings]);

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
                showTrackParentOptions
                setExpandedKeys={setExpandedKeys}
                onFiltersChange={filters => setSelectedFiltersValue(filters)}
                onGroupingOptionsChange={options => setSelectedGroupingOptions(options)}
                expandedKeys={expandedKeys}
                onSettingsChange={value => setSettings(value)}
                text={textFilter}
                onTextChange={value => setTextFilter(value)}
                trackedObject={trackedObject}
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
                    expandedKeys={expandedKeys}
                    setExpandedKeys={setExpandedKeys}
                    filters={filters}
                    groupingOptions={groupingOptions}
                    height={height - treeOffset}
                    targetClassesIds={settings?.targetClassesIds || []}
                    treeProps={{
                        style: {
                            width: 700,
                        },
                    }}
                    onTreeDataLoaded={setTreeData}
                    trackedObject={trackedObject}
                />
            </Col>
        </div>
    )
}