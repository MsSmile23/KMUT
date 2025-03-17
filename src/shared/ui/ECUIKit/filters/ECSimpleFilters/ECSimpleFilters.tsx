import { Button, Col, Row } from 'antd'
import { RelationFilterField } from './components/RelationFilterField/RelationFilterField'
import { DateRangeFilterField } from './components/DateRangeFilterField/DateRangeFilterField'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useEffect, useState } from 'react'
import { ArrowLeftOutlined, RedoOutlined } from '@ant-design/icons'
import './ECSimpleFilters.css'
import { ECSimpleFormField, ECSimpleFiltersDTO, ECSimpleFiltersFieldsProps } from './types'
import { useClassesStore } from '@shared/stores/classes'
import { DateLastFilterField } from './components/DateLastFilterField/DateLastFilterField'
import { useAttributesStore } from '@shared/stores/attributes'
import { AttributeFilterField } from './components/AttributeFilterField/AttributeFilterField'
import { UserLoginFilterField } from './components/UserLoginFilterField/UserLoginFilterField'
import { useNavigate } from 'react-router-dom'
import { postFilters } from '@shared/api/Voshod/Models/postFilters/postFilters'
import { IVoshodFilter } from '@shared/types/voshod-filters'
import { useDebounce, useDebounceCallback } from '@shared/hooks/useDebounce'
import { removeUnallowedValuesFromFields, transformECFiltersToVoshodDTO } from './utils'

interface IECSimpleFiltersProps {
    fields: ECSimpleFiltersFieldsProps[];

    align?: 'horizontal' | 'vertical'
    onChange?: (data: IVoshodFilter[]) => void
    style?: React.CSSProperties
    mainClassId: number, // Класс объекта ЕСПД
    hideResetButton?: boolean,
    onApplyClick?: (data: IVoshodFilter[]) => void,

    backButtonUrl?: string;
    onBackButtonClick?: () => void;
    onRefreshButtonClick?: (data: IVoshodFilter[]) => void;

    /** Нужно ли показывать хэдер */
    showHeader?: boolean;
}

export const ECSimpleFilters = ({
    align = 'vertical',
    onChange,
    style = {},
    hideResetButton = false,
    mainClassId,
    onApplyClick,
    fields,
    onBackButtonClick,
    onRefreshButtonClick,
    showHeader = true,
    backButtonUrl = '/',
}: IECSimpleFiltersProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState<ECSimpleFormField[]>([]);
    const [allowedFilters, setAllowedFilters] = useState<IVoshodFilter[]>([])

    const getClassByIndex = useClassesStore((st) => st.getByIndex);
    const getAttrByIndex = useAttributesStore(st => st.getByIndex);

    const accountData = useAccountStore(selectAccount);
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode || 'light';
    const textColor = createColorForTheme(theme?.filter?.filtersTextColor, theme?.colors, themeMode);
    const borderColor = createColorForTheme(theme?.filter?.filtersBorderColor, theme?.colors, themeMode);
    const backgroundColor = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode);

    const onResetFields = () => {
        const newFields = [...formFields];

        for (const field of formFields) {
            if (field.type === 'class') {
                field.value = [];
            }

            if (field.type === 'dates') {
                field.value = {
                    date_from: null,
                    date_to: null,
                }
            }
        }

        setFormFields(newFields)
    }

    const fireOnChange = () => {
        if (!onApplyClick) {
            const transformedData = transformECFiltersToVoshodDTO(formFields);

            onChange?.(transformedData);
        }
    }

    const updateAllowedFilters = useDebounceCallback(() => {
        postFilters({
            filters: transformECFiltersToVoshodDTO(formFields)
        }).then((response => {
            setAllowedFilters(response.data);

            // убираем неверные поля
            const newFormFields = removeUnallowedValuesFromFields(formFields, response.data);

            setFormFields(newFormFields);
        }))
    }, 1000);

    const onBackClick = () => {
        if (onBackButtonClick) {
            onBackButtonClick();
        } else {
            navigate(backButtonUrl);
        }
    }

    useEffect(() => {
        if (!fields) {
            return;
        }

        const newFields: ECSimpleFormField[] = [];
        const mainClass = getClassByIndex('id', mainClassId);
        const mainClassAttributeIds = mainClass?.attributes?.map(attr => attr.id) || [];

        for (const field of fields) {
            if (field.type === 'class') {
                const class_obj = getClassByIndex('id', field.class_id)

                if (class_obj) {
                    newFields.push({
                        type: 'class',
                        class: class_obj,
                        value: Array.isArray(field.defaultValues) ? field.defaultValues : (
                            field.defaultValues ? field.defaultValues : null
                        ),
                        defaultValues: field.defaultValues,
                        isMultiSelect: field.isMultiSelect,
                        tagCloud: field.tagCloud,
                        version: field.version,
                    });
                }
            }

            if (field.type === 'attribute') {
                const attribute = getAttrByIndex('id', field.attribute_id);

                if (attribute && mainClassAttributeIds.includes(field.attribute_id)) {
                    newFields.push({
                        type: 'attribute',
                        attribute,
                        value: [],
                        defaultValues: field.defaultValues,
                        isMultiSelect: field.isMultiSelect,
                        tagCloud: field.tagCloud,
                        version: field.version,
                    })
                }
            }

            if (field.type === 'dates') {
                newFields.push({
                    type: 'dates',
                    value: {
                        date_from: null,
                        date_to: null,
                    },
                })
            }

            if (field.type === 'dates_last') {
                newFields.push({
                    type: 'dates_last',
                    value: null, // TODO узнать при получении бэка
                })
            }

            if (field.type === 'user_login') {
                newFields.push({
                    type: 'user_login',
                    value: null,
                })
            }
        }

        setFormFields(newFields);
    }, [fields]);

    const onSelectObjects = (classId: number, objectIds: number[]) => {
        const selectedField = formFields
            .filter((field) => field.type === 'class')
            .find((field) => field.class.id === classId)

        if (selectedField) {
            selectedField.value = objectIds;
            const newFields = [...formFields];

            setFormFields(newFields);
            updateAllowedFilters();
            fireOnChange();
        }
    }

    const onSelectAttributeValues = (attributeId: number, values: string[]) => {
        const selectedField = formFields
            .filter((field) => field.type === 'attribute')
            .find((field) => field.attribute.id === attributeId);

        if (selectedField) {
            selectedField.value = values;

            const newFields = [...formFields];

            setFormFields(newFields);
            updateAllowedFilters();
            fireOnChange();
        }
    }

    const onChangeDateRange = (data: { date_from: null | string; date_to: null | string }) => {
        const selectedField = formFields.find((field) => field.type === 'dates')

        if (selectedField) {
            selectedField.value = data
            setFormFields([...formFields])
            updateAllowedFilters();
            fireOnChange();
        }
    }

    const onApplyButtonClick = () => {
        if (onApplyClick) {
            const transformedData = transformECFiltersToVoshodDTO(formFields);

            onApplyClick(transformedData);
        }
    }

    const onRefreshClick = () => {
        const transformedData = transformECFiltersToVoshodDTO(formFields);

        onRefreshButtonClick?.(transformedData);
    }

    return (
        <Row
            style={{
                flexDirection: align === 'horizontal' ? 'row' : 'column',
                ...style,
            }}
            gutter={align === 'vertical' ? [0, 12] : [12, 8]}
            className="ECSimpleFilters"
        >
            {
                showHeader &&
                <Col span={24}>
                    {align === 'horizontal' ? (
                        <Row style={{ marginBottom: 16 }}>
                            <Col>
                                <Button
                                    style={{
                                        marginRight: 16,
                                        width: 320,
                                        height: 36,
                                        fontSize: 14,
                                        borderColor: 'transparent',
                                        borderRadius: 4,
                                    }}
                                    className="ECSimpleFilters_applyButton2"
                                    onClick={onApplyButtonClick}
                                >
                                    Применить
                                </Button>
                                <Button
                                    style={{
                                        marginRight: 16,
                                        width: 320,
                                        height: 36,
                                        fontSize: 14,
                                        backgroundColor: '#808080',
                                        borderColor: 'transparent',
                                        color: '#ffffff',
                                        borderRadius: 4,
                                        boxShadow: `
                                            rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
                                            rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
                                            rgba(0, 0, 0, 0.12) 0px 1px 5px 0px
                                        `,
                                    }}
                                    onClick={onResetFields}
                                >
                                    Сбросить
                                </Button>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            <Row style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Col style={{ color: '#FFFFFF', display: 'flex' }}>
                                    <div className="iconWrapper" onClick={onBackClick}>
                                        <ArrowLeftOutlined style={{ fontSize: 18 }} />
                                    </div>
                                    <div className="iconWrapper" onClick={onRefreshClick}>
                                        <RedoOutlined style={{ fontSize: 18 }} />
                                    </div>
                                </Col>
                                {
                                    !hideResetButton &&
                                    <Col>
                                        <Button
                                            style={{
                                                color: '#90caf9',
                                                padding: '3px 9px',
                                                height: 40,
                                                borderRadius: 4,
                                                fontSize: 13,
                                            }}
                                            className="resetFilters"
                                            onClick={onResetFields}
                                        >
                                            Сбросить фильтр
                                        </Button>
                                    </Col>
                                }
                            </Row>
                            <h3 style={{ color: '#FFF' }}>Фильтры</h3>
                            <div
                                style={{
                                    backgroundColor: '#FFF',
                                    height: 1,
                                    width: '100%',
                                }}
                            />
                        </>
                    )}
                </Col>
            }
            {
                onApplyClick && align === 'vertical' && (
                    <Col span={24}>
                        <Button
                            onClick={onApplyButtonClick}
                            className="ECSimpleFilters_applyButton2"
                            style={{
                                padding: '3px 9px',
                                borderRadius: 4,
                                fontSize: 14,
                                boxShadow: `
                                    rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
                                    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
                                    rgba(0, 0, 0, 0.12) 0px 1px 5px 0px
                                `,
                                marginTop: 12,
                                marginBottom: 4,
                                border: 'none',
                                width: '100%',
                                height: 37,
                            }}
                        >
                            Применить
                        </Button>
                    </Col>
                )
            }
            {formFields.map((field, i) => {
                return (
                    <Col key={i} style={{ position: 'relative', paddingTop: 8 }}>
                        <span
                            style={{
                                fontSize: 12,
                                backgroundColor,
                                position: 'absolute',
                                top: 2,
                                left: 12,
                                zIndex: 20,
                                padding: '0 4px',
                                lineHeight: '12px',
                                color: borderColor,
                            }}
                        >
                            {field.type === 'class' && field.class.name}
                            {field.type === 'attribute' && field.attribute.name}
                            {field.type === 'dates' && 'Период'}
                            {field.type === 'dates_last' && 'Период'}
                            {field.type === 'user_login' && 'Логин'}
                        </span>
                        {field.type === 'dates' && (
                            <DateRangeFilterField
                                borderColor={borderColor}
                                textColor={textColor}
                                align={align}
                                backgroundColor={backgroundColor}
                                value={field.value}
                                onChange={onChangeDateRange}
                            />
                        )}
                        {field.type === 'class' && (
                            <RelationFilterField
                                borderColor={borderColor}
                                textColor={textColor}
                                align={align}
                                field={field}
                                allowedFilters={allowedFilters}
                                backgroundColor={backgroundColor}
                                value={field.value}
                                onSelect={(values) => onSelectObjects(field.class.id, values)}
                            />
                        )}
                        {field.type === 'dates_last' && (
                            <DateLastFilterField
                                borderColor={borderColor}
                                textColor={textColor}
                                align={align}
                                backgroundColor={backgroundColor}
                            />
                        )}
                        {field.type === 'attribute' && (
                            <AttributeFilterField
                                borderColor={borderColor}
                                textColor={textColor}
                                align={align}
                                field={field}
                                onSelect={values => onSelectAttributeValues(field.attribute.id, values)}
                                value={field.value}
                                backgroundColor={backgroundColor}
                                allowedFilters={allowedFilters}
                                attribute={field.attribute}
                            />
                        )}
                        {field.type === 'user_login' && (
                            <UserLoginFilterField
                                borderColor={borderColor}
                                textColor={textColor}
                                align={align}
                                backgroundColor={backgroundColor}
                            />
                        )}
                    </Col>
                )
            })}
        </Row>
    )
}