import { ButtonAdd } from '@shared/ui/buttons'
import { DefaultModal } from '@shared/ui/modals/DefaultModal/DefaultModal'
import { SimpleTable } from '@shared/ui/tables'
import { Row } from 'antd'
import { FC, useEffect, useState } from 'react'

interface IModalForLinkOperations {
    isModalVisible: boolean
    operations: any[]
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    unLinkedOperations: number[]
    setUnLinkedOperations: React.Dispatch<React.SetStateAction<number[]>>
    linkedOperations: number[]
    setLinkedOperations: any

    // handleModalSubmit: () => void,
    // handleCancel: () => void
}
const ModalForLinkOperations: FC<IModalForLinkOperations> = ({
    isModalVisible,
    operations,
    setIsModalVisible,
    setLinkedOperations,
    setUnLinkedOperations,
    unLinkedOperations,
    linkedOperations,
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const [rowSelection, setModalSelection] = useState({
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: false,
    })

    useEffect(() => {
        setModalSelection({
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            preserveSelectedRowKeys: false,
        })
    }, [selectedRowKeys])

    const handleModalSubmit = () => {
        const selectedModalAttributesIds: number[] = []

        selectedRowKeys.forEach((item: string) => {
            const id = item.split('modal_operation_')[1]

            selectedModalAttributesIds.push(parseInt(id, 10))
        })
        const localUnLinkedIds: number[] = []


        operations
            .filter((oper) => selectedModalAttributesIds.includes(oper?.id) == false)
            .forEach((item) => {
                localUnLinkedIds.push(item?.id)
            })
        setUnLinkedOperations(localUnLinkedIds)
        setLinkedOperations([...linkedOperations, ...selectedModalAttributesIds])
        setSelectedRowKeys([])
        setIsModalVisible(false)
    }

    return (
        <DefaultModal
            title="Привязать операции"
            width="30%"
            isModalVisible={isModalVisible}
            handleCancel={() => {
                setIsModalVisible(false)
            }}
        >
            <SimpleTable
                scroll={{ y: '80vh' }}
                pagination={false}
                style={{ height: '100%', maxHeight: '100%' }}
                rowSelection={{ ...rowSelection }}
                rows={operations
                    .filter((oper) => unLinkedOperations.includes(oper?.id))
                    .map(({ id, name }) => ({
                        id,
                        name,
                        key: `modal_operation_${id}`,
                    }))}
                columns={[{ key: 'name', title: 'Операции', dataIndex: 'name' }]}
            />

            <Row justify="end">
                <ButtonAdd
                    size="middle"
                    style={{ marginTop: '10px' }}
                    customText="Привязать"
                    icon={false}
                    onClick={() => {
                        handleModalSubmit()
                    }}
                />
            </Row>
        </DefaultModal>
    )
}

export default ModalForLinkOperations