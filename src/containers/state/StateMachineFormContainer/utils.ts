
import { SERVICES_STATE_MACHINES } from '@shared/api/State-machines'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IStateMachine, IStateMachinePost } from '@shared/types/state-machines'
import { responseErrorHandler } from '@shared/utils/common'
import { getURL } from '@shared/utils/nav'
import { Modal } from 'antd'


interface ISaveProps {
    id?: string | undefined
    data: IStateMachinePost
    setClassId?: any
    navigate?: any,
    isContinue?: boolean,
    setIsContinue: React.Dispatch<React.SetStateAction<boolean>>;
    stateMachines?: IStateMachine[]
}

export const saveStateMachine = async ({
    id,
    data,
    navigate,
    isContinue,
    setIsContinue,
    stateMachines
}: ISaveProps) => {
    
    const payload = {
        name: data.name,
        is_attribute: data.is_attribute ?? false,
        classes: data.classes ?? [],
        attributes: data.attributes ?? []


    }
    const response = id
        ? await SERVICES_STATE_MACHINES.Models.putStateMachineById(id, payload)
        : await SERVICES_STATE_MACHINES.Models.postStateMachines(payload);


    if (response.success) {

        Modal.success({
            content: `Обработчик состояний успешно ${id ? 'изменен' : 'создан'}`,
        });

        if (isContinue) {
            let stateMachineCount

            if (id) {
                stateMachines.forEach((machine, index) => {
                    if (machine.id == Number(id)) {
                        stateMachineCount = index + 1
                    }
                })

            }
            
            else {
                stateMachineCount = stateMachines.length + 1
            }
            

            localStorage.setItem('currentPage', String( Math.ceil(stateMachineCount / 10)));
            navigate(getURL(
                `${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`, 
                'constructor'
            ))
            // navigate(`/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`)
            setIsContinue(false)
        } else {
            navigate(getURL(
                `${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.UPDATE}/${response?.data?.id}`, 
                'constructor'
            ))
            // navigate(
            //     `/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.UPDATE}/${response?.data?.id}`
            // )
        }
    }

    else {
        responseErrorHandler({
            response: response,
            modal: Modal,
            errorText: `Ошибка при ${id ? 'редактировании' : 'создании'} обработчика состояний`,
        })
    }
}