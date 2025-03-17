import { deleteConfigByMnemo } from './deleteConfigByMnemo/deleteConfigByMnemo';
import { getConfig } from './getConfig/getConfig';
import { getConfigByMnemo } from './getConfigByMnemo/getConfigByMnemo';
import { patchConfigByMnemo } from './patchConfigByMnemo/patchConfigByMnemo';
import { postConfig } from './postConfig/postConfig';

export default {
    getConfig,
    getConfigByMnemo,
    postConfig,
    patchConfigByMnemo,
    deleteConfigByMnemo
}