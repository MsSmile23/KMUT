import { getAttributes } from './getAttributes/getAttributes'
import { getAttributeById } from 
    '../Models/getAttributeById/getAttributeById'
import { postAttributes } from './postAttributes/postAttributes'
import { patchAttributeById } from './patchAttributeById/patchAttributeById'
import { deleteAttributeById } from './deleteAttributeById/deleteAttributeById'
import { updateAttributesLinks } from './updateAttributesLinks/updateAttributesLinks'

export default {
    getAttributes,
    getAttributeById,
    postAttributes,
    patchAttributeById,
    deleteAttributeById,
    updateAttributesLinks
}