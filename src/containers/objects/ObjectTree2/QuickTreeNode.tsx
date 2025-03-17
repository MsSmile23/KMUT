import { StateText } from '@entities/states';
import { selectState, selectStates, useStatesStore } from '@shared/stores/states';
import { useStateEntitiesStore } from '@shared/stores/state-entities';
import { Tag } from 'antd';
import { useStateStereotypesStore } from '@shared/stores/statesStereotypes';
import { memo, useEffect, useMemo } from 'react';
import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { getStateViewParam } from '@shared/utils/states';
import { getURL } from '@shared/utils/nav';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { useNavigate } from 'react-router-dom';
import { ECTooltip } from '@shared/ui/tooltips';
import { QUICKTREE_MAIN_GROUP_KEY, STATUS_TAGS_CACHE_DURATION } from './constants';
import { QuickTreeDataNode, StereotypeTagObject, TagCollection } from './types';

export interface IQuickTreeNodeProps {
    node: QuickTreeDataNode;
    expandedKeys: string[];
    setExpandedKeys: (keys: string[]) => void;
    /** передаём, чтобы подписаться на событие изменения дерева */
    filteredTreeData: QuickTreeDataNode[];
}

export const QuickTreeNode = memo(({ node, expandedKeys, filteredTreeData }: IQuickTreeNodeProps) => {
    const navigate = useNavigate();

    const states = useStatesStore(selectStates);
    const getState = useStatesStore(selectState)
    const { getByIndex: getStateEntityByIndex } = useStateEntitiesStore();
    const stateEntities = useStateEntitiesStore(st => st.store.data);
    const statusStereotypes = useStateStereotypesStore(st => st.store.data);
    const stateId = getStateEntityByIndex({ group: 'objects', indexMnemo: 'id', key: node.extra.objectId });

    const iconColor = getStateViewParam(getState(stateId), 'textColor');
    const isBranchNode = !!node.children;
    const isAllObjectsNode = node.key === QUICKTREE_MAIN_GROUP_KEY;

    const nodeExpanded = useMemo(() => {
        if (!isBranchNode) { return false; }

        return expandedKeys.includes(node.key as string);
    }, [expandedKeys]);

    useEffect(() => {
        if (node.extra.filteredTreeData !== filteredTreeData) {
            node.extra.filteredTreeData = filteredTreeData;
            node.extra.cachedTags = null;
        }
    }, [filteredTreeData])

    // TODO move to utils
    const stereotypeTags: TagCollection = useMemo(() => {
        if (!isBranchNode && !isAllObjectsNode) { return {} }

        if (node.extra.cachedTags) {
            const lastCacheTime = node.extra.tagsCachedTime || new Date().getTime();
            const currentTime = new Date().getTime();

            if (currentTime - lastCacheTime < STATUS_TAGS_CACHE_DURATION) {
                return node.extra.cachedTags;
            }
        }

        function getTagsFromNode(branchNode: QuickTreeDataNode) {
            if (!isBranchNode && !isAllObjectsNode) { return {} }

            // ключ = id стереотипа, значение = StereotypeTagObject
            const stereotypesTagObjects = statusStereotypes.reduce((prev, now) => {
                const tagObject: StereotypeTagObject = {
                    count: 0,
                    stereotype_id: now.id,
                    view_params: {
                        color: now.view_params.params.find(p => p.type === 'textColor')?.value,
                        fill: now.view_params.params.find(p => p.type === 'fill')?.value,
                    },
                    name: now.view_params.name,
                }

                return { ...prev, [now.id]: tagObject };
            }, {} as TagCollection);

            const children: QuickTreeDataNode[] = branchNode.children || [];

            for (const child of children) {
                const stateId = getStateEntityByIndex({
                    group: 'objects', indexMnemo: 'id', key: child.extra.objectId
                });
                const state = getState(stateId);

                if (state && state.state_stereotype_id) {
                    stereotypesTagObjects[state.state_stereotype_id].count++;
                }

                if (child.children) {
                    const childrenTagObjects = getTagsFromNode(child);

                    Object.keys(childrenTagObjects).forEach(stereotypeId => {
                        stereotypesTagObjects[stereotypeId].count += childrenTagObjects[stereotypeId].count;
                    });
                }
            }

            for (const stereotypeTagObject of Object.values(stereotypesTagObjects)) {
                if (stereotypeTagObject.count === 0) {
                    delete stereotypesTagObjects[stereotypeTagObject.stereotype_id]
                }
            }

            return stereotypesTagObjects;
        }
        const tags = getTagsFromNode(node);

        node.extra.cachedTags = tags;
        node.extra.tagsCachedTime = new Date().getTime();

        return tags;
    }, [stateEntities, node, states, statusStereotypes]);

    return (
        <>
            {isBranchNode &&
                <span style={{ marginRight: 4 }}>
                    {isBranchNode && !nodeExpanded && <FolderOutlined />}
                    {isBranchNode && nodeExpanded && <FolderOpenOutlined />}
                </span>}

            <StateText
                onClick={() => {
                    navigate(getURL(
                        `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${node.extra.objectId}`,
                        'showcase'
                    ))
                }}
                stateId={stateId}
                state={states[stateId]}
                icon={{
                    enabled: node.isLeaf && !isAllObjectsNode,
                    name: (isBranchNode || isAllObjectsNode) ? null : (node.icon || 'FileOutlined'),
                    style: {
                        flex: 1,
                        alignItems: 'center',
                        marginLeft: '-20px',
                        height: 20,
                        marginRight: '5px',
                        color: iconColor,
                    }
                }}
            >
                {node.title.toString()}
            </StateText>

            <span style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
                {Object.values(stereotypeTags).map(stereotypeTag => (
                    <ECTooltip title={stereotypeTag.name} key={stereotypeTag.stereotype_id}>
                        <Tag
                            style={{
                                padding: '2px 5px',
                                marginRight: 4,
                                color: stereotypeTag.view_params.color,
                                minWidth: 20,
                                display: 'inline-flex',
                                justifyContent: 'center',
                                backgroundColor: stereotypeTag.view_params.fill,
                            }}
                        >
                            {stereotypeTag.count}
                        </Tag>
                    </ECTooltip>
                ))}
            </span>
        </>
    )
});