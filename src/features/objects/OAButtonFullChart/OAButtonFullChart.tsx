import { periods } from '@entities/reports/ReportForm/data'
import { DefaultModal } from '@shared/ui/modals'
import { Button, Col, ConfigProvider, Row, Tag } from 'antd'
import DatePicker from 'antd/es/date-picker'
import locale from 'antd/lib/locale/ru_RU'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import type { Dayjs } from 'dayjs'
import { getRangeByDayjs } from '@entities/reports/ReportForm/utils';
dayjs.locale('ru')

type TDateIntervals = [Dayjs, Dayjs]
type TStringDateIntervals = [string, string]
type TDatePreset = keyof typeof periods.labels

const { CheckableTag } = Tag;

export const OAButtonFullChart: FC<PropsWithChildren<{
    open: boolean
    toggleModalChartIsVisible: () => void
    getDateIntervals: (intervals: TStringDateIntervals) => void
    parentDateIntervals?: TStringDateIntervals
    title?: string
}>> = ({ children, open, toggleModalChartIsVisible, getDateIntervals, title, parentDateIntervals }) => {
    const frontDateFormat = 'DD.MM.YYYY HH:mm'

    const { RangePicker } = DatePicker;
    const [selectedTag, setSelectedTag] = useState<TDatePreset|''>('')
    const [activeTag, setActiveTag] = useState<TDatePreset|''>('')
    
    useEffect(() => {
        const newDateIntervals = parentDateIntervals.map(item => {    
            return item 
                ? dayjs(Number(item) * 1000) 
                : null
        }) as TDateIntervals

        setDateIntervals(newDateIntervals)
    }, [
        parentDateIntervals[0],
        parentDateIntervals[1]
    ])
    /* const initialDateIntervals = parentDateIntervals.map((item, idx) => {
        console.log('item [', idx, ']', item)

        return item 
            ? dayjs(Number(item) * 1000) 
            : null
    }) as TDateIntervals */
    const [dateIntervals, setDateIntervals] = useState<TDateIntervals>([null, null])
    // const [dateIntervals, setDateIntervals] = useState<TDateIntervals>(initialDateIntervals ?? [dayjs(), dayjs()])


    const handleChangeTag = (tag: TDatePreset) => {
        const timeObject = getRangeByDayjs(tag)
        
        setSelectedTag(tag)
        setDateIntervals(timeObject)
    }
    const changeTimeInterval = (value: TDateIntervals) => {
        setDateIntervals(value)
    }

    const onOk = (value: TDateIntervals) => {
        setDateIntervals([value?.[0], value?.[1]])
    };

    const applyDates = () => {
        const newDateIntervals = dateIntervals.map(date => {
            return date ? String(dayjs(date).unix()) : null
        }) as TStringDateIntervals

        setActiveTag(selectedTag)
        getDateIntervals(newDateIntervals)
    }

    const cancelModal = () => {
        toggleModalChartIsVisible()
        getDateIntervals([null, null])
        setActiveTag('')
    }

    return (
        <DefaultModal
            isModalVisible={open}
            isDraggable={true}
            width="80vw"
            height="auto"
            handleCancel={cancelModal}
            title={title}
            customCrossPosition={true}
        >
            <div style={{ width: '100%', marginBottom: 10 }}>  
                <Row justify="space-between" align="middle" style={{ marginRight: 20 }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 10,
                            marginBottom: 10,
                            justifyContent: 'start',
                            width: '100%'
                        }}
                    >
                        {periods.values.map(period => {
                            return (
                                <CheckableTag
                                    key={period}
                                    checked={period === activeTag}
                                    onChange={() => handleChangeTag(period)}
                                    style={{  
                                        padding: '5px', 
                                        textAlign: 'center', 
                                        border: `2px solid ${period === selectedTag ? '#4096FF' : '#000000'}`,
                                        borderRadius: 5,
                                    }}
                                >
                                    {periods.labels[period]}
                                </CheckableTag>
                            )
                        })}
                    </div>
                </Row>
                <Row justify="space-between" align="middle" style={{ marginRight: 20 }}>
                    <Col span={12}>
                        <ConfigProvider locale={locale}>
                            <RangePicker
                                allowClear
                                showTime={{ format: frontDateFormat }}
                                format={frontDateFormat}
                                onChange={changeTimeInterval}
                                onOk={onOk}
                                defaultValue={[
                                    dateIntervals?.[0] ?? dayjs(), 
                                    dateIntervals?.[1] ?? dayjs() 
                                ]}
                                // defaultValue={[
                                //     dayjs(), 
                                //     dayjs(), 
                                // ]}
                                value={[
                                    dateIntervals?.[0] ?? dayjs(), 
                                    dateIntervals?.[1] ?? dayjs()
                                ]}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={6}>
                        <Button
                            onClick={applyDates}
                            // disabled={selectedTag === '' || !dateIntervals?.[0] || !dateIntervals?.[1]}
                            type="primary"
                            style={{ width: '100%' }}
                        >
                            Применить
                        </Button>
                    </Col>
                </Row>
            </div>
            {children}
        </DefaultModal>
    )
}