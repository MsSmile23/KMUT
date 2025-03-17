import { useMemo } from 'react'
import { Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow, ButtonCreatable } from '@shared/ui/buttons'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { columns } from './data'
import { VISIBILITY } from '@shared/config/const'
import { IClass } from '@shared/types/classes'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { useApi2 } from '@shared/hooks/useApi2'
import { getClassStereotypes } from '@shared/api/ClassStereotypes/Models/getClassStereotypes/getClassStereotypes'
import { useClassesStore } from '@shared/stores/classes'
import { getPackages } from '@shared/api/Packages/Models/getPackages/getPackages'
import { ECTooltip } from '@shared/ui/tooltips'
import { getURL } from '@shared/utils/nav'
import { SERVICES_CLASSES } from '@shared/api/Classes'
import ClassesDeleteButton from '@entities/classes/ClassesDeleteButton/ClassesDeleteButton'

const ClassesTableContainer = () => {
    const packages = useApi2(getPackages)
    const classes = useClassesStore((st) => [...st.store.data].sort((a, b) => b.id - a.id))
    const stereotypes = useApi2(getClassStereotypes)

    const navigate = useNavigate()

    const { forceUpdate } = useClassesStore.getState()

    const deleteButtonHandler = async (id: number) => {
        const resp = await SERVICES_CLASSES.Models.deleteClassById(String(id)).then(resp => {
            if (resp.success) {
                forceUpdate()
            }

            return resp
        })

        return resp
    }

    const tableRowData = useMemo(() => {
        return classes.map((item: IClass) => {
            const visibility = VISIBILITY[item.visibility]
            const pack = packages.data.find((pack) => pack.id === item.package_id)
            const stereotype = stereotypes.data.find(({ id }) => item.class_stereotype_id === id)

            return {
                id: item?.id,
                key: `${item.id}`,
                name: item.name,
                codename: item.codename,
                visibility: visibility,
                visibilityFilterValue: item.visibility,
                package: pack?.name,
                packageFilterValue: pack?.mnemo,
                stereotype: stereotype?.name || '---',
                stereotypeFilterValue: stereotype?.mnemo,
                multiplicity: item.multiplicity_left + ' - ' + (item.multiplicity_right ?? '*'),
                abstract: item.is_abstract ? '✔' : '',
                abstractFilterValue: item.is_abstract ? 'Да' : 'Нет',
                actions: (
                    <Space>
                        <ECTooltip title="Редактирование">
                            <ButtonEditRow
                                onClick={() => {
                                    navigate(getURL(
                                        `${ROUTES.CLASSES}/${ROUTES_COMMON.UPDATE}/${item.id}`,
                                        'constructor'
                                    ))
                                    // navigate(`/${ROUTES.CLASSES}/${ROUTES_COMMON.UPDATE}/${item.id}`)
                                }}
                                type="link"
                                icon={<EditOutlined />}
                            />
                        </ECTooltip>
                        <ECTooltip title="Удалить">
                            {/* <ButtonDeleteRow
                                withConfirm
                                style={{ color: '#ffffff', background: '#FF0000' }}
                                type="link"
                                icon={<DeleteOutlined />}
                                onClick={async () => {
                                    const response = await deleteButtonHandler(item.id)

                                    return response
                                }}
                            /> */}
                            <ClassesDeleteButton 
                                withConfirm
                                onClick={async () => {
                                    const response = await deleteButtonHandler(item.id)

                                    return response
                                }}
                                disablePopup={true}
                            />
                        </ECTooltip>
                    </Space>
                ),
            }
        })
    }, [classes, packages.data, stereotypes.data])

    return (
        <EditTable
            loading={packages.loading || stereotypes.loading}
            tableId="classesTable"
            rows={tableRowData}
            columns={columns.map((col) => ({
                ...col,
                ...(col?.key === 'package' ? ({
                    filterType: 'select',
                    filterSelectOptions: packages.data.map((pack) => ({ value: pack.mnemo, label: pack.name }))
                }) : {}),
                ...(col?.key === 'stereotype' ? ({
                    filterType: 'select',
                    filterSelectOptions: stereotypes.data.map((stereo) => ({ value: stereo.mnemo, label: stereo.name }))
                }) : {})
            }))}
            buttons={{
                left: [
                    // <ButtonAdd
                    //     key="button-add-class"
                    //     shape="circle" 
                    //     text={false}
                    //     onClick={() => {
                    //         navigate(getURL(
                    //             `${ROUTES.CLASSES}/${ROUTES_COMMON.CREATE}`, 
                    //             'constructor'
                    //         ))
                    //         // navigate(`/${ROUTES.CLASSES}/${ROUTES_COMMON.CREATE}`)
                    //     }}
                    // />
                    <ButtonCreatable
                        key="button-add-class"
                        shape="circle"
                        entity="classes"
                        buttonAdd={true}
                        text={false}
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.CLASSES}/${ROUTES_COMMON.CREATE}`,
                                'constructor'
                            ))
                        }}

                    />
                ]
            }}
        />
    )
}

export default ClassesTableContainer