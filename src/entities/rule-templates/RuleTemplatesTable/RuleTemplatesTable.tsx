import { SERVICES_RULES_TEMPLATES } from '@shared/api/RuleTemplates'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IRuleTemplate } from '@shared/types/rule-templates'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types'
import { ECTooltip } from '@shared/ui/tooltips'
import { Space } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getURL } from '@shared/utils/nav'

const columns: IEditTableFilterSettings[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id' 
    },
    {
        title: 'Наименование состояния',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'ID состояния',
        dataIndex: 'stateId',
        key: 'stateId',
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        width: '20%', 
    },
]

const RuleTemplatesTable: FC = () => {
    const [ruleTemplates, setRuleTemplates]  = useState<IRuleTemplate[]>([])
    const [rows, setRows] = useState<any[]>([])
    const navigate = useNavigate()
    

    const loadRuleTemplates = () => {
        SERVICES_RULES_TEMPLATES.Models.getRuleTemplates({ all: true }).then((resp) => {
            if (resp?.success) {
                if (resp?.data !== undefined) {
                    setRuleTemplates(resp?.data)
                }
            }
        })
    }
 
    useEffect(() => {
        loadRuleTemplates()
    }, [])

    const handleDeleteButton = (id) => {
        SERVICES_RULES_TEMPLATES.Models.deleteRuleTemplate(String(id)).then(resp => {
            if (resp.success) {
                loadRuleTemplates()
            }
        })
    }

    useEffect(() => {

        const localRows = ruleTemplates.map(rule => {
            return ({
                id: rule.id,
                key: rule.id,
                name: rule?.state?.view_params?.name,
                stateId: rule?.state?.id,
                actions:
                    <Space>
                        <ECTooltip title="Редактирование">
                            <ButtonEditRow
                                onClick={() => {
                                    navigate(getURL(
                                        `${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.UPDATE}/${rule?.id}`, 
                                        'manager'
                                    ))
                                    // navigate(
                                    //     `/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.UPDATE}/${rule?.id}`
                                    // )
                                }} type="link" icon={<EditOutlined />}
                            />
                        </ECTooltip>
        
                        <ECTooltip title="Удаление">
                            <ButtonDeleteRow
                                onClick={() => {
                                    handleDeleteButton(rule.id)
                                    
                                }}
                                withConfirm 
                                style={{ color: '#FF0000' }}
                                type="link"
                                icon={<DeleteOutlined />}
                            />
                        </ECTooltip>

                    </Space>
                    
            })
        })

        setRows(localRows)
        
    }, [ruleTemplates])

    
    return ( 
        <EditTable
            rows={rows}
            columns={columns}
            //pagination={false}
            buttons={{ 
                left: [
                    <ButtonAdd
                        key="button-add-class"
                        shape="circle" 
                        text={false}
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.CREATE}`, 
                                'manager'
                            ))
                            // navigate(`/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.CREATE}`)
                        }}
                    />
                ]
            }}
        />)
}

export default RuleTemplatesTable