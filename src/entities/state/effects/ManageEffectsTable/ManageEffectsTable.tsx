import React, { useEffect, useState } from 'react'
import { Col, Space, TableProps } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import CustomEffectsSimpleTable from './CustomEffectsSimpleTable'
import { FormInstance } from 'antd/lib/form/Form'
import { operationsColumnsEffectsTable, statesProps } from '@entities/state/statesData/statesTableData'


interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows?: any[],
    rowSelection?: any
    ellipsysWidth?: number | string
    rowId?: number | string
    form?: FormInstance<any>
    editedInitialValues: any
}

/**
 * Обычная таблица с отключаемым тулбаром
 *
 * @param rows - ряды таблицы
 * @param toolbar - настройки тулбара
 **/

export const ManageEffectsTable: React.FC<ISimpleTable> = ({ form, ...props }) => {
    // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    //     setSelectedRowKeys(newSelectedRowKeys)
    // }

    // const [rowSelection, setModalSelection] = useState({
    //     selectedRowKeys,
    //     onChange: onSelectChange,
    //     preserveSelectedRowKeys: false,
    // })

    const [effectsParams, setEffectParams] = useState([])


    useEffect(() => {
        const effectObject = props?.editedInitialValues?.effects

        if (effectObject && props.rowId) {
            setEffectParams( effectObject )
        }
    }, [props.editedInitialValues])



    // useEffect(() => {
    //     setModalSelection({
    //         selectedRowKeys: selectedRowKeys,
    //         onChange: onSelectChange,
    //         preserveSelectedRowKeys: false,
    //     })
    // }, [selectedRowKeys])

    const checkIndexes = () => {
        const resultArray = [];
        const fieldValues: { [key: string]: string } = form.getFieldValue(statesProps.effects.name)

        if (fieldValues !== null && fieldValues !== undefined) {
            const updatedEffectsParams = Object.values(fieldValues)

            let maxId = 0

            for (let i = 0; i < updatedEffectsParams.length; i++) {
                const keys = Object.keys(updatedEffectsParams[i])

                const currId = Number(keys[1].split('-')?.[1])

                maxId = currId > maxId ? currId : maxId

                resultArray?.push({
                    [keys[0]]: updatedEffectsParams[i][keys[0]],
                    [keys[1]]: updatedEffectsParams[i][keys[1]],
                    [keys[2]]: updatedEffectsParams[i][keys[2]]
                });
            }

            return { maxId, resultArray }
        }

        return { maxId: -1, resultArray: [] }
    }

    const handleAddRow = () => {
        const { maxId, resultArray } = checkIndexes();
        const newId = maxId + 1
        const newObj = {
            [`type-${newId }`]: '',
            [`operation-${newId }`]: '',
            [`action-${newId }`]: '',
        }

        const addNewField = resultArray?.length > 0
            ? [
                ...resultArray,
                ...[{ ...newObj }]
            ]
            : [{ ...newObj }]

        form.setFieldValue([statesProps.effects.name], addNewField)
        setEffectParams(addNewField)
    }

    const handleDeleteRow = (index: number) => {

        const { resultArray } = checkIndexes();

        const data = [...resultArray].filter((param, i) => i !== index)

        setEffectParams([...data])
        form.setFieldValue([statesProps.effects.name], [...data])
    }

    const tableRowDts = () => {
        return effectsParams?.map((item, index) => {
            const keys = Object.keys(item)

            return {
                key: index,
                type: item[keys[0]],
                operation: item[keys[1]],
                action: item[keys[2]],
                indexKey: Number(keys[1].split('-')?.[1]),
                delete: (
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space >
                            <Buttons.ButtonDeleteRow
                                // withConfirm
                                // popupTitle = "Удалить состояние?"
                                onClick={() => handleDeleteRow(index)}
                                // onConfirm={() => {
                                //     // deleteAttributeById(`${attr.id}`).then(() => {
                                //     //     //attributes.request()
                                //     // })
                                // }}
                            />
                        </Space>
                    </Col>
                ),
            }
        })
    }


    return (

        <Col xs={24}>
            <CustomEffectsSimpleTable
                pagination={false}
                // rowSelection={{ ...rowSelection }}
                columns={operationsColumnsEffectsTable}
                rows={tableRowDts()}
                // ellipsysWidth={200}
                toolbar={{
                    left: null,
                    right: (
                        <Col style={{ marginTop: '-45px' }}>
                            <Buttons.ButtonAdd
                                size="small"
                                shape="circle"
                                text={false}
                                tooltipText="Добавить обработчик эффектов"
                                onClick={() => handleAddRow()}
                                disabled={false}
                            />
                        </Col>


                    ),
                }}
            />
        </Col>
    )
}

const MemoManageEffectsTable: React.FC<ISimpleTable> = React.memo(ManageEffectsTable)

export default MemoManageEffectsTable