import { VISIBILITY } from '@shared/config/const'
import { ButtonAdd } from '@shared/ui/buttons'
import { DefaultModal } from '@shared/ui/modals/DefaultModal/DefaultModal'
import { SimpleTable } from '@shared/ui/tables'
import { Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import { columns } from './data'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'

interface IModalForLinkAttributes {
    isModalVisible: boolean
    modalRowSelection: any
    attributesForModal: any[]
    handleModalSubmit: () => void,
    handleCancel: () => void
}
const ModalForLinkAttributes: FC<IModalForLinkAttributes> = ({
    isModalVisible,
    modalRowSelection,
    attributesForModal,
    handleModalSubmit,
    handleCancel
}) => {

    const [rows, setRows] = useState<any[]>([])

    useEffect(() => {
        const localRows: any[] = attributesForModal.map((attr) => {
            return {
                id: attr?.id,
                key: `modal_attribute_${attr.id}`,
                name: attr?.name,
                visibility: VISIBILITY[attr.visibility],
                multiplicity: `${attr.multiplicity_left}/${attr.multiplicity_right ?? '*'}`,
                type: attr?.data_type?.name,
                startValue: attr?.initial_value ?? '-',
                category: attr?.attribute_category?.name ?? 'Нет категории',
                bd: attr?.history_to_db ? '+' : '-',
                cash: attr?.history_to_cache ? '+' : '-',
                readonly: attr?.readonly ? '+' : '-',
            
            }
        })


        setRows(localRows)

    }, [ attributesForModal])


    return (
        <DefaultModal
            title="Привязать атрибуты"
            width="80%"
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
        >
            {/* <SimpleTable
                scroll={{ y: '80vh' }}
                pagination={false}
                style={{ height: '100%', maxHeight: '100%',  }}
                rowSelection={{ ...modalRowSelection }}
                rows={rows}
                columns={columns.filter(item => item.dataIndex !== 'actions')}
            /> */}

            <EditTable
                scroll={{ y: '80vh' }}
                pagination={false}
                style={{ height: '100%', maxHeight: '100%',  }}
                rowSelection={{ ...modalRowSelection }}
                rows={rows}
                columns={columns.filter(item => item.dataIndex !== 'actions')}
            />
            <Row justify="end">
                <ButtonAdd 
                    size="middle" style={{ marginTop: '10px' }}
                    customText="Привязать"
                    icon={false}
                    onClick={handleModalSubmit} 
                />
            </Row>
        </DefaultModal>
    )
}

export default ModalForLinkAttributes