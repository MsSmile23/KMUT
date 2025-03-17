import { getAccounts } from './getAccounts/getAccounts'
import { postAccounts } from './postAccounts/postAccounts'
import { patchAccountById } from './patchAccountById/patchAccountById'
import { deleteAccountById } from './deleteAccountById/deleteAccountById'
import { getAccountById } from '../Models/getAccountById/getAccountById'
import { patchAccountMyself } from './patchAccountMyself/patchAccountMyself'
import { getAccountMyself } from './getAccountMyself/getAccountMyself'

export default {
    getAccounts,
    getAccountById,
    postAccounts,
    patchAccountById,
    deleteAccountById,
    patchAccountMyself,
    getAccountMyself
}