import { QuickTreeSettings } from '@containers/objects/ObjectTree2/types';
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts';

export const saveTreeSettings = async (prevSettings: any, treeSettings: QuickTreeSettings) => {
    const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({
        settings: {
            ...prevSettings,
            treeV2: treeSettings,
        }
    })
}