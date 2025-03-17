import { ButtonEditRow } from "@shared/ui/buttons"
import { Space } from "antd"
import React, { FC } from "react"
import { useClassesStore } from "@shared/stores/classes";
import { SERVICES_CLASSES } from "@shared/api/Classes";
import { ECTooltip } from "@shared/ui/tooltips";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { EditOutlined } from "@ant-design/icons";
import ClassesDeleteButton from "@entities/classes/ClassesDeleteButton/ClassesDeleteButton";
import { useNavigate } from "react-router-dom";



const MarkoTestClassActionCell: FC<{item: any}> = React.memo(({ item }) => {
    console.log(item)
    const { forceUpdate } = useClassesStore.getState()
    const navigate = useNavigate()
    
    const deleteButtonHandler = async (id: number) => {
        const resp = await SERVICES_CLASSES.Models.deleteClassById(String(id)).then(resp => {
            if (resp.success) {
                forceUpdate()
            }
            
            return resp
        })
        
        return resp
    }
    

    return (
        <Space>
            <ButtonEditRow
                onClick={() => {
                    navigate(getURL(
                    `${ROUTES.CLASSES}/${ROUTES_COMMON.UPDATE}/${item?.id || item?.data?.id}`,
                    'constructor'
                    ))
                }}
                type="link"
                icon={<EditOutlined />}
            />
            <ClassesDeleteButton 
                withConfirm
                onClick={async () => {
                    const response = await deleteButtonHandler(item?.id || item?.data?.id)

                    return response
                }}
                disablePopup={true}
            />
        </Space>
    )
})


export default MarkoTestClassActionCell