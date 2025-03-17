/* eslint-disable react/jsx-max-depth */
// eslint-disable-next-line max-len
import { Button, Col, DatePicker, Form, FormProps, Modal, Row, Select, Space, message } from 'antd'
import { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react'
import { periodOptions, reportFormats, reportTypeOptions } from './data'
import { useApi2 } from '@shared/hooks/useApi2'
import { StepButton } from './StepButton'
import { getReportTypes } from '@shared/api/ReportTypes/Models/getReportTypes/getReportTypes'
import { TReportPayload } from '@shared/types/reports'
import { postReport } from '@shared/api/Reports/Models/postReport/postReport'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { useObjectsStore } from '@shared/stores/objects'
import { createTableSelectionProps } from '@shared/ui/tables/ECTable2/EditTable/utils'
import { createHiddenStyle, filterObjectsByLinkedClasses, findParentsByClasses, getRangeByDayjs, handleFormsChange } from './utils'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { useTheme } from '@shared/hooks/useTheme'
import { useClassesStore } from '@shared/stores/classes'
import { useRelationsStore } from '@shared/stores/relations'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { LinkedObjectsModal } from './LinkedObjectsModal'
import { ECTooltip } from '@shared/ui/tooltips'
import { ReportUnformalForm2 } from '../ReportUnformalForm/ReportUnformalForm2'
import { useToggle } from '@shared/hooks/useToggle'
import { BaseButton } from '@shared/ui/buttons'
import { getURL } from '@shared/utils/nav'

const formProps: FormProps = {
    colon: false,
    labelCol: {
        offset: 1,
        xs: 3,
    },
    labelAlign: 'left'
}


type TReportFormFilters = {
    reportTypesAllowArray?: Array<number>,
    reportFormatsAllowArray?: Array<string>,
    linkedClassesForObjects?: Array<number>
}

type TReportFormProps = {
    showLinkedObjects?: boolean,
    filters?: TReportFormFilters,
    modal?: boolean,
    closeModal?:   () => void
}

type TOptionType = {
    value: string;
    label: string;
};  

/**
 * Форма для создания отчета
 * 
 * @param showLinkedObjects - показывать ли в шаге отбора объектов столбцы связанных объектов
 * @param modal - маркер, обозначающий, находится ли форма в модальном окне или нет
 * @returns 
 */
export const ReportForm: FC<TReportFormProps> = ({ showLinkedObjects = true, filters, modal, closeModal }) => {
    const nav = useNavigate()

    // контролируем открытие/закрытие шагов через указание значения для названия формы
    const [ openedSteps, setOpenedSteps ] = useState<Record<string, boolean>>({ reportTypeForm: true })

    // контролируем завершение шагов через указание значения для названия формы
    // не завершенные отмечены синим цветом
    const [ completedSteps, setCompletedSteps ] = useState<Record<string, boolean>>({})

    // контролируем блокировку шагов через указание значения для названия формы
    // если предыдущий шаг не был заполнен, то блокируется следующий
    // но если предыдущий шаг был заполнен, но потом очищен, то блокировки нет
    // самый первый шаг не блокируется
    const [ disabledSteps, setDisabledSteps ] = useState({
        formatsForm: true,
        classifiersForm: true,
        scheduleForm: true,
        unformalReportForm: true,
        objectsForm: true,
        created: true,
    })

    // интервал для установки заданного (час назад, прошлая неделя и т.д.) интервала в DatePicker
    const [ interval, setInterval ] = useState<string | undefined>(undefined)

    // при выборе неформального отчета появляется дополнительный пункт в форме
    const [ unformalReportVisible, setUnformalReportVisible ] = useState(false)

    // выбранные объекты в таблицы объектов (шаг "Отбор объектов")
    const [ selectedRows, setSelectedRows ] = useState<React.Key[]>([])

    // состояние для лоадера отправки отчета на создание
    const [ creatingReport, setCreatingReport ] = useState(false)

    // названия связанных объектов для текущего выбранного ряда
    // устанавливаются, если пользователь нажал на ячейку в столбце связанного объекта и
    // если этих объектов больше обного (например, услуга здания)
    const [ linkedObjectsNames, setLinkedObjectNames ] = useState<string[]>([])

    // заголовок для модального окна при открытии связааных объектов (подаем название основного объекта)  
    const [ linkedObjectTitle, setLinkedObjectTitle ] = useState('')

    const objects = useObjectsStore((st) => st.store.data)

    /**
     * Переключение видимости определенного шага (формы)
     * 
     * @param formName - имя формы
     */
    const toggleVisibility = useCallback((formName: string) => {
        setOpenedSteps((steps) => {
            return ({ ...steps, [formName]: Boolean(!steps[formName]) })
        })
    }, [])

    /**
     * Проверяет, заполнены ли все необходимые поля, и уставливает флаг завершения для текущего шага, 
     * открывает, разблокирует следующий шаг
     *
     * @param values - обязательные для заполнения значения из формы
     * @param formName - имя формы
     * @param nextFormName - имя следующей формы, который необходимо открыть
     */
    const setStepCompleted = (values: any, formName: string, nextFormName?: string) => {
        if (values === undefined || values === null) {
            setCompletedSteps((steps) => ({ ...steps, [formName]: false }))

            return
        }

        const completed = Object.values(values).every((value) => {
            return Array.isArray(value) ? value.every(Boolean) : Boolean(value)
        })

        setCompletedSteps((steps) => ({ ...steps, [formName]: completed }))

        if (completed && nextFormName) {
            setOpenedSteps((steps) => ({ ...steps, [nextFormName]: true }))
            setDisabledSteps((steps) => ({ ...steps, [nextFormName]: false }))
        }
    }

    const [ formatsForm ] = Form.useForm()
    const [ scheduleForm ] = Form.useForm()
    const [ reportForm ] = Form.useForm()

    // todo: проверить почему не работает связка с формой через form={formatsForm}
    const [ classesIds, setClassesIds ] = useState<number[]>([])

    const isReportStandart = reportForm.getFieldValue('reportType') !== 9999

    useEffect(() => {
        const objectSelected = Boolean(selectedRows.length)

        setCompletedSteps((steps) => ({ ...steps, objectsForm: objectSelected }))
        
        if (objectSelected) {
            setOpenedSteps((steps) => ({ ...steps, created: true }))
            setDisabledSteps((steps) => ({ ...steps, created: false }))
        }
    }, [selectedRows.length])

    const createReport = async () => {
        const { formats } = formatsForm.getFieldsValue(true)
        const { reportType } = reportForm.getFieldsValue(true)
        const { period } = scheduleForm.getFieldsValue(true)
        const [ start, end ] = period

        const payload: TReportPayload = {
            report_type_id: reportType,
            start_datetime: start?.format(),
            end_datetime: end?.format(),
            objects: selectedRows as number[],
            //formats: JSON.stringify(formats)
            formats: formats ?? []
        }

        setCreatingReport(true)

        //TODO: создать нормальную обработку ошибок
        try {
            const resp = await postReport(payload)

            if (resp.success) {
                setCompletedSteps((steps) => ({ ...steps, created: true }))
                message.success('Запущен процесс построения отчета')
                
                if (!modal) {
                    nav(getURL(
                        `${ROUTES.REPORTS}`,
                        'showcase'
                    ))
                }
                else {
                    closeModal()
                }
                // nav(`/${ROUTES.REPORTS}/${ROUTES_COMMON.LIST}`)

                return
            }
            message.error('Ошибка при создании отчёта')

            return
        } catch {
            message.error('Ошибка при создании отчёта')
            setCompletedSteps((steps) => ({ ...steps, created: false }))
        } finally {
            setCreatingReport(false)
        }
    }

    // если одна из форм не заполнена, то блокируем кнопку
    const isButtonCreateDisabled = Object.entries(completedSteps || {})
        .filter(([ k ]) => k !== 'created')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .some(([ _k, v ]) => !v)

    
    /**
     * Устанавливает значение в DatePicker на шаге "Период и расписание", устанавливает это форму как завершенную
     * 
     * @param value - предустановленное значение для создания периода
     */
    const selectPredefinedRange = (value: string) => {
        setInterval(value)

        if (value !== undefined) {
            const period = getRangeByDayjs(value as any)

            scheduleForm.setFieldValue('period', period)

            setStepCompleted(period, 'scheduleForm', 'objectsForm')
        }
    }

    const theme = useTheme()
    
    // Берем значения из пропсов или темы
    // eslint-disable-next-line max-len
    const linkedClassesIds: number[] = filters?.linkedClassesForObjects || theme?.components?.tables?.showcase?.Reports?.Form?.linkedClassesForObjects || []

    const findClass = useClassesStore((st) => (id: number) => st.getByIndex('id', id))
    // если связанный класс абстрактный, то ищем все классы, которые зависят от него
    const childClassesIdsForColumns = useRelationsStore((st) => {
        return linkedClassesIds.map(findClass).filter(Boolean).map((cls) => {
            if (cls.is_abstract) {
                return Array.from(new Set(st.store.data
                    .filter((rel) => rel.right_class_id === cls.id)
                    .map((rel) => rel.left_class_id)))
            } else {
                return [cls.id]
            }
        })
    })

    const linkedColumnsNames = useMemo(() => {
        return linkedClassesIds.map((id) => findClass(id)?.name)
    }, [linkedClassesIds])
    const linkedClassesColumns = useMemo(() => childClassesIdsForColumns.flatMap((classesIds, i) => {
        return classesIds.reduce((hash, clsId) => ({ 
            ...hash, 
            // todo: обновить формирование работу ключей, когда будет что-то кроме услуг
            key: `${hash.key}_${clsId}`,
            dataIndex: `${hash.key}_${clsId}`,
            title: linkedColumnsNames[i],
            // ключ для поиска в ячейке связанного объекта по всем доступным связанным объектам
            valueIndex: {
                filter: `filter-${hash.key}_${clsId}`,
            },
        }), { 
            key: 'linked-class', 
            dataIndex: 'linked-class', 
            title: 'Связанный объект',
            // если потребуется восстановить поиск через селект
            // filterType: 'select' as const,
        })
    }), [childClassesIdsForColumns, linkedColumnsNames])

    const findObject = useObjectsStore((st) => st.getByIndex)

    const { linkedClasses = [] } = formatsForm.getFieldsValue(true)

    const filteredObjectsByClasses = objects.filter((obj) => classesIds.includes(obj.class_id))
    const objectsForRows = linkedClasses?.length > 0
        // фильтруем объекты, которые указаные в каскадере "Связанные классы"
        ? filterObjectsByLinkedClasses(filteredObjectsByClasses, linkedClasses)
        : filteredObjectsByClasses

    const rows = useMemo(() => objectsForRows.map((obj) => {
        // формируем ключ ряда 
        const linkedClassesData = linkedClassesColumns.reduce((hash, col) => {
            // удаляем префикс и собираем ключи классов 
            const linkedClassesIds = col?.dataIndex?.split('_').slice(1).map((id) => Number(id))
            const parentsObjects = findParentsByClasses(obj, linkedClassesIds)

            return ({ 
                ...hash, 
                // отображаем первый объект из найденных связанных объектов
                [col.key]: parentsObjects.length > 1 ? (
                    <ECTooltip title={`Связанных объектов: ${parentsObjects.length}`} mouseEnterDelay={1}>
                        <div 
                            onClick={() => {
                                setLinkedObjectNames(parentsObjects.map((obj) => obj.name))
                                setLinkedObjectTitle(obj.name)
                            }}
                            style={{ 
                                // overflow: 'hidden',
                                // whiteSpace: 'nowrap',
                                // textOverflow: 'ellipsis',
                                cursor: parentsObjects.length > 1 ? 'pointer' : undefined 
                            }}
                        >
                            {parentsObjects?.[0]?.name} ...
                        </div>
                    </ECTooltip>
                ) : parentsObjects?.[0]?.name,
                // поиск по всем связанных объектам (можно указывать полные названия через запятую)
                [`filter-${col.key}`]: parentsObjects.map((obj) => obj.name).join(', ')
            })
        }, {})

        return { 
            ...linkedClassesData,
            id: obj.id, 
            key: `${obj.id}`, 
            name: obj.name,
        }
    }), [classesIds, linkedClassesColumns, forumThemeConfig, findObject, objectsForRows])

    // если потребуется восстановить поиск по селекту, то можно использовать
    // но только если в ячейке одно значение
    // const linkedClassColumnWithOptions = useMemo(() => linkedClassesColumns.map((col) => {
    //     return {
    //         ...col,
    //         filterType: col.key.includes('linked') ? 'select' : undefined,
    //         filterSelectOptions: Array
    //             .from(new Set(rows.map((row) => row[col.key]).filter(Boolean)))
    //             .map((title) => ({ value: title, label: title }))
    //     }
    // }), [linkedClassesColumns])

    const columns = useMemo(() => {
        const baseColumns = [
            { key: 'id', title: 'ID', dataIndex: 'id', width: 150 },
            { key: 'name', title: 'Название', dataIndex: 'name' },
        ]

        return showLinkedObjects 
            ? [...baseColumns, ...linkedClassesColumns]
            : baseColumns

    }, [showLinkedObjects, linkedClassesColumns])

    // для открытия модального окна неформализованного отчета
    // const unformal = useToggle()
    
    const reportFormatsUsedList = (): TOptionType[] => {

        return reportFormats.reduce((accumulator, value) => {

            if (!filters?.reportFormatsAllowArray || filters?.reportFormatsAllowArray.length < 1) {
                accumulator.push({ value: value.mnemo, label: value.name })
            }

            if (filters?.reportFormatsAllowArray?.includes(value.mnemo)) {
                accumulator.push({ value: value.mnemo, label: value.name })
            }
            
            return accumulator;

        }, [])

    }

    // неформализованный отчет указан в отедльном файле data
    const reportTypes = useApi2(getReportTypes)

    const reportTypeOptionsAll = (): TOptionType[] => {

        return reportTypes?.data?.reduce((accumulator, value) => {

            if (!filters?.reportTypesAllowArray || filters?.reportTypesAllowArray.length < 1) {
                accumulator.push({ value: value.id, label: value.name })
            }

            if (filters?.reportTypesAllowArray?.includes(value.id)) {
                accumulator.push({ value: value.id, label: value.name })
            }
            
            return accumulator;

        }, [])

    }

    return (
        <Form.Provider
            onFormChange={(name, { forms }) => handleFormsChange({
                name,
                forms,
                setClassesIds,
                setCompletedSteps,
                setStepCompleted,
                setUnformalReportVisible,
                unformalReportVisible
            })}
        >
            {/*  модальное окно неформализованного отчета */}
            {/*  <Modal open={unformal.isOpen} width={1500} onCancel={unformal.close}>
                <ReportUnformalForm2 classes={[]} />
            </Modal> */}
            <Row gutter={[0, 20]}>
                {/* Типы отчетов */}
                <Col xs={24}>
                    <StepButton
                        title="Тип отчета" 
                        openedSteps={openedSteps} 
                        toggle={toggleVisibility}
                        formName="reportTypeForm" 
                        step={0}
                        completed={completedSteps?.reportTypeForm} 
                    />
                </Col>
                <Col xs={24} style={createHiddenStyle(!openedSteps?.reportTypeForm)}>
                    <Form form={reportForm} name="reportTypeForm" {...formProps}>
                        <Col offset={1}>
                            <Form.Item name="reportType">
                                <Select style={{ width: '100%' }} options={reportTypeOptionsAll()} allowClear />
                            </Form.Item>
                        </Col>
                    </Form>
                </Col>

                {/* Форматы, классы и атрибуты */}
                <Col xs={24}>
                    <StepButton
                        title="Классы и форматы" 
                        openedSteps={openedSteps} 
                        toggle={toggleVisibility} 
                        step={1}
                        completed={completedSteps?.formatsForm}
                        disabled={disabledSteps.formatsForm}
                        formName="formatsForm" 
                    />
                </Col>
                <Col xs={24} style={createHiddenStyle(!openedSteps?.formatsForm)}>
                    <Form form={formatsForm} name="formatsForm" {...formProps}>
                        <Col offset={1}>
                            <Form.Item name="classes">
                                <ClassesCascader placeholder="Выберите основные классы"  />
                            </Form.Item>
                        </Col>
                        <Col offset={1}>
                            <Form.Item name="linkedClasses">
                                <ClassesCascader 
                                    placeholder="Выберите связанные классы (по умолчанию выбраны все)" 
                                />
                            </Form.Item>
                        </Col>
                        <Col offset={1}>
                            <Form.Item name="formats">
                                <Select 
                                    options={reportFormatsUsedList()}
                                    placeholder="Выберите форматы" 
                                    mode="multiple" 
                                />
                            </Form.Item>
                        </Col>
                    </Form>
                </Col>

                {/* Период и расписание построения */}
                <Col xs={24}>
                    <StepButton
                        title="Период и расписание построения" 
                        openedSteps={openedSteps} 
                        toggle={toggleVisibility} 
                        step={2}
                        completed={completedSteps.scheduleForm}
                        disabled={disabledSteps.scheduleForm}
                        formName="scheduleForm" 
                    />
                </Col>
                <Col xs={24} style={createHiddenStyle(!openedSteps?.scheduleForm)}>
                    <Form name="scheduleForm" form={scheduleForm} {...formProps}>
                        <Col offset={1}>
                            <Space>
                                <Form.Item name="period">
                                    <DatePicker.RangePicker showTime allowClear />
                                </Form.Item>
                                <Select
                                    style={{ width: 320, marginBottom: 24 }}
                                    placeholder="Выберите интервал"
                                    options={periodOptions}
                                    value={interval}
                                    onChange={selectPredefinedRange}
                                    allowClear
                                />
                            </Space>
                        </Col>
                    </Form>
                </Col>
                {
                    unformalReportVisible && (
                        <>
                            <Col xs={24}>
                                <StepButton
                                    title="Настройки неформализованного отчёта"
                                    openedSteps={openedSteps}
                                    toggle={toggleVisibility}
                                    step={3}
                                    completed={completedSteps?.unformalReportForm}
                                    disabled={disabledSteps.unformalReportForm}
                                    formName="unformalReportForm" 
                                />
                            </Col>
                            <Col xs={24} style={createHiddenStyle(!openedSteps?.unformalReportForm)}>
                                <Form name="unformalReportForm" {...formProps}>
                                    <Form.Item name="unformalReport" label="Экспорт">
                                        <Select 
                                            style={{ width: '100%' }} 
                                            options={[{ value: 1, label: 'Да' }, { value: 2, label: 'Нет' }]} 
                                        />
                                    </Form.Item>
                                    <Form.Item label="Настройка">
                                        {/* кнопка открытия модального окна неформализованного отчета */}
                                        {/* <BaseButton onClick={unformal.open}>
                                            Открыть неформализованный отчет
                                        </BaseButton> */}
                                    </Form.Item>
                                </Form>
                            </Col>
                        </>
                    )
                }
                {/* Отбор объектов */}
                <Col xs={24}>
                    <StepButton
                        title="Отбор объектов" 
                        openedSteps={openedSteps} 
                        toggle={toggleVisibility} 
                        step={isReportStandart ? 3 : 4}
                        completed={completedSteps?.objectsForm}
                        disabled={disabledSteps.objectsForm}
                        formName="objectsForm" 
                    />
                </Col>
                <Col xs={24} style={createHiddenStyle(!openedSteps?.objectsForm)}>
                    <Row>
                        <Col offset={1} xs={23}>
                            <EditTable 
                                tableId="report-form"
                                rows={rows}
                                columns={columns as any[]}
                                rowSelection={createTableSelectionProps({ rows, selectedRows, setSelectedRows })}
                            />
                        </Col>
                    </Row>
                </Col>

                {/* Создание отчета */}
                <Col xs={24}>
                    <StepButton
                        title="Создать отчет" 
                        openedSteps={openedSteps} 
                        toggle={toggleVisibility} 
                        step={isReportStandart ? 4 : 5}
                        completed={completedSteps.created}
                        disabled={disabledSteps.created}
                        formName="created"
                    />
                </Col>
                <Col offset={1} xs={24} style={createHiddenStyle(!openedSteps?.created)}>
                    <Button 
                        type="primary"
                        size="large"
                        style={{ width: 126 }}
                        onClick={createReport}
                        loading={creatingReport}
                        disabled={isButtonCreateDisabled}
                    >
                        Создать
                    </Button>
                </Col>
            </Row>
            <LinkedObjectsModal 
                linkedObjectsNames={linkedObjectsNames}
                title={linkedObjectTitle}
                updateTitle={setLinkedObjectTitle}
            />
        </Form.Provider>
    )
}