import { getObjects } from './getObjects/getObjects'
import { getObjectById } from './getObjectById/getObjectById'
import { postObjects } from '../Models/postObjects/postObjects'
import { patchObjectById } from './patchObjectById/patchObjectById'
import { putObjectById } from './putObjectById/putObjectById'
import { deleteObjectById } from './deleteObjectById/deleteObjectById'
import { createManyObjects } from './createManyObjects/createManyObjects'
import { getObjectStateHistory } from './getObjectStateHistory/getObjectStateHistory'
import { getNotifications } from './getNotifications/getNotifications'
import { postDefineDiscovery } from './postDefineDiscovery/postDefineDiscovery'
import { patchObjectAttribute } from './patchObjectAttribute/patchObjectAttribute'
import { getObjectAttribute } from './getObjectAttribute/getObjectAttribute'
import { getObjectAttributes } from './getObjectAttributes/getObjectAttributes'
import { getDiscoveredObjects } from './getDiscoveredObjects/getDiscoveredObjects'
import { getObjectsByClassId } from './getObjectsByClassId/getObjectsByClassId'
import { searchObjects } from './searchObjects/SearchObjects'
import { getObjectsStatuses } from './getObjectsStatuses/getObjectsStatuses'

export default {
    getObjects,
    getObjectById,
    getObjectStateHistory,
    getNotifications,
    postObjects,
    patchObjectById,
    putObjectById,
    deleteObjectById,
    createManyObjects,
    postDefineDiscovery,
    patchObjectAttribute,
    getObjectAttribute,
    getObjectAttributes,
    getDiscoveredObjects,
    getObjectsByClassId,
    getObjectsStatuses,
    searchObjects
}