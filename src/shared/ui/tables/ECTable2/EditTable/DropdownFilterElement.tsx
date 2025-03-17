/* eslint-disable indent */
import { FilterOutlined } from '@ant-design/icons'
import { BaseButton } from '@shared/ui/buttons'
import { Select } from '@shared/ui/forms'
import { Col, Input, Row } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { DatePicker } from 'antd/lib'
import dayjs from 'dayjs'
import React, { FC, useEffect, useMemo, useRef } from 'react'

interface IDropdownFilterElementProps extends FilterDropdownProps {
    elementType?: 'text' | 'select' | 'date' | 'multiselect'
    options?: DefaultOptionType[]
    onConfirm?: () => void
}

const { RangePicker } = DatePicker;

/**
 * Компонент для отображения при нажатии кнопки фильтрации в заголовке таблицы
 * 
 * @param elementType - выбор отображения в виде текстового инпута или селекта
 * @param options - опции селекта при выборе elementType="select"
 * @param onConfirm - функция, которая будет выполнена при нажатии на кнопку фильтрации в компоненте фильтрации
 */
export const DropdownFilterElement: FC<IDropdownFilterElementProps> = ({
    elementType = 'text',
    options = [],
    onConfirm,
    ...props
}) => {
    // todo: какой реф указать для select?
    const ref = useRef<any>()

    const onFieldClear = () => {
        props.setSelectedKeys([])
        props.clearFilters()
        onConfirm?.()
        props.confirm({ closeDropdown: false })
    }

    const elementProps = useMemo(() => ({
        value: elementType === 'multiselect' ? props.selectedKeys : props.selectedKeys?.[0],
        onChange: (ev: any) => {
            let val;

            if (elementType === 'multiselect') {
                val = ev;
                props.setSelectedKeys(val)
            } else {
                val = typeof ev === 'object' ? ev?.target.value : ev;
                props.setSelectedKeys(val ? [val] : []);
            }

            if (!val?.length) {
                onFieldClear();
            }
        },
        onKeyUp: (ev: React.KeyboardEvent<HTMLDivElement>) => {
            if (ev.key === 'Enter') {
                onConfirm?.()
                props.confirm()
            }
        },
        allowClear: true,
        mode: elementType === 'multiselect' ? 'multiple' : undefined, // Включаем мультиселект

    }), [props.selectedKeys])

    // фокусировка на инпуте при открытии фильтрации (работает только на первое открытие)
    useEffect(() => {
        if (props.visible) {
            ref.current?.focus()
        } else {
            ref.current?.blur()
        }
    }, [props.visible])


    return (
        <Row gutter={8} style={{ padding: 8 }}>
            <Col>
                {elementType === 'select' && (
                    <Select
                        style={{ minWidth: 200 }}
                        options={options}
                        ref={ref}
                        autoFocus
                        {...elementProps}
                    />
                )}
                {elementType === 'multiselect' && (
                    <Select
                        style={{ width: 200 }}
                        options={options}
                        ref={ref}
                        autoFocus
                        mode="multiple"
                        maxTagCount="responsive"
                        {...elementProps}
                    />
                )}
                {elementType === 'date' && (
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        autoFocus
                        allowEmpty={[true, true]}
                        ref={ref}
                        onChange={(date) => {
                            if (date) {
                                props.setSelectedKeys([dayjs(date[0]).unix(), dayjs(date[1]).unix()])
                            } else {
                                onFieldClear()
                            }
                        }}
                    />
                )}
                {elementType === 'text' && <Input autoFocus ref={ref} {...elementProps} />}
            </Col>
            <Col>
                <BaseButton
                    type="primary"
                    style={{ width: '100%', minWidth: 30, }}
                    onClick={() => {
                        onConfirm?.()
                        props.confirm()
                    }}
                    icon={<FilterOutlined />}
                />
            </Col>
        </Row>
    )
}