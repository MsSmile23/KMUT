import { getClasses } from './getClasses/getClasses'
import { getClassById } from '../Models/getClassById/getClassById'
import { postClasses } from './postClasses/postClasses'
import { postClassById } from './postClassById/postClassById'
import { putClassAttributes } from './putClassAttributes'
import { putClassOperations } from './putClassOperations'
import { deleteClassById } from './deleteClassById/deleteClassById'

export default {
    getClasses,
    getClassById,
    postClasses,
    postClassById,
    putClassAttributes,
    putClassOperations,
    deleteClassById
}