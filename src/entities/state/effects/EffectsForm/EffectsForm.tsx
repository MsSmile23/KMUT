import { Buttons } from '@shared/ui/buttons'
import { Col, Form, FormInstance, Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import ManageEffectsBlock from '../ManageEffectsBlock/ManageEffectsBlock'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { IEffects } from '@shared/types/effects'
import { IAccount } from '@shared/types/accounts'


export interface IManageBlock {
    type: 'in' | 'out' | 'on'
    action_type: 'create' | 'update' | 'delete' | 'add_row' | 'update_table'
    class_id: number
    pseudoId: number
    key: string
    id: number
    values?: any[],
    attribute_ids?: number[]
    table_name?: 'incidents'| 'messages'


}

interface IEffectsForm {
    chosenClasses: number[]
    form: FormInstance<any>
    value?: any
    onChange?: any
    effectsFromBack: IEffects[]
    isSaveEffects: boolean
    stateId?: number,
    setIsSaveEffects: any
    disableForm?: boolean
    accounts: IAccount[]
    attributesEnable?: boolean
}
const EffectsForm: FC<IEffectsForm> = ({ chosenClasses, form, value, onChange,
    effectsFromBack, isSaveEffects, stateId, setIsSaveEffects, disableForm, accounts, attributesEnable }) => {
    const [manageBlocks, setManageBlocks] = useState<IManageBlock[]>([])
    const [pseudoId, setPseudoId] = useState<number>(1)
    const classes = useClassesStore(selectClasses)
    const addManageBlockHandler = () => {
        const localManageBlocks = [...manageBlocks]

        localManageBlocks.push({
            id: null,
            pseudoId: pseudoId + 1,
            class_id: null,
            type: null,
            action_type: null,
            key: `block-${pseudoId + 1}`,
        })
        setPseudoId(pseudoId + 1)
        setManageBlocks(localManageBlocks)
    }


    
    useEffect(() => {

        if (isSaveEffects) {
            onChange([ ...manageBlocks])
        }
    }, [manageBlocks])

    useEffect(() => {if (effectsFromBack?.length > 0 && isSaveEffects == false) {

  
        const localBlocks: any[] = []
        let pseudoIdCounter: number = pseudoId

 
        effectsFromBack.map(bl => {

            const block: any = 
            {
                pseudoId: pseudoIdCounter + 1, 
                key: `block-${pseudoIdCounter + 1}`,
                action_type: bl.action_type,
                attribute_ids: bl.attribute_ids,
                class_id: bl.class_id,
                id: bl.id,
                state_id: bl.state_id,
                type: bl.type,
                values: bl.values,
                table_name: bl?.table_name

            }

            localBlocks.push(block)
            pseudoIdCounter += 1
        })
        setManageBlocks([...localBlocks])
        setPseudoId(pseudoIdCounter)
    }}, [effectsFromBack])

    return (
        <>
            <Row justify="start" style={{ marginBottom: '15px' }}>
                <Col>
                    <Buttons.ButtonAdd
                        disabled={disableForm}
                        size="small"
                        shape="circle"
                        text={false}
                        tooltipText="Добавить блок управления эффектами"
                        onClick={addManageBlockHandler}
 
                    />
                </Col>
            </Row>

            {manageBlocks.map((block) => {
                return (
                
                    <Form.Item name={`block-${block.pseudoId}`} key={block.key}>
                        <ManageEffectsBlock
                            accounts={accounts}
                            disableForm={disableForm}
                            stateId={stateId}
                            isSaveEffects={isSaveEffects}
                            form={form}
                            block={block}
                            classes={classes}
                            manageBlocks={manageBlocks}
                            setManageBlocks={setManageBlocks}
                            chosenClasses={chosenClasses}
                            setIsSaveEffects={setIsSaveEffects}
                            attributesEnable={attributesEnable}
                        />
                    </Form.Item>
                )
            })}
        </>
    )
}

export default EffectsForm