import { IAttribute } from '@shared/types/attributes'
import { IClass } from '@shared/types/classes'
import { ButtonDelete } from '@shared/ui/buttons'
import { Select } from '@shared/ui/forms/Select/Select'
import { Col, Row, Switch } from 'antd'
import { FC, useEffect, useState } from 'react'

interface ISelectProps {
    value: number
    label: string
    disabled?: boolean
}

interface ITargetClassRow {
    targetRow: {
        class_id: number
        showClassName: boolean
        attributeIds: number[]
        pseudoId: number
    }
    targetClasses: {
        class_id: number
        showClassName: boolean
        attributeIds: number[]
        pseudoId: number
    }[]
    setTargetClasses: React.Dispatch<
        React.SetStateAction<
            {
                class_id: number
                showClassName: boolean
                attributeIds: number[]
                pseudoId: number
            }[]
        >
    >
    classesIds: number[]
    classes: IClass[]
    attributes: IAttribute[]
}
const TargetClassRow: FC<ITargetClassRow> = ({
    targetRow,
    targetClasses,
    setTargetClasses,
    classesIds,
    classes,
    attributes,
}) => {
    const [chosenClassId, setChosenClassId] = useState<number>(targetRow.class_id)
    const [showClassName, setShowClassName] = useState<boolean>(targetRow.showClassName)
    const [chosenAttributes, setChosenAttributes] = useState<number[]>(targetRow.attributeIds)
    const [classesForSelect, setClassesForSelect] = useState<ISelectProps[]>([])
    const [attrsForSelect, setAttrsForSelect] = useState<ISelectProps[]>([])

    useEffect(() => {
        const localClassesForSelect: ISelectProps[] = []

        classes
            .filter((cl) => classesIds.includes(cl.id))
            .forEach((cl) => {
                if (targetClasses.filter((item) => item.class_id == cl.id)?.length == 0) {
                    localClassesForSelect.push({
                        value: cl.id,
                        label: cl.name,
                    })
                } else {
                    localClassesForSelect.push({
                        value: cl.id,
                        label: cl.name,
                        disabled: true,
                    })
                }
            })
        setClassesForSelect(localClassesForSelect)
    }, [targetClasses, classesIds])

    useEffect(() => {
        if (chosenClassId !== undefined) {
            const localAttributesForSelect: ISelectProps[] = []

            attributes
                .filter((attr) => attr.classes.filter((cl) => cl.id == chosenClassId).length > 0)
                .forEach((attr) => {
                    localAttributesForSelect.push({ value: attr.id, label: attr.name })
                })

            setAttrsForSelect(localAttributesForSelect)
        }
    }, [chosenClassId])

    useEffect(() => {
        const localTargetClasses = [...targetClasses]

        localTargetClasses.forEach((item) => {
            if (item.pseudoId == targetRow.pseudoId) {
                item.attributeIds = chosenAttributes
                item.class_id = chosenClassId
                item.showClassName = showClassName
            }
        })
        setTargetClasses(localTargetClasses)
    }, [chosenClassId, chosenAttributes, showClassName])

    const deleteHandler = () => {
        const localTargetClasses = [...targetClasses]

        setTargetClasses(localTargetClasses.filter((cl) => cl.pseudoId !== targetRow.pseudoId))
    }

    return (
        <Row style={{ marginBottom: '10px' }} align="middle">
            <Col span={7}>
                Класс{' '}
                <Select
                    value={chosenClassId}
                    options={classesForSelect}
                    onChange={(e) => {
                        setChosenClassId(e)
                    }}
                />
            </Col>
            <Col span={7} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            Вывести класс?{' '}
                <Switch
                    checked={showClassName}
                    onChange={(e) => {
                        setShowClassName(e)
                    }}
                />
            </Col>
            <Col span={7}>
                Атрибуты{' '}
                <Select
                    mode="multiple"
                    value={chosenAttributes}
                    options={attrsForSelect}
                    onChange={(e) => {
                        setChosenAttributes(e)
                    }}
                />
            </Col>
            <Col span={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'end' }}>
                <ButtonDelete text={false} onClick={deleteHandler} shape="circle" />
            </Col>
        </Row>
    )
}

export default TargetClassRow