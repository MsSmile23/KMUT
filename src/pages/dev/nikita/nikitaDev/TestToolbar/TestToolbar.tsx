import { getObjectsAsSelectOptions } from "@shared/lib/MLKit/MLKit"
import { useStateStereotypesStore } from "@shared/stores/statesStereotypes"
import { ButtonSettings } from "@shared/ui/buttons"
import { ECButtonRowExpand } from "@shared/ui/ECUIKit/buttons/ECButtonRowExpand/ECButtonRowExpand"
import { ECButtonRowPlay } from "@shared/ui/ECUIKit/buttons/ECButtonRowPlay/ECButtonRowPlay"
import { ECButtonRowStatus } from "@shared/ui/ECUIKit/buttons/ECButtonRowStatus/ECButtonRowStatus"
import { ECSelect } from "@shared/ui/forms"
import { ECModal } from "@shared/ui/modals"
import { Button } from "antd"
import { useMemo, useState } from "react"


const TestToolbar = ({ selectedClasses = [] }) => {

    const [expanded, setExpanded] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const objectsOptions = useMemo(() => getObjectsAsSelectOptions(selectedClasses), [selectedClasses])
    const [tempSelectedStatuses, setTempSelectedStatuses] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([])
    const statuses = useStateStereotypesStore().store.data

    const statusOptions = statuses.map(status => {
        return {
            value: status.mnemo,
            label: status.view_params.name
        }
    })

    const onStatusModalCancel = () => {
        setOpenModal(false)
        setTempSelectedStatuses([])
    }

    const selectStatuses = () => {
        setSelectedStatuses(tempSelectedStatuses)
        setOpenModal(false)
    }

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', gap: 10 }}>
            <ECButtonRowExpand
                size={'middle'}
                background={'#188EFC'}
                expanded={expanded}
                onClick={() => setExpanded(!expanded)} />
            <ECSelect
                style={{ width: '100%' }}
                options={objectsOptions}
                placeholder="Выберите объекты"
                mode="multiple" />
            <ECButtonRowPlay size={'middle'} background={'#188EFC'} />
            <ECButtonRowStatus onClick={() => setOpenModal(true)} size={'middle'} background="white" />
            <ECModal
                title="Выбор статусов"
                open={openModal}
                onCancel={onStatusModalCancel}
                footer={() => <Button onClick={selectStatuses} type='primary'>Применить</Button>}
                width="max-content"
            >
                <ECSelect
                    style={{ width: '200px' }}
                    value={tempSelectedStatuses}
                    onChange={(selected) => setTempSelectedStatuses(selected)}
                    options={statusOptions}
                    placeholder="Выберите статусы"
                    mode="multiple" />
            </ECModal>
        </div>
    )
}

export default TestToolbar