import { IRelation } from '@shared/types/relations';
import { IObject } from '@shared/types/objects';
import { IClass } from '@shared/types/classes';
import { IClassesStore } from '@shared/stores/classes';
import { ChainObject, GroupingChainOption, GroupingOption, QuickTreeDataNode } from '../types';

interface BuildTreeProps {
    relations: IRelation[];
    groupingOptions: GroupingOption[];
    targetClassesIds: number[];
    getObjectByIndex: <T extends keyof { id: string, class_id: string }>
        (indexMnemo: T, key: number) => T extends 'class_id' ? IObject[] : IObject;
    getClassByIndex: (indexMnemo: keyof IClassesStore['index'], key: number) => IClass;
    trackedObject?: IObject | null | undefined;
}

export const buildTree = ({
    relations,
    getObjectByIndex,
    groupingOptions,
    targetClassesIds,
    getClassByIndex,
    trackedObject,
}: BuildTreeProps) => {
    let newTreeDataGroups: QuickTreeDataNode[] = [];

    const startTime = new Date().getTime();

    // Создаём массив порядка группировок
    const groupingChain: GroupingChainOption[] = [
        {
            type: 'target_class',
        }
    ];

    for (const groupingOption of groupingOptions) {
        if (groupingOption[0] === 'r') {
            // Если группировка по связи
            const relationId = Number(groupingOption.slice(1));
            const relation = relations.find(rel => rel.id === relationId);

            if (relation) {
                groupingChain.push({
                    type: 'by_relation',
                    parent_class_id: relation.right_class_id,
                    relation,
                });
            }
        }

        if (groupingOption[0] === 'c') {
            // Если группировка по классам
            groupingChain.push({
                type: 'by_class',
            });
        }
    }

    // Для каждего целевого класса строим дерево
    let iteration = 0;

    for (const targetClassId of targetClassesIds) {
        iteration++;

        const targetObjects = getObjectByIndex('class_id', targetClassId)
        // .slice(0, 3); // для тестов на маленьких объёмах данных

        // console.log('[branches]', groupingChain)
        const tree = {};


        // Для каждого объекта строим цепочку
        targetObjects.forEach((targetObject) => {
            const objectChain: ChainObject[] = [{
                type: 'object',
                class_id: targetObject.class_id,
                object: targetObject,
                id: targetObject.id,
            }];

            for (const groupingOption of groupingChain) {
                if (groupingOption.type === 'by_relation') {
                    const left_class_id = groupingOption.relation.left_class_id;
                    const left_object_chain = objectChain
                        .find(chainObj =>
                            chainObj.type === 'object' && chainObj.class_id === left_class_id
                        );

                    if (!left_object_chain) {
                        continue;
                    }

                    const left_object = left_object_chain.type === 'object' ? left_object_chain.object : null;

                    if (left_object && left_object.links_where_left) {
                        const right_object_id = left_object.links_where_left
                            .filter(link => link.relation_id === groupingOption.relation.id)[0]?.right_object_id;
                        const right_object = getObjectByIndex('id', right_object_id);


                        objectChain.push({
                            type: 'object',
                            class_id: right_object?.class_id || -1,
                            object: right_object,
                            id: right_object?.id,
                        });
                    }
                }

                if (groupingOption.type === 'by_class') {
                    objectChain.push({
                        type: 'class',
                        class: targetObject.class,
                        id: targetObject.class_id,
                    });
                }
            }

            function populateTree(objectChain: string[]) {
                let cur_subtree = tree;

                for (let i = objectChain.length - 1; i >= 0; i--) {
                    const objId = objectChain[i] || 'ungrouped';

                    if (!cur_subtree[objId]) {
                        cur_subtree[objId] = i === 0 ? null : {};
                    }
                    cur_subtree = cur_subtree[objId];

                }
            }

            if (trackedObject) {
                const hasTrackedObject = !!objectChain
                    .filter(obj => obj.type === 'object')
                    .find(obj => obj.object?.id === trackedObject.id);

                if (!hasTrackedObject) {
                    return;
                }
            }

            // Если включен фильтр по отслеж. объекту, но он null
            if (trackedObject === null) {
                return ;
            }

            const tree_path = [];
            const current_path = [`${iteration}`];

            for (let i = objectChain.length - 1; i >= 0; i--) {
                const chain_part = objectChain[i];

                const id = chain_part.type === 'class' ? chain_part.class.id : (chain_part?.object?.id || 'ungrouped');

                tree_path.push(`${chain_part.type}-<${current_path.join('_')}>-${id}`);

                current_path.push(`${chain_part.type}:${chain_part.id}`);
            }

            tree_path.reverse();

            populateTree(tree_path);
        });

        // console.log('[tree]', tree);

        // eslint-disable-next-line no-inner-declarations
        function turnTreeIntoTreeNodes(tree: any, keyPath: string[]): QuickTreeDataNode[] {
            return Object.keys(tree).map(idKey => {
                const entityId = idKey.slice(idKey.lastIndexOf('-') + 1);
                const children = tree[idKey] ? turnTreeIntoTreeNodes(tree[idKey], [...keyPath, idKey]) : [];

                if (idKey.startsWith('object')) {
                    const objId = Number(entityId);

                    if (Number.isNaN(objId)) {
                        const node: QuickTreeDataNode = {
                            key: idKey,
                            extra: {
                                objectId: -1,
                            },
                            isLeaf: false,
                            title: 'Без группы',
                        }

                        if (children.length) {
                            node.children = children;
                        }

                        return node;
                    } else {
                        const object = getObjectByIndex('id', objId);
                        const node: QuickTreeDataNode = {
                            key: idKey,
                            extra: {
                                objectId: objId,
                                object,
                                targetClassNode: targetClassesIds.includes(object.class_id),
                            },
                            isLeaf: children.length === 0 && object.class_id === targetClassId,
                            title: object?.name,
                        }

                        if (children.length) {
                            node.children = children;
                        }

                        return node;
                    }
                }

                if (idKey.startsWith('class')) {
                    const classId = Number(entityId);

                    if (Number.isNaN(classId)) {
                        const node: QuickTreeDataNode = {
                            key: idKey,
                            extra: {
                                objectId: -1,
                            },
                            isLeaf: false,
                            title: 'Без класса',
                        }

                        if (children.length) {
                            node.children = children;
                        }

                        return node;
                    } else {
                        const class_object = getClassByIndex('id', classId);
                        const node: QuickTreeDataNode = {
                            key: idKey,
                            extra: {
                                objectId: -1,
                            }, // TODO fix?
                            isLeaf: false,
                            title: class_object?.name,
                        }

                        if (children.length) {
                            node.children = children;
                        }

                        return node;
                    }
                }
            });
        }
        const nodes = turnTreeIntoTreeNodes(tree, []);

        newTreeDataGroups = newTreeDataGroups.concat(nodes);
    }

    const nowTime = new Date().getTime();

    // console.log('[tree finished building]', nowTime - startTime);

    return newTreeDataGroups
}