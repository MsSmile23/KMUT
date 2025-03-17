import { ButtonAdd } from '@shared/ui/buttons'
import { Card } from 'antd'
import { FC, useEffect, useState } from 'react'
import TargetClassRow from './TargetClassRow'
import { IClass } from '@shared/types/classes'
import { IAttribute } from '@shared/types/attributes'


interface ILinkedObjectsCard {
    classesIds: number[],
    value?: any,
    onChange?: any,
    classes:  IClass[]
    attributes: IAttribute[]
}
const LinkedObjectsCard: FC<ILinkedObjectsCard> = ({ classesIds, value, onChange, classes, attributes }) => {

    
    const [targetClasses, setTargetClasses] = useState<{
        class_id: number,
        showClassName: boolean, 
        attributeIds: number[],
        pseudoId: number
    }[]>([])
    const [pseudoId, setPseudoId] = useState<number>(0)

    const buttonAddHandler = () => {
        const localTargetClasses = [...targetClasses]

        localTargetClasses.push({
            class_id: undefined,
            showClassName: true,
            attributeIds: [],
            pseudoId: pseudoId + 1
        })
        setPseudoId(pseudoId + 1)
        setTargetClasses(localTargetClasses)
    }

    useEffect(() => {
        const localValue: any[] = []

        targetClasses.forEach(item => {
            localValue.push({
                class_id: item.class_id,
                showClassName: item.showClassName,
                attributeIds: item.attributeIds,
            })
        })
        onChange(localValue)
    }, [targetClasses])

    useEffect(() => {
        if (value !== undefined) {
            let counter = pseudoId
            const localTargetClasses = [...targetClasses]

            value.forEach(item => {
                localTargetClasses.push({
                    class_id: item.class_id,
                    showClassName: item.showClassName,
                    attributeIds: item.attributeIds,
                    pseudoId: counter  + 1
                })
                counter += 1
            })

            setPseudoId(counter)
            setTargetClasses(localTargetClasses)
        }
    }, [])
    
    return (
        <Card
            style={{ minWidth: '800px' }} 
            bodyStyle={{ minWidth: '800px' }} 
  
        >
            {targetClasses.map(cl => {
                return (
                    <TargetClassRow
                        classes={classes}
                        attributes={attributes}
                        targetClasses={targetClasses}
                        setTargetClasses={setTargetClasses}
                        classesIds={classesIds}
                        targetRow={cl}
                        key={`key_${cl.pseudoId}`}
                    />)
            })}

            <ButtonAdd 
                size="small"
                text={false} 
                onClick={buttonAddHandler} 
                disabled={targetClasses?.length == classesIds?.length} 
            />
        </Card>
    )
}

export default LinkedObjectsCard