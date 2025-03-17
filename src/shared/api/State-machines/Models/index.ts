import { deleteStateMachineById } from './deleteStateMachineById/deleteStateMachineById'
import { getStateMachineById } from './getStateMachineById/getStateMachineById'
import { getStateMachines } from './getStateMachines/getStateMachines'
import { patchStateMachineById } from './patchStateMachineById/patchStateMachineById'
import { postStateMachineTransitions } from './postStateMachineTransitions'
import { postStateMachines } from './postStateMachines/postStateMachines'
import { putStateMachineById } from './putStateMachineById/putStateMachineById'

export default {
    deleteStateMachineById,
    getStateMachineById,
    getStateMachines,
    patchStateMachineById,
    postStateMachines,
    putStateMachineById,
    postStateMachineTransitions
}