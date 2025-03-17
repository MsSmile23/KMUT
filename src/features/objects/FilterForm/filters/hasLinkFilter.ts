import { FilterFunctionType } from '../types';

export type HasLinksFilter = {
    relationId: number,
    has: boolean,
    objectIds?: number[];
}

export const hasLinkFilter: FilterFunctionType<HasLinksFilter> = (object, { objectIds, has, relationId }) => {
    if (!object) {
        return false;
    }

    let isFound = false;

    for (const link of object.links_where_left) {
        if (link.relation_id === relationId) {
            if (objectIds) {
                if (objectIds.includes(link.right_object_id)) {
                    isFound = true;
                }
            } else {
                isFound = true;
            }
        }
    }

    return has ? isFound : !isFound;
}