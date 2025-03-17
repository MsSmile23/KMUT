/* eslint-disable react/jsx-max-depth */

import { FC, useEffect, useMemo, useState } from 'react';
import { Form, Input, Select, Space, Row, Col, Divider } from 'antd';
import CodeEditor from '@shared/ui/CodeEditor/CodeEditor';
import { IDataType } from '@shared/types/data-types';
import OAttrFormFieldSelect from '@entities/object-attributes/OAttrFormField/OAttrFormFieldSelect/OAttrFormFieldSelect';
import { CloseCircleOutlined } from '@ant-design/icons';
import { ECTooltip } from '@shared/ui/tooltips';

interface IAgentMetricsInputProps {
    value?: string;
    onChange?: (value: string) => void;
    data?: IDataType['params']
    setValidation?: React.Dispatch<any>

}

const AgentMetricsInput: FC<IAgentMetricsInputProps> = ({ value, onChange, data, setValidation, ...props }) => {
    const [form] = Form.useForm();
    const [validateErrorShow, setValidateErrorShow] = useState<boolean>(false);
    const [statusRegexp, setStatusRegexp] = useState<''| 'error'>('');

    //*Доп проверка для того случая, если вдруг data пришла в JSON-формате
    const parsedData = useMemo(() => {
        let localData = data

        if (typeof localData === 'string') {
            try {
                localData = JSON.parse(localData);
            } catch (error) {
                console.error(`Ошибка парсинга JSON: ${error.message}`);

            }
        }
        
        return localData
    }, [data])

    useEffect(() => {

        if (value) {
            const parsedValue = JSON.parse(value);
            const formValues = {
                args: parsedValue.args,
                metric: parsedValue.metric,
                format: parsedValue.format,
                regexp: parsedValue.postprocessing_type == 'regexp' ? parsedValue.postprocessing_value : null,
                postprocessing: parsedValue.postprocessing_type == 'postprocessing'
                    ? parsedValue.postprocessing_value
                    : null
            }

            form.setFieldsValue(formValues);
        }
    }, [value]);


    //?Функция проверки строки на возможность быть валидным регулярным выражением
    function isValidRegex(s) {
        try {
            const m = s.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);

            return m ? !!new RegExp(m[2], m[3])
                : false;
        } catch (e) {
            return false
        }
    }

    const handleFormChange = () => {
        const formValue = form.getFieldsValue()
        let validateChecker = true


        if (formValue?.args) {
            Object.values(selectedMetric.args).forEach(arg => {

                if (arg.required) {
                    if (!formValue.args[arg.label]) {
                        validateChecker = false
                        
                    }
                }

            })

        }

        if (formValue.format == 'string' && formValue.regexp !== '') {
            !isValidRegex(formValue.regexp) ? setStatusRegexp('error') : setStatusRegexp('')
        }

        const payload = {
            metric: formValue.metric,
            format: parsedData?.metrics?.find(metric => metric.mnemo === formValue?.metric)?.format,
            postprocessing_value: formValue.format == 'string' ? formValue.regexp : formValue.postprocessing,
            postprocessing_type: formValue.format 
                ? formValue.format == 'string'
                    ? 'regexp' : 'postprocessing' : undefined,
            args: formValue.args
        }


        if (validateChecker) {
            //*Проверка на то, что если пайлод пустой шлём null
            onChange(JSON.stringify(payload) == '{}' ? null : JSON.stringify(payload));

            //*Добавляем валидацию на регулярные вырвжения
            if (setValidation) {
                const key = props?.id.split('-')[0]

                if (formValue.format == 'string') {
                    setValidation(prev => {
                        if (prev === null) {
                            return { [key]: isValidRegex(formValue.regexp) };
                        } else {
                            return {
                                ...prev,
                                [key]: isValidRegex(formValue.regexp)
                            };
                        }
                    });
                }

                //*В случае, если поменяли метрику - ставим то, что атрибут прошел валидацию
                else { 
                    setValidation(prev => {
                        if (prev === null) {
                            return { [key]: true };
                        } else {
                            return {
                                ...prev,
                                [key]: true
                            };
                        }
                    });
                }
            }
        }
        setValidateErrorShow(!validateChecker)
    };

    //! Временно нужно поставить фильтр по дублирующимся значениям метрик

    const metricsOptions = useMemo(() => {
   
        const seenMnemos = new Set();
    
        const filteredOptions =   parsedData?.metrics.filter(item => {
            if (!seenMnemos.has(item.mnemo)) {
                seenMnemos.add(item.mnemo);
                
                return true;
            }
            
            return false;
        });

        return filteredOptions.map(m => ({ label: m.label, value: m.mnemo, ogroup: m.group }))
    }, [parsedData]) 

    const metricMnemo = Form.useWatch(['metric'], form)
    const selectedMetric = parsedData?.metrics?.find(metric => metric.mnemo === metricMnemo)
    const format = selectedMetric ? selectedMetric.format : null
    const helpString = []

    useEffect(() => {
        form.setFieldValue('format', format)
    }, [metricMnemo])

    const formatLabel = useMemo(() => {
        return (parsedData?.formats?.find(item => item?.mnemo == format)?.label) || ''
    }, [format])


    
    return (
        <Form
            form={form}
            //   layout="vertical"
            onValuesChange={handleFormChange}
            style={{ marginTop: 20, marginBottom: 30 }}
        >
            {validateErrorShow && (
                <Divider style={{ borderColor: 'red' }}>
                    Внимание! Если обязательные аргументы не заполнены, то атрибут не будет сохранен
                </Divider>
            )}
            <Row gutter={16}>
                <Col span={12} style={{ marginBottom: 40 }}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <div>Метрики агента</div>
                        </Col>
                        <Col span={18}>
                            <Form.Item name={['metric']} style={{ width: '100%' }}>
                                <OAttrFormFieldSelect
                                    options={metricsOptions}
                                    placeholder="Выберите метрику"
                                    style={{ width: '100%' }}
                                    onClear={() => form.resetFields()}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    {selectedMetric && (
                        <Row gutter={8}>
                            <Col span={6}>
                                <div>Аргументы</div>
                            </Col>
                            <Col span={18}>
                                <Space.Compact>
                                    {Object.values(selectedMetric.args)?.map((arg, idx) => {
                                        helpString.push(arg.required ? `${arg.label}` : `<${arg.label}>`)

                                        return (
                                            <Form.Item
                                                style={{ marginBottom: 0 }}
                                                colon={false}
                                                key={idx}
                                                name={['args', arg.label]}
                                                label={' '}
                                                initialValue=""
                                                rules={[
                                                    {
                                                        required: arg.required,
                                                        message: `${arg.label} обязательное поле`,
                                                    },
                                                ]}
                                                validateFirst
                                            >
                                                <Input placeholder={arg.label} />
                                            </Form.Item>
                                        )
                                    })}
                                </Space.Compact>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <p
                                        style={{
                                            width: 'max-content',
                                            backgroundColor: '#06d553',
                                            color: 'white',
                                            marginRight: 60,
                                        }}
                                    >
                                        {helpString.join(',')}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <div>Формат</div>
                        </Col>
                        <Col span={18}>
                            <Form.Item name={['format']} style={{ width: '100%', marginBottom: 0 }}>
                                <Select
                                    options={parsedData?.formats?.map((format) => ({
                                        label: format.label,
                                        value: format.mnemo,
                                    }))}
                                    disabled
                                    placeholder="Выберите формат"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            {!!format && (
                                <div style={{ backgroundColor: '#fb5c5c', color: 'white' }}>
                                    Убедитесь, что измеряемый атрибут совпадает по формату с {formatLabel}
                                </div>
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    {format && format === 'double' && (
                        <Row gutter={8}>
                            <Col span={6}>
                                <div>Постобработка</div>
                            </Col>
                            <Col span={18}>
                                <Form.Item name={['postprocessing']} style={{ width: '100%' }}>
                                    <CodeEditor editable={true} placeholder="Введите код" />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                    {format && format === 'string' && (
                        <Row gutter={8}>
                            <Col span={6}>
                                <div>Регулярное выражение</div>
                            </Col>
                            <Col span={18}>
                                <Form.Item name={['regexp']} style={{ width: '100%' }}>
                                    <Input
                                        prefix={
                                            statusRegexp === 'error' && (
                                                <ECTooltip 
                                                    // eslint-disable-next-line max-len
                                                    title="Внимание! Убедитесь, что данное значение валидно для регулярного выражения"
                                                >
                                                    <CloseCircleOutlined />
                                                </ECTooltip>
                                            )
                                        }
                                        status={statusRegexp}
                                        placeholder="Введите регулярное выражение"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                    {format && format === 'json' && (
                        <Row gutter={8}>
                            <Col span={6}>
                                <div>Постобработка</div>
                            </Col>
                            <Col span={18}>
                                <Form.Item name={['postprocessing']} style={{ width: '100%' }}>
                                    <Input placeholder="Введите строку" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Form>
    )
};

export default AgentMetricsInput;