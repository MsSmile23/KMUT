import { BorderlessTableOutlined, CloseOutlined, NumberOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { BaseButton, Buttons } from '@shared/ui/buttons'
import { Forms } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Row } from 'antd'
import { FC, useState } from 'react'

type graphTypes = 'multigraph' | 'graph'
interface IOutputManager {
    cleanFunction?: (graphTypes) => void
    sweepFunction?: (graphTypes, number) => void
}
const OutputManager: FC<IOutputManager> = ({ cleanFunction, sweepFunction }) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [graphType, setGraphType] = useState<'multigraph' | 'graph'>(null)
    const [cols, setCols] = useState<number>(1)

    const handleCancelModal = () => {
        setIsModalVisible(false)
    }
    const submitButtonHandler = () => {
        sweepFunction(graphType, cols)
        handleCancelModal()
        setCols(1)
    }
    return (
        <>
            <Row align={'middle'} justify={'end'} gutter={8}>
                <Col>
                    {' '}
                    <ECTooltip title={'Очистить зону мультиграфиков'}>
                        <BaseButton
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: '#000000', color: ' #B60202' }}
                            type="primary"
                            icon={<CloseOutlined />}
                            onClick={() => cleanFunction('multigraph')}
                        />
                    </ECTooltip>
                </Col>
                <Col>
                    {' '}
                    <ECTooltip title={'Очистить зону графиков'}>
                        <BaseButton
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: '#000000', color: ' #B60202' }}
                            type="primary"
                            icon={<CloseOutlined />}
                            onClick={() => cleanFunction('graph')}
                        />
                    </ECTooltip>
                </Col>
                <Col>
                    {' '}
                    <ECTooltip title={'Задать развертку зоны мультиграфиков'}>
                        <BaseButton
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: '#000000', color: ' #ffffff' }}
                            type="primary"
                            icon={<NumberOutlined />}
                            onClick={() => {
                                setIsModalVisible(true)
                                setGraphType('multigraph')
                            }}
                        />
                    </ECTooltip>
                </Col>
                <Col>
                    {' '}
                    <ECTooltip title={'Задать развертку зоны графиков'}>
                        <BaseButton
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: '#000000', color: ' #ffffff' }}
                            type="primary"
                            icon={<NumberOutlined />}
                            onClick={() => {
                                setIsModalVisible(true)
                                setGraphType('graph')
                            }}
                        />
                    </ECTooltip>
                </Col>
            </Row>

            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                open={isModalVisible}
                title="Количество колонок"
                onCancel={handleCancelModal}
                width={'12%'}
            >
                <Col span={16} style={{ margin: '0 auto' }}>
                    <Forms.Input
                        type={'number'}
                        min={1}
                        step={1}
                        style={{ marginBottom: '10px' }}
                        value={cols}
                        onChange={(e) => setCols(Number(e.target.value))}
                    />
                    <Buttons.ButtonAdd
                        color="rgb(92, 184, 92)"
                        customText="Сохранить "
                        icon={null}
                        onClick={submitButtonHandler}
                    />
                </Col>
            </DefaultModal2>
        </>
    )
}
export default OutputManager
