import { CheckOutlined } from '@ant-design/icons'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button, Col, Input, Row, TimePicker } from 'antd'
import CheckableTag from 'antd/lib/tag/CheckableTag'
import dayjs from 'dayjs'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'

interface IScheduleMini {
    value?: any
    onChange?: any
    id?: number
    typicalParams?: any[]
    dataFromBack?: any
    form: any
    attribute?: any
    formItemName?: string
    jsonTypeValue?: boolean
}

export const ScheduleMini: FC<IScheduleMini> = ({
    value,
    onChange,
    id,
    dataFromBack,
    form,
    attribute,
    formItemName,
    jsonTypeValue = false,
    ...props
}: IScheduleMini) => {
    const [timeForData, setTimeForData] = useState<any[]>([])
    const [time, setTime] = useState<any>(null)
    const [tagsData] = useState([
        { id: 0, name: 'Пн' },
        { id: 1, name: 'Вт' },
        { id: 2, name: 'Ср' },
        { id: 3, name: 'Чт' },
        { id: 4, name: 'Пт' },
        { id: 5, name: 'Сб' },
        { id: 6, name: 'Вс' },
    ])
    const [schedule, setSchedule] = useState<{ days: number[]; freq: number }>({
        days: [],
        freq: 5,
    })

    const onChangeTime = (value, dateString) => {
        setTime(value)
        setTimeForData(dateString)
    }

    useEffect(() => {
        let data = dataFromBack ?? form.getFieldValue(formItemName)


        if (id !== undefined || data) {
            // console.log('data', JSON?.parse(data))
            let jsonData = data

            //Проверка, если значение атрибута придет как строчка
            if (typeof data === 'string') {
                try {
                    jsonData = JSON?.parse(data)
                } catch (error) {
                    console.error(`Ошибка парсинга JSON: ${error.message}`);
                   
                }
               
                
            }

            if ( jsonData) {
                data = jsonData

                if (data?.hours?.length !== undefined) {

                    form.setFieldsValue({
                        [formItemName]: {
                            days: data?.days,
                            freq: data?.freq,
                            hours: undefined
                        },
                    })
                }

                setSchedule({
                    days: data?.days ?? [],
                    freq: data?.freq,
                })


                const startTime = data?.hours?.start
                const finishTime = data?.hours?.finish



                if (startTime && finishTime) {

                    const time = [data?.hours?.start ?? undefined, data?.hours?.finish ?? undefined]

                    setTime([moment(time[0], 'HH:mm:ss'), moment(time[1], 'HH:mm:ss')])
                    setTimeForData(time)
                }
            }
        }
    }, [])

    const handleChange = (tag: number, checked: boolean) => {
        const nextSelectedTags = checked ? [...schedule.days, tag] : schedule.days.filter((t) => t !== tag)

        setSchedule((prev: any) => {
            return {
                ...prev,
                days: nextSelectedTags,
            }
        })
    }
    const handleAllDays = () => {
        if (schedule.days.length == 7) {
            setSchedule((prev: any) => {
                return {
                    ...prev,
                    days: [],
                }
            })

            return
        }

        setSchedule((prev: any) => {
            return {
                ...prev,
                days: [0, 1, 2, 3, 4, 5, 6],
            }
        })
    }
    const handleAllTime = () => {
        setTime([moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')])
        setTimeForData(['00:00:00', '23:59:59'])
        setSchedule((prev: any) => {
            return {
                ...prev,
                freq: 5,
            }
        })
    }

    useEffect(() => {

        const finalData = jsonTypeValue
            ? JSON.stringify({
                days: schedule.days,
                freq: schedule.freq,
                hours: {
                    start: timeForData[0],
                    finish: timeForData[1],
                },
            })
            : {
                days: schedule.days,
                freq: schedule.freq,
                hours: {
                    start: timeForData[0],
                    finish: timeForData[1],
                },
            }

        form.setFieldsValue({
            [formItemName]: finalData,
        })
        onChange(finalData)
    }, [schedule.freq, timeForData, schedule.days])



    const startTime = dayjs('08:00:00', 'HH:mm:ss')
    const endTime = dayjs('08:00:00', 'HH:mm:ss')

    return (
        <Row gutter={12} style={{ alignItems: 'center' }}>
            <Col style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                <ECTooltip title="Все дни">
                    <Button
                        style={{
                            backgroundColor: schedule?.days?.length === 7 ? '#1890FF' : 'white',
                            color: schedule?.days?.length === 7 ? '#ffffff' : '#000000',
                            width: '30px',
                        }}
                        icon={<CheckOutlined />}
                        onClick={handleAllDays}
                    />
                </ECTooltip>
                <Button.Group style={{ display: 'flex' }}>
                    {tagsData.map((tag) => (
                        <CheckableTag
                            checked={schedule?.days?.indexOf(tag.id) > -1}
                            onChange={(checked) => handleChange(tag.id, checked)}
                            className="CheckableTagTemplate"
                            key={tag.id}
                            style={{
                                height: '32px',
                                padding: '0 8px',
                                margin: 0,
                                border: 'none',
                            }}
                        >
                            {tag.name}
                        </CheckableTag>
                    ))}
                </Button.Group>
            </Col>
            <Col>
                <ECTooltip title="Всё время">
                    <Button
                        style={{ width: '30px' }}
                        onClick={handleAllTime}
                        icon={<CheckOutlined />}
                    />
                </ECTooltip>
                <ECTooltip placement="right" title="Выберите время начала и время окончания">
                    <TimePicker.RangePicker
                        value={time}
                        onChange={onChangeTime}
                        format="HH:mm:ss"
                        defaultValue={[startTime, endTime]}
                        style={{ width: 200, marginLeft: '8px' }}
                    />
                </ECTooltip>
                <ECTooltip title="Выберите частоту в минутах">
                    <Input
                        min={1}
                        style={{ width: 70, marginLeft: '8px' }}
                        value={schedule.freq}
                        onChange={(e) => {
                            setSchedule((prev) => ({
                                ...prev,
                                freq: e.target.value,
                            }))
                        }}
                        type="number"
                    />
                </ECTooltip>
            </Col>
        </Row>
    );

}