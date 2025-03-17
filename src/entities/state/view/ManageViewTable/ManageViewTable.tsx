import React, { useEffect, useState } from 'react'
import { Col, Space, TableProps } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import { CustomStatesSimpleTable } from './CustomStatesSimpleTable'
import { FormInstance } from 'antd/es/form';
import { operationsColumnsViewTable, statesProps } from '@entities/state/statesData/statesTableData';
import { statesOptions } from '@entities/state/statesData/statesFormData';


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
    form?: FormInstance
    editedInitialValues: any
    disableForm?: boolean

}

/**
 * Обычная таблица с отключаемым тулбаром
 *
 * @param rows - ряды таблицы
 * @param toolbar - настройки тулбара
 **/


const ManageViewTable: React.FC<ISimpleTable> = ({ form,   disableForm, ...props }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const [rowSelection, setModalSelection] = useState({
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: false,
    })
    const { view_params } = props.editedInitialValues;

    const [viewParams, setViewParams] = useState([])

    const [actualTypes, setActualTypes] = useState([])



    useEffect(() => {
        if (view_params) {
            setViewParams(view_params)
        }

    }, [props.editedInitialValues])


    useEffect(() => {
        setModalSelection({
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            preserveSelectedRowKeys: false,
        })
    }, [selectedRowKeys])


    const checkIndexesAndColorsToHexString = () => {
        const resultArray = [];
        const fieldValues: { [key: string]: string } = form.getFieldValue(statesProps.view_params.name)

        if (fieldValues !== null && fieldValues !== undefined) {
            const updatedViewParams = Object.values(fieldValues)

            let maxId = 0

            for (let i = 0; i < updatedViewParams.length; i++) {
                const keys = Object.keys(updatedViewParams[i])

                const currId = Number(keys[1].split('-')?.[1])

                maxId = currId > maxId ? currId : maxId

                resultArray?.push({ [keys[0]]: updatedViewParams[i][keys[0]],
                    [keys[1]]: typeof updatedViewParams[i][keys[1]] === 'string'
                        ? updatedViewParams[i][keys[1]]
                        : updatedViewParams[i][keys[1]]?.toHexString()
                });
            }

            return { maxId, resultArray }
        }

        return { maxId: -1, resultArray: [] }
    }


    const handleDeleteRow = (index: number) => {

        const { resultArray } = checkIndexesAndColorsToHexString();

        const data = [...resultArray].filter((param, i) => i !== index)

        setViewParams([...data])

        form.setFieldValue([statesProps.view_params.name], [...data])

        const actualTypes = form.getFieldValue(statesProps.view_params.name)

        setActualTypes(...[actualTypes])
    }



    const handleAddRow = () => {
        const { maxId, resultArray } = checkIndexesAndColorsToHexString();
        const newId = maxId + 1
        const newObj = {
            [`type-${newId }`]: '',
            [`value-${newId }`]: '#FFFFFF',
        }

        const addNewField = resultArray?.length > 0
            ? [
                ...resultArray,
                ...[{ ...newObj }]
            ]
            : [{ ...newObj }]

        form.setFieldValue([statesProps.view_params.name], addNewField)
        setViewParams(addNewField)

    }


    const tableRowDts = () => {
        return viewParams?.map((item, index) => {
            const keys = Object.keys(item)

            return {
                key: index,
                type: item[keys[0]],
                value: item[keys[1]],
                indexKey: Number(keys[1].split('-')?.[1]),
                delete: (
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space >
                            {!disableForm && 
                              <Buttons.ButtonDeleteRow
                                  disabled={disableForm}
                                  onClick={() => handleDeleteRow(index)}
                              />}
                            {/* <Buttons.ButtonDeleteRow
                                disabled={disableForm}
                                onClick={() => handleDeleteRow(index)}
                            /> */}
                        </Space>
                    </Col>
                ),
            }
        }) ?? []
    }



    return (

        <Col xs={24}>
            <CustomStatesSimpleTable
                disableForm={disableForm}
                pagination={false}
                // rowSelection={{ ...rowSelection }}
                columns={operationsColumnsViewTable}
                rows={tableRowDts()}
                ellipsysWidth={200}
                toolbar={{
                    left: null,
                    right: (
                        <Col style={{ marginTop: '-45px' }}>
                            <Buttons.ButtonAdd
                                size="small"
                                shape="circle"
                                text={false}
                                tooltipText="Добавить обработчик отображения"
                                onClick={handleAddRow}
                                disabled={disableForm || viewParams?.length >= statesOptions?.length}
                            />
                        </Col>
                    ),
                }}
                form={form}
                actualTypes={actualTypes}
            />
        </Col>

    )
}

const MemoManageViewTable:  React.FC<ISimpleTable> = React.memo(ManageViewTable)

export default MemoManageViewTable