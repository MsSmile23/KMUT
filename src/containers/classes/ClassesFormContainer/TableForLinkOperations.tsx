import { ButtonAdd, ButtonCancel } from '@shared/ui/buttons'
import { SimpleTable } from '@shared/ui/tables'
import { Row, Col } from 'antd'
import { FC, useEffect, useState } from 'react'
import { operationsColumns } from './data'
import { SERVICES_OPERATIONS } from '@shared/api/Operations'
import ModalForLinkOperations from './ModalForLinkOperations'

interface ITableForLinkOperations {
    classId?: string
    linkedOperations: number[]
    setLinkedOperations: React.Dispatch<React.SetStateAction<number[]>>
}
const TableForLinkOperations: FC<ITableForLinkOperations> = ({ classId, linkedOperations, setLinkedOperations }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [unLinkedOperations, setUnLinkedOperations] = useState<number[]>([])
    const [operations, setOperations] = useState<any[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
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

    useEffect(() => {
        SERVICES_OPERATIONS.Models.getOperations({ all: true }).then((resp) => {
            if (resp.success) {
                if (resp?.data !== undefined) {
                    setOperations(resp?.data)

                    const localLinkedIds: number[] = []
                    const localUnLinkedIds: number[] = []

                    resp.data.forEach((oper) => {
                        if (oper?.classes_ids?.includes(parseInt(classId, 10))) {
                            localLinkedIds.push(oper?.id)
                        } else {
                            localUnLinkedIds.push(oper?.id)
                        }
                    })

                    setLinkedOperations(localLinkedIds)
                    setUnLinkedOperations(localUnLinkedIds)
                }
            }
        })
    }, [classId])

    const unBindOperations = () => {
        const selectedAttributesForDeleteIds: number[] = []

        selectedRowKeys.forEach((item: string) => {
            const id = item.split('oper_')[1]

            selectedAttributesForDeleteIds.push(parseInt(id, 10))
        })

        const newLinkedOperations: number[] = []

        operations
            .filter((oper) => [...unLinkedOperations, ...selectedAttributesForDeleteIds].includes(oper?.id) == false)
            .forEach((item) => {
                newLinkedOperations.push(item?.id)
            })

        setLinkedOperations(newLinkedOperations)
        setUnLinkedOperations([...unLinkedOperations, ...selectedAttributesForDeleteIds])
        setSelectedRowKeys([])
    }

    return (
        <>
            <SimpleTable
                pagination={false}
                rowSelection={{ ...rowSelection }}
                columns={operationsColumns}
                rows={operations
                    .filter((oper) => linkedOperations.includes(oper?.id))
                    .map(({ id, name }) => ({
                        id,
                        name,
                        key: `oper_${id}`,
                    }))}
                toolbar={{
                    left: null,
                    right: (
                        <Row gutter={5} justify="space-between">
                            <Col>
                                <ButtonAdd
                                    size="middle"
                                    icon={false}
                                    customText="Привязать"
                                    onClick={() => {
                                        setIsModalVisible(true)
                                    }}
                                />
                            </Col>
                            <Col>
                                <ButtonCancel
                                    customText="Отвязать"
                                    disabled={selectedRowKeys?.length > 0 ? false : true}
                                    onClick={() => {
                                        unBindOperations()
                                    }}
                                />
                            </Col>
                        </Row>
                    ),
                }}
            />
            <ModalForLinkOperations
                setIsModalVisible={setIsModalVisible}
                operations={operations}
                isModalVisible={isModalVisible}
                linkedOperations={linkedOperations}
                setLinkedOperations={setLinkedOperations}
                setUnLinkedOperations={setUnLinkedOperations}
                unLinkedOperations={unLinkedOperations}
            />
        </>
    )
}

export default TableForLinkOperations