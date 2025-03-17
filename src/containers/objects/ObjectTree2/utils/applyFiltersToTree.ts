import { FilterOption } from '@features/objects/FilterForm/FilterForm';
import { QuickTreeDataNode } from '../types';
import { utils } from '@features/objects/FilterForm/filters';

export const applyFiltersToTree = (tree: QuickTreeDataNode[], filters: FilterOption[]) => {
    function getSearchedChildren(node: QuickTreeDataNode) {
        const newChildren = (node.children || [])
            .map(node => getSearchedChildren(node))
            .filter(Boolean);

        const newNode: QuickTreeDataNode = {
            ...node,
        }

        if (newChildren.length > 0) {
            newNode.children = newChildren;
        } else {
            delete newNode.children;
        }

        
        if (!node.extra.targetClassNode && newChildren.length === 0) {
            return null;
        }
        
        // let isMatch = true;
        // for (const filter of filters) {
        //     // isMatch = filter(node.extra.object);


        //     if (!isMatch) {
        //         break;
        //     }
        // }
        const isMatch = utils.applyFiltersToObject(node.extra.object, filters);

        if (node.extra.targetClassNode && !isMatch) {
            return null;
        }

        return newNode;
    }

    return tree.map(node => getSearchedChildren(node)).filter(Boolean);
}