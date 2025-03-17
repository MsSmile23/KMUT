import { getRelations } from '@shared/api/Relations/Models/getRelations/getRelations';
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects';
import { IRelation } from '@shared/types/relations';
import { Row, Spin, Tree } from 'antd';
import { TreeProps } from 'antd/lib';
import { FC, useEffect, useMemo, useState } from 'react';
import { QuickTreeNode } from './QuickTreeNode';
import './QuickTree.css';
import { QUICKTREE_MAIN_GROUP_KEY } from './constants';
import { GroupingOption, QuickTreeDataNode } from './types';
import { buildTree } from './utils/buildTree';
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes';
import { applyFiltersToTree } from './utils/applyFiltersToTree';
import { FilterOption } from '@features/objects/FilterForm/FilterForm';
import { IObject } from '@shared/types/objects';
import { Loading3QuartersOutlined, LoadingOutlined } from '@ant-design/icons';
import { LoadingRows, LoadingTab } from '@shared/ui/loadings';

export interface IQuickTreeProps {
    height: number;
    expandedKeys: string[];
    setExpandedKeys: (keys: string[]) => void;
    treeProps: Pick<TreeProps, 'style'>;
    onTreeDataLoaded?: (nodes: QuickTreeDataNode[]) => void;
    filters: FilterOption[];

    groupingOptions: GroupingOption[];
    trackedObject?: IObject;
    targetClassesIds: number[];
}

export const QuickTree: FC<IQuickTreeProps> = ({
    expandedKeys,
    setExpandedKeys,
    onTreeDataLoaded,
    trackedObject,
    filters,
    groupingOptions,
    targetClassesIds,
    ...treeProps
}) => {
    const [treeData, setTreeData] = useState<QuickTreeDataNode[]>([]);
    const [relations, setRelations] = useState<IRelation[]>([]);
    const getObjectByIndex = useObjectsStore(selectObjectByIndex);
    const getClassByIndex = useClassesStore(selectClassByIndex);

    const [isBuildingTree, setIsBuildingTree] = useState(false);

    useEffect(() => {
        // Фетчим все релейшены с бэка
        getRelations({ all: true }).then(response => {
            setRelations(response.data);
        });
    }, []);

    useEffect(() => {
        // строим дерево на основе выбранных группировок
        setIsBuildingTree(true);
        setTreeData([]);

        setTimeout(() => {
            const newTreeDataGroups = buildTree({
                groupingOptions,
                relations,
                targetClassesIds,
                getObjectByIndex,
                getClassByIndex,
                trackedObject,
            });

            const allObjectsNode: QuickTreeDataNode = {
                title: 'Все объекты',
                extra: {
                    objectId: 0,
                },
                isLeaf: false,
                icon: null,
                children: newTreeDataGroups,
                key: QUICKTREE_MAIN_GROUP_KEY
            };

            setTreeData([allObjectsNode]);
            onTreeDataLoaded && onTreeDataLoaded([allObjectsNode]);
            setIsBuildingTree(false);
        }, 500);
    }, [relations, groupingOptions, trackedObject])

    const filteredTreeData = useMemo(() => {
        // фильтруем дерево
        let newTreeData = [...treeData];

        newTreeData = applyFiltersToTree(newTreeData, filters);

        return newTreeData;
    }, [treeData, filters])

    return (
        <>
            <Tree<QuickTreeDataNode>
                {...treeProps}
                className="quickTree"
                style={{ width: 700 }}
                expandedKeys={expandedKeys}
                defaultExpandedKeys={expandedKeys}
                onExpand={(keys: string[]) => setExpandedKeys(keys)}
                titleRender={(node) =>
                    <QuickTreeNode
                        filteredTreeData={filteredTreeData}
                        setExpandedKeys={setExpandedKeys}
                        expandedKeys={expandedKeys}
                        node={node}
                    />
                }
                virtual
                treeData={filteredTreeData}
            />

            {!isBuildingTree && filteredTreeData.length === 0 && (
                <Row style={{ padding: '0 16px', width: '100%' }}>
                    <div
                        style={{
                            padding: 16,
                            backgroundColor: '#ccc5c5',
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        Нет объектов для отображения
                    </div>
                </Row>
            )}

            {isBuildingTree && (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <Spin />
                    <span>Построение дерева</span>
                </div>
            )}
        </>
    )
}