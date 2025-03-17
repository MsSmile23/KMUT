import { selectStates, useStatesStore } from '@shared/stores/states'
import { selectStateStereotypes, useStateStereotypesStore } from '@shared/stores/statesStereotypes'
import { useMemo } from 'react'
import { IOption, IOptionList } from '../types'
import { sortGroupedList } from '../utils'
export const useStateOptions = ({
    stateMachineIds
}: {
    stateMachineIds?: number[]
}) => {
    const stateStereotypes = useStateStereotypesStore(selectStateStereotypes)
    const states = useStatesStore(selectStates)


    const stereoList = useMemo(() => {
        return stateStereotypes
            .map(stereo => ({
                label: stereo?.view_params?.name,
                value: stereo.id
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [
        stateStereotypes
    ])

    const stateWithMachineList = useMemo(() => {
        const stateList: IOptionList[] = []
        const machineList: IOption[] = []

        states
            .forEach((state) => {
                if (state.state_machine_id) {
                    const machineIdx = machineList.findIndex(machine => machine.value === state.state_machine_id)
                    
                    if (machineIdx < 0) {
                        machineList.push({
                            label: String(state.state_machine.name),
                            value: state.state_machine_id
                        })
                    }

                    if (stateMachineIds && stateMachineIds.length > 0 
                        ? stateMachineIds.includes(state.state_machine_id)
                        : true
                    ) {
                        const idx = stateList.findIndex(group => group?.title === state.state_machine_id)
    
                        if (idx < 0) {
                            stateList.push({
                                label: String(state.state_machine.name),
                                title: state.state_machine_id,
                                options: []
                            })
                            
                            stateList[stateList.length - 1].options.push({
                                label: state?.view_params?.name,
                                value: state.id
                            })
                            
                        } else {
                            stateList[idx].options.push({
                                label: state?.view_params?.name,
                                value: state.id
                            })
                        }
                    }
                    
                } else {
                    const machineIdx = machineList.findIndex(machine => machine.value === 0)

                    if (machineIdx < 0) {
                        machineList.push({
                            label: 'Без стейтмашины',
                            value: 0
                        })
                    }

                    if (stateMachineIds && stateMachineIds.length > 0 
                        ? stateMachineIds.includes(state.state_machine_id)
                        : true
                    ) {
                        const idx = stateList.findIndex(group => group?.title === 0)

                        if (idx < 0) {
                            stateList.push({
                                label: 'Без стейтмашины',
                                title: 0,
                                options: [{
                                    label: state?.view_params?.name,
                                    value: state.id
                                }]
                            })
                        } else {
                            const stateIdx = stateList[idx].options
                                .findIndex(stateOption => stateOption.value === state.id)

                            if (stateIdx < 0) {
                                stateList[idx].options.push({
                                    label: state?.view_params?.name,
                                    value: state.id
                                })
                            }
                        }
                    }
                }
            })

        return {
            state: sortGroupedList(stateList),
            machine: machineList.sort((a, b) => a.label.localeCompare(b.label)),
        }
    }, [
        states,
        stateMachineIds
    ])
    
    return { 
        stereoList, 
        stateList: stateWithMachineList.state,
        stateMachineList: stateWithMachineList.machine
    }
}