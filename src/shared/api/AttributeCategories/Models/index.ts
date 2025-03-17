import { getAttributeCategories } from './getAttributeCategories/getAttributeCategories'
import { getAttributeCategoryById } from 
    '../Models/getAttributeCategoryById/getAttributeCategoryById'
import { postAttributeCategories } from 
    './postAttributeCategories/postAttributeCategories'
import { patchAttributeCategoryById } from 
    './patchAttributeCategoryById/patchAttributeCategoryById'
import { deleteAttributeCategoryById } from 
    './deleteAttributeCategoryById/deleteAttributeCategoryById'
    

export default {
    getAttributeCategories,
    getAttributeCategoryById,
    postAttributeCategories,
    patchAttributeCategoryById,
    deleteAttributeCategoryById
}