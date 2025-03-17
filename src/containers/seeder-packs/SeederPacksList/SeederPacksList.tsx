import { CheckOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { SERVICES_SEEDER_PACKAGES } from '@shared/api/SeederPackages'
import { ISeederPackages } from '@shared/types/seeder-packs'
import { BaseButton } from '@shared/ui/buttons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Space } from 'antd'
import modal from 'antd/es/modal'
import { FC, useLayoutEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import { responseErrorHandler } from '@shared/utils/common'
import { DefaultModal2 } from '@shared/ui/modals'

const COLUMNS = [
    
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
    },
    {
        title: 'Название пакета',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Описание',
        dataIndex: 'description',
        key: 'description',
    }

]

const HEADER_HEIGHT  = 305 //*Высота шапки и отступа

const SeederPacksList: FC = () => {
    const [seederPacks, setSeederPacks] = useState<ISeederPackages[]>([])
    const [modalContent, setModalContent] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)


    const getSeederPacks = () => {
        SERVICES_SEEDER_PACKAGES.Models.getSeederPackages({ all: true }).then((resp) => {
            if (resp.success && resp.data) {
                setSeederPacks(resp.data)
            }
            setLoading(false)
        })
    }
    const tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    const installPackageButtonHandler = async (name: string) => {
        const resp = await SERVICES_SEEDER_PACKAGES.Models.postSeederPackage({ name: name })

        if (resp.success) {
            setLoading(true)
            modal.success({
                content: 'Пакет успешно установлен',
            })
            getSeederPacks()
        } else {
            responseErrorHandler({
                response: resp,
                modal: Modal,
                errorText: 'Ошибка установки выбранного пакета',
            })
        }
    }

    const showPackageButtonHandler = (seederPackage: ISeederPackages) => {
        const content = JSON.stringify(seederPackage)

        setModalContent(content || '')
        setIsModalVisible(true)
    }

    useLayoutEffect(() => {
        getSeederPacks()
    }, [])

    const rows = useMemo(() => {
        return seederPacks.map((seederPack) => ({
            key: seederPack.name,
            name: seederPack.name,
            description: seederPack?.nameReadable
            ,
            actions: (
                <Space>
                    <ECTooltip title="Просмотр пакета">
                        <BaseButton
                            onClick={() => {showPackageButtonHandler(seederPack)}}
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            size="small"
                        />
                    </ECTooltip>
                    <ECTooltip title={seederPack.installed ? 'Пакет установлен' : 'Установка пакета'}>
                        {' '}
                        <BaseButton
                            style={{ background: seederPack.installed ? 'grey' : 'green' }}
                            icon={seederPack.installed ? <CheckOutlined /> : <PlusOutlined />}
                            type="primary"
                            shape="circle"
                            disabled={seederPack.installed}
                            size="small"
                            onClick={() => {
                                installPackageButtonHandler(seederPack?.name)
                            }}
                        />{' '}
                    </ECTooltip>
                </Space>
            ),
        }))
    }, [seederPacks])

    return (
        <>
            <DefaultModal2
                title="Просмотр пакета"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                    setModalContent('')
                }}
                destroyOnClose
                footer={null}
            >
                <Col
                    span={24}
                    style={{
                        fontSize: '15px',
                        borderRadius: '0 0 16px 16px',
                        color: '#ffffff',
                        background: '#000000',
                        marginTop: '5px',
                        padding: '10px',
                    }}
                >
                    {modalContent}
                </Col>
            </DefaultModal2>
            <EditTable
                loading={loading}
                tableId="seederPacksTable"
                rows={rows}
                columns={COLUMNS}
                key="seederPacksTable"
                scroll={{ y: tableHeight - HEADER_HEIGHT - 70 }}
            />{' '}
        </>
    )
}

export default SeederPacksList