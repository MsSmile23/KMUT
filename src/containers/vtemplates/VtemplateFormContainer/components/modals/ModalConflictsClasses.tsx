import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { Select } from '@shared/ui/forms'
import { Form, Table } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { TInitialDataSettingVTType } from '../../types/types'
import { ButtonSettings } from '@shared/ui/buttons'

interface IModalConflictsClasses {
    matchVtemplatesLinkedClasses: dataVtemplateProps<paramsVtemplate>[]
    baseSettings: TInitialDataSettingVTType
    setUpdateVtemplatesData: (data: dataVtemplateProps<paramsVtemplate>[]) => void
    setBaseSetting: (data: TInitialDataSettingVTType) => void
    resolveConflict: boolean
}

const ModalConflictsClasses: FC<IModalConflictsClasses> = ({ 
    matchVtemplatesLinkedClasses, 
    baseSettings,
    setUpdateVtemplatesData,
    setBaseSetting,
    resolveConflict = false }) => {

    const classes = useClassesStore(selectClasses)
    const [form] = Form.useForm()
    const [selectedTemplates, setSelectedTemplates] = useState<{ [key: number]: string }>({})

    const dataSource = useMemo(() => {
        //Создаем уникальный массив из совпавших классов
        const matchClasses = Array.from(new Set(matchVtemplatesLinkedClasses
            .flatMap(vtemplate => vtemplate.params.dataToolbar.classes)
            .filter((cls) => baseSettings.classes.includes(cls))
        ))

        //Формируем данные с классами и названиями макетов
        const data = matchClasses.map(cls => {
            const matchingVtemplates = matchVtemplatesLinkedClasses
                ?.filter(vtemplate => vtemplate.params.dataToolbar.classes.includes(cls))?.map((item) => item.name)

            return {
                key: cls,
                class: classes?.find((cl) => cls === cl.id)?.name,
                vTemplates: matchingVtemplates,
            };
        });
    
        return data;
    }, [matchVtemplatesLinkedClasses, baseSettings])

    const updatedTemplates = (data: { [key: number]: string }) => {
        const newTemplates: dataVtemplateProps<paramsVtemplate>[] = []

        //Проходимся по данным из формы
        for (const [key, value] of Object.entries(data)) {
            //Фильтруем совпавшие макеты по классам и имени
            const filteredVtemplates = matchVtemplatesLinkedClasses.filter((vtemplate) => {
                const includesСlass = vtemplate.params.dataToolbar.classes.includes(Number(key))
                const notEqualName = vtemplate.name !== value

                return includesСlass && notEqualName
            })

            filteredVtemplates.forEach((template) => {
                // Ищем в создаваемом массиве такой же шаблон (чтобы фильтровать его классы)
                const matchedTemplate = newTemplates?.find((tmp) => tmp.id === template.id)
                
                if (matchedTemplate) {
                    //Фильтруем классы шаблона
                    const updatedClasses = matchedTemplate.params.dataToolbar.classes
                        .filter(cls => cls !== Number(key))

                    //Обновляем классы шаблона
                    matchedTemplate.params.dataToolbar.classes = updatedClasses
                } else {
                    //Если такого шаблона нет в массиве, то фильтруем классы
                    const updatedClasses = template.params.dataToolbar.classes
                        .filter(cls => cls !== Number(key))

                    //Обновляем классы
                    const updatedTemplate = {
                        ...template,
                        params: {
                            ...template.params,
                            dataToolbar: {
                                ...template.params.dataToolbar,
                                classes: updatedClasses
                            }
                        }
                    }
                    
                    //Добавляем в массив
                    newTemplates.push(updatedTemplate)
                }
            })
        }

        return newTemplates
    }

    //Формируем данные для создаваемого макета (базовые настройки)
    const updateBaseSettings = (data: { [key: string]: string }) => {
        const newBaseSettings = { ...baseSettings }

        for (const [key, value] of Object.entries(data)) {
            if (value !== 'Этот макет') {
                const filteredClasses = newBaseSettings.classes.filter((cls) => cls !== Number(key))

                newBaseSettings.classes = filteredClasses
            }
        }

        return newBaseSettings
    }

    const handleChangeSelector = () => {
        const updatedSelectedTemplates = {}

        Object.keys(selectedTemplates).forEach(key => {
            updatedSelectedTemplates[key] = baseSettings.name
        })
    
        setSelectedTemplates(updatedSelectedTemplates)
        form.setFieldsValue(updatedSelectedTemplates)
    }

    useEffect(() => {
        const initialValues: { [key: string]: string } = {}

        dataSource.forEach(item => {
            initialValues[item.key] = item.vTemplates[0] || ''
        })
        form.setFieldsValue(initialValues)
        setSelectedTemplates(initialValues)
    }, [dataSource])

    useEffect(() => {
        const updatedTemplatesData = updatedTemplates(selectedTemplates)
        const updatedBaseSettings = updateBaseSettings(selectedTemplates)

        setBaseSetting(updatedBaseSettings)
        setUpdateVtemplatesData(updatedTemplatesData)
    }, [resolveConflict])

    const columns = [
        {
            title: 'Класс',
            dataIndex: 'class',
            width: '50%'
        },
        {
            title: 'Найденные макеты',
            dataIndex: 'vTemplates',
            width: '50%',
            render: (vTemplates, record) => {
                const key = record.key

                const optionsList = vTemplates.map(template => ({
                    value: template,
                    label: template
                }))

                if (vTemplates.includes(baseSettings.name)) {
                    optionsList.push({
                        value: `${baseSettings.name} (2)`,
                        label: 'Этот макет'
                    })
                } else {
                    optionsList.push({
                        value: baseSettings.name,
                        label: 'Этот макет'
                    }) 
                }

                return (
                    <Form.Item name={key}>
                        <Select
                            onChange={(value: string) => {
                                const selectedOption = optionsList.find(option => option.value === value)

                                setSelectedTemplates({ ...selectedTemplates, [key]: selectedOption.label })
                            }}
                            options={optionsList}
                        />
                    </Form.Item>
                )
            },
        },
    ]

    return (
        <div>
            <p>
                Мы обнаружили другие макеты привязанные к выбранным для данного макета классам, 
                для каждого класса может быть только один макет типа Макет объекта. 
                Пожалуйста выберите в таблице ниже для каждого из найденных конфликтов макет для отображения. 
                Сохранить текущий макет можно будет только после разрешения конфликтов  
            </p>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <ButtonSettings
                    icon={false}
                    type="primary"
                    onClick={handleChangeSelector}
                >
                    <div>Выбрать для всех классов "Этот макет"</div>
                </ButtonSettings>
            </div>
            <Form 
                form={form}
                layout="inline"
                style={{ width: '100%' }}
            >
                <Table 
                    columns={columns} 
                    dataSource={dataSource} 
                    style={{ width: '100%' }} 
                    bordered={true}
                />
            </Form>
        </div>
    )
}

export default ModalConflictsClasses