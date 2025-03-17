import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow, ButtonSettings, ButtonCreatable } from '@shared/ui/buttons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { columns } from './vtemplatesColumns'
import { Divider, Space, Upload, message } from 'antd'
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import {
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    UploadOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates'
import { exportJson, readJsonFile, trimName } from '../VtemplateFormContainer/services'
import { DefaultModal2 } from '@shared/ui/modals'
import { Input } from '@shared/ui/forms'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { ECTooltip } from '@shared/ui/tooltips'
import { maketTypesList, purposeList } from '../VtemplateFormContainer/data'
import { getURL } from '@shared/utils/nav'
import { useVTemplatesStore } from '@shared/stores/vtemplates'
import ModalConflictsClasses from '../VtemplateFormContainer/components/modals/ModalConflictsClasses'
import { jsonParseAsObject } from '@shared/utils/common'

interface VtemplateFormContainerListProps {
    data: dataVtemplateProps<paramsVtemplate>[],
    onChangeDataVtemplate: (data: dataVtemplateProps<paramsVtemplate>[]) => void
    height?: number
    loading?: boolean
    isMobile?: boolean
}

const VtemplateFormContainerList: FC<VtemplateFormContainerListProps> = ({ 
    data, 
    onChangeDataVtemplate, 
    height,
    loading,
    isMobile = false 
}) => {

    const vTemplateStore = useVTemplatesStore()
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingRes, setLoadingRes] = useState<boolean>(false)
    const [openConflictModal, setOpenConflictModal] = useState<boolean>(false)
    const [importData, setImportData] = useState<any>({})
    const [importFullData, setImportFullData] = useState<any>({})
    const [updateVtemplatesData, setUpdateVtemplatesData] = useState<dataVtemplateProps<paramsVtemplate>[]>([])
    const [resolveConflict, setResolveConflict] = useState<boolean>(false)
    const [matchLinkedClasses, setMatchLinkedClasses] = useState<dataVtemplateProps<paramsVtemplate>[]>([])
    const [indexPromise, setIndexPromise] = useState<number>(0)

    const success = (message: string) => {
        messageApi.open({
            type: 'success',
            content: `${message}`,
        });
    };

    const error = (message: string) => {
        messageApi.open({
            type: 'error',
            content: `${message}`,
        });
    };

    const warning = (message: string) => {
        messageApi.open({
            type: 'warning',
            content: `${message}`,
        });
    };

    const navigate = useNavigate()

    const [checkIds, setCheckIds] = useState<React.Key[]>([])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [fileList, setFileList] = useState<any>([])
    const [indexFiles, setIndexFiles] = useState<number[]>([])

    const closeModal = () => {
        setOpenModal(false)
        setFileList([])
        setIndexFiles([])
        setIndexPromise(0)
    }

    const deleteHandler = useCallback((id: number) => {
        setLoadingRes(true)
        SERVICES_VTEMPLATES.Models.deleteVtemplatesById(String(id))
            .then(() => {
                const tmp = data.filter((item) => item.id !== id)

                onChangeDataVtemplate(tmp)
                success('Удалено')
                vTemplateStore.fetchData()
            })
            .catch(() => {
                error('Ошибка удаления')
            })
            .finally(() => setLoadingRes(false))
    }, [data])

    const deleteFile = (id: number) => {
        setFileList((prev) => {
            return prev.filter((item) => item.id !== id)
        })
    }

    //Фильтруем макеты, где нет привязанных объектов
    const filteredVtemplates = vTemplateStore?.store?.data
        ?.filter((vTemplate) => vTemplate.params?.dataToolbar?.objectBindings?.length === 0
        && vTemplate.params?.dataToolbar?.purpose !== 3 && vTemplate.params?.dataToolbar?.purpose !== 4)  // Макеты МП

    const conflictClasses = (data) => {
        return filteredVtemplates
            ?.filter((vTemplate) => vTemplate.params.dataToolbar.classes
                .some(cls => data?.classes?.includes(cls)))
    }

    //Обновление существующих макетов с конфликтующими классами
    const saveConflict = async (template: dataVtemplateProps<paramsVtemplate>) => {
        try {
            // setLoading(true)
            const res = await SERVICES_VTEMPLATES.Models
                .patchVtemplates({ ...template, params: JSON.stringify(template.params) }, template.id)

            success(`${template.name} обновлен`)
            // setLoading(false)

            return res?.success
        } catch (error) {
            console.error(error)
            setResolveConflict(false)
        }
    }

    //Сохранение импортированного макета
    const saveImportVtemplate = async (template, index?: number) => {
        try {
            const updatedImportFullData = 
            Object.keys(importData).length > 0 ? 
                {
                    ...template,
                    params: {
                        ...template?.params,
                        dataToolbar: importData
                    }
                } : template

            const data = { ...updatedImportFullData, params: JSON.stringify(updatedImportFullData.params) }

            const tmp = await SERVICES_VTEMPLATES.Models.postVtemplates(data)

            setIndexFiles(prevIndexFile => [...prevIndexFile, index])
            onChangeDataVtemplate(prevData => [...prevData, tmp.data])
            vTemplateStore.fetchData()
            success(`${template.name} создан`)

            setOpenConflictModal(false)
            setResolveConflict(false)
            setIndexPromise(index + 1)
            promiseSaveImportFile(index + 1, fileList)
        } catch (error) {
            console.error(error);
        }
    }

    //Функция сохранения макетов с конфликтующими классами
    const saveModalConflicts = async () => {
        //Проходим по каждому макету и сохраняем
        const promises = updateVtemplatesData.map(template => saveConflict(template))

        try {
            await Promise.all(promises) 
            // await saveConflict(template)
        } catch (error) {
            console.error(error)
            setResolveConflict(false)
        }

        const timeoutSaveAndExit = setTimeout(() => saveImportVtemplate(importFullData, indexPromise), 1500)
        
        return () => clearTimeout(timeoutSaveAndExit)
    }

    //Если поступили данные для обновления макетов, запускаем функцию сохранения
    useEffect(() => {
        if (resolveConflict && updateVtemplatesData?.length > 0) {
            saveModalConflicts()
        } else if (resolveConflict && conflictClasses(importData)?.length === 0) {
            saveImportVtemplate(importFullData, indexPromise)
        }
    }, [resolveConflict, updateVtemplatesData?.length, importData?.classes?.length])

    const rows = useMemo(() => {
        return data.map((item) => ({
            id: item?.id,
            key: String(item?.id),
            name: item?.name,
            type: maketTypesList.find((maketType) => maketType.value === item?.params.dataToolbar?.maketType)?.label,
            purpose: purposeList.find((purpose) => purpose.value === item?.params.dataToolbar?.purpose)?.label,
            mnemonic: item?.params?.dataToolbar?.mnemonic,
            actions: (
                <Space>
                    <ECTooltip title="Редактирование">
                        <ButtonEditRow
                            onClick={() => {
                                // eslint-disable-next-line max-len
                                if (!isMobile) {
                                    navigate(getURL(`${ROUTES.VTEMPLATES}/${ROUTES_COMMON.UPDATE}/${item?.id}`,
                                        'constructor'))
                                } else {
                                    navigate(getURL(
                                        `/${ROUTES.VTEMPLATES}/${ROUTES.MOBILE}/${ROUTES_COMMON.UPDATE}/${item?.id}`,
                                        'constructor'
                                    ))
                                }
                               
                            }} type="link" icon={<EditOutlined />}
                        />
                    </ECTooltip>
                    <ECTooltip title="Удаление">
                        {' '}
                        <ButtonDeleteRow
                            loading={loadingRes}
                            type="link" icon={<DeleteOutlined />}
                            onClick={() => { deleteHandler(item?.id) }}
                        />{' '}
                    </ECTooltip>
                </Space>
            ),
        }))
    }, [data])

    const rowSelection = {
        columnWidth: 50,
        onSelect: (record, selected, selectedRows) => {
            setCheckIds(selectedRows.map((row) => row.id))
        },
        onSelectAll: (selectedRows) => {
            if (selectedRows) {
                setCheckIds(data.map(({ id }) => id))
            } else {
                setCheckIds([])
            }
        }
    };

    const getExportJson = () => {
        if (!checkIds.length) {
            warning('Выберите макет')

            return
        }

        if (checkIds.length > 1) {
            const zip = new JSZip();

            data.forEach((item) => {
                if (checkIds.includes(item.id)) {
                    const params = item.params
                    const name = trimName(item.name)
                    const data = {
                        name: item.name,
                        vtemplate_type_id: item.vtemplate_type_id,
                        mnemonic: item.mnemonic,
                        params: {
                            ...params
                        }
                    }

                    zip.file(`${name}.json`, JSON.stringify(data));
                }
            })

            zip.generateAsync({ type: 'blob' }).then(function(content) {
                FileSaver.saveAs(content, 'Макеты.zip');
            });

        } else {
            const tmp = data.find((item) => item.id === checkIds[0])
            const name = trimName(tmp.name)
            const params = tmp.params
            const dataTmp = {
                name: tmp.name,
                vtemplate_type_id: tmp.vtemplate_type_id,
                mnemonic: tmp.mnemonic,
                params: {
                    ...params
                }
            }

            exportJson(name, dataTmp)
        }
    }

    const onChangeNameMaket = (id: number, value: string) => {
        const files = fileList.slice()

        files[id].name = value
        setFileList(files)
    }

    //Промис сохранения импортируемых макетов
    const promiseSaveImportFile = async (index: number, files: any[]) => {
        if (index >= files.length) {
            return
        }
        const file = files[index]
        const params = jsonParseAsObject(file.params)

        const result2 = {
            name: file?.name,
            mnemonic: file?.mnemonic,
            vtemplate_type_id: file?.vtemplate_type_id,
            params: {
                ...params,
                dataToolbar: {
                    ...params?.dataToolbar,
                    name: file?.name
                }
            }
        }

        //Ищем совпадения классов в уже созданных макетах
        const conflictVtemplatesLinkedClasses = conflictClasses(result2?.params?.dataToolbar)

        if (conflictVtemplatesLinkedClasses?.length > 0 &&
            result2?.params?.dataToolbar?.objectBindings.length === 0) {
            setImportFullData(result2)
            setImportData(result2?.params?.dataToolbar)
            setMatchLinkedClasses(conflictVtemplatesLinkedClasses)
            setOpenConflictModal(true)

            return
        } else {
            await saveImportVtemplate(result2, index)
        }
    }

    const submitMaket = async () => {
        const filesValid = fileList.slice().filter((item) => item.isValid)

        if (!filesValid.length) {
            error('Нет макетов для сохранения')

            return
        }
        promiseSaveImportFile(indexPromise, filesValid)
    }

    // При добавлении макета перенаправляем в зависимости от вкладки (на Мобильной или Браузерной)
    const handleAddClick = (isMobile: boolean) => {
        if (!isMobile) {
            navigate(getURL(`${ROUTES.VTEMPLATES}/${ROUTES_COMMON.CREATE}`, 'constructor'))
        } else {
            navigate(getURL(`/${ROUTES.VTEMPLATES}/${ROUTES.MOBILE}/${ROUTES_COMMON.CREATE}`, 'constructor'))
        }
    }

    //Закрываем модалку импорта, если все файлы сохранены
    useEffect (() => {
        if (indexFiles.length === fileList.length) {
            closeModal()
        } 
    }, [indexFiles?.length, fileList?.length])

    return (
        <>
            {contextHolder}
            <EditTable
                tableId="classesTable"
                rows={rows}
                loading={loading}
                columns={columns}
                pagination={height ? { position: ['bottomRight'], pageSize: 15 } : false}
                // pagination={false}
                rowSelection={rowSelection}
                // title={() => <Checkbox onChange={(e) => allChecked(e.target.checked)}>select all</Checkbox>}
                buttons={{
                    right: [
                        <div key="2">
                            <ButtonCreatable
                                icon={false}
                                type="primary"
                                shape="circle"
                                entity="vtemplates"
                                buttonAdd={false}
                                onClick={() => setOpenModal(true)}
                            >
                                <DownloadOutlined />

                            </ButtonCreatable>
                        </div>,
                        <ECTooltip title="Экспортировать макет" placement="bottom" key="1">
                            <div>
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    shape="circle"
                                    // style={{ backgroundColor: 'green' }}
                                    onClick={() => getExportJson()}
                                >
                                    <UploadOutlined />
                                </ButtonSettings>
                            </div>
                        </ECTooltip>
                    ],
                    left: [
                        <ButtonCreatable
                            key="1"
                            shape="circle"
                            text={false}
                            entity="vtemplates"
                            buttonAdd={true}
                            onClick={() => handleAddClick(isMobile)}
                        />                                             
                    ]
                }}
            />
            <DefaultModal2
                open={openModal}
                onCancel={closeModal}
                showFooterButtons={false}
                tooltipText="Импорт макетов"
            >
                <Upload
                    accept=".json"
                    multiple={true}
                    beforeUpload={async (file, fileList) => {

                        const output = []
                        // for (const file of fileList) {
                        const parseFile: any = await readJsonFile(file)

                        if (parseFile.params) {
                            output.push({
                                ...parseFile,
                                isValid: true,
                                originalName: file.name
                            })
                        } else {
                            output.push({
                                ...parseFile,
                                id: new Date().getTime(),
                                isValid: false,
                                originalName: file.name
                            })
                        }
                        // }
                        setFileList((prev) => prev.concat(output))

                        return false;
                    }}
                    showUploadList={false}
                >
                    <ButtonSettings
                        icon={false}
                        type="primary"
                    >
                        <div>Выбрать</div>
                    </ButtonSettings>
                </Upload>
                <div>
                    <div style={{ marginBottom: 30 }}>
                        {fileList?.map((file, index) => {
                            if (file.isValid) {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            border: '1px solid #f0f0f0',
                                            marginTop: 10,
                                            padding: 10,
                                            borderRadius: 10,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}
                                        >
                                            {!indexFiles.includes(index) ? 
                                                <>
                                                    <Input
                                                        value={file?.name}
                                                        onChange={(e) => onChangeNameMaket(index, e.target.value)}
                                                        style={{ maxWidth: 400, width: '100%' }}
                                                    />
                                                    <div>.json</div>
                                                </>
                                                : file?.name}
                                        </div>
                                        {!indexFiles.includes(index) ? 
                                            <CloseOutlined onClick={() => deleteFile(file.id)} /> :
                                            <CheckCircleOutlined style={{ color: 'green' }} /> }
                                    </div>
                                )
                            } else {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            border: '1px solid red',
                                            marginTop: 10,
                                            padding: 10,
                                            borderRadius: 10,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            {file.originalName} - невалидный макет
                                        </div>
                                        <CloseOutlined onClick={() => deleteFile(file.id)} />
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <Divider />
                    {!!fileList.length && indexFiles.length !== fileList.length && (
                        <ButtonSettings
                            icon={false}
                            type="primary"
                            onClick={submitMaket}
                        >
                            <div>Создать</div>
                        </ButtonSettings>
                    )}
                </div>
            </DefaultModal2>
            <DefaultModal2
                title="Обнаружены конфликты по привязанным классам"
                open={openConflictModal}
                width="70vw"
                onCancel={() => setOpenConflictModal(false)}
                onOk={() => setResolveConflict(true)}
                loading={loading}
            >
                <ModalConflictsClasses 
                    matchVtemplatesLinkedClasses={matchLinkedClasses} 
                    baseSettings={importData}
                    setUpdateVtemplatesData={setUpdateVtemplatesData}
                    setBaseSetting={setImportData}
                    resolveConflict={resolveConflict}
                />
            </DefaultModal2>
        </>

    )
}

export default VtemplateFormContainerList