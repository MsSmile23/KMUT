import { Select } from 'antd';
import { SelectProps } from 'antd/lib';
import { forwardRef, useEffect, useRef, useState } from 'react';
import './ECSelectSimpleForm.css';

export interface IECSelectSimpleForm extends SelectProps {
    borderColor: string,
    textColor: string,
    backgroundColor: string,
    align?: 'horizontal' | 'vertical',

    /* Рендерить ли плейсхолдер селекта как тэг */
    selectPlaceholderTag?: boolean,
}

export const ECSelectSimpleForm = ({
    align,
    backgroundColor,
    borderColor,
    textColor,
    selectPlaceholderTag = false,
    ...props
}: IECSelectSimpleForm,
) => {
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef(null);

    const onDropdownChange = (value) => {
        setTimeout(() => {
            setIsFocused(value);


            if (value) {
                setTimeout(() => {
                    const searchInput = ref?.current
                        ?.querySelector?.('.ant-select-selection-search-input') as HTMLInputElement;

                    searchInput?.focus?.();
                });
            }
        }, 0);
    }

    return (
        <div ref={ref}>
            <Select
                options={[
                    {
                        label: 'Значение 1',
                        value: 1,
                    },
                    {
                        label: 'Значение 2',
                        value: 2,
                    },
                    {
                        label: 'Значение 3',
                        value: 3,
                    },
                    {
                        label: 'Значение 4',
                        value: 4,
                    },
                    {
                        label: 'Значение 5',
                        value: 5,
                    },
                    {
                        label: 'Значение 6',
                        value: 6,
                    },
                ]}
                className={'ECSelectSimpleForm '
                    + (isFocused ?  'ECSelectSimpleForm-focused' : '')
                    + (selectPlaceholderTag ? ' ECSelectSimpleForm-selectTag ' : '')
                }
                rootClassName="ECSelectSimpleForm-dropdown"
                // value={value}
                // onChange={values => onSelect?.(values)}
                style={{
                    width: '100%',
                    minWidth: align === 'horizontal' && 280,
                    maxWidth: align === 'horizontal' && 280,
                    minHeight: 56,
                    // height: 'auto',
                    overflow: 'hidden',
                    ['--ECSelectSimpleForm-field-border-color' as string]: borderColor,
                    ['--ECSelectSimpleForm-field-text-color' as string]: textColor,
                    ['--ECSelectSimpleForm-field-background-color' as string]: backgroundColor,
                    ...(props.style || {}),
                }}
                dropdownStyle={{
                    ['--ECSelectSimpleForm-field-border-color' as string]: borderColor,
                    ['--ECSelectSimpleForm-field-text-color' as string]: textColor,
                    ['--ECSelectSimpleForm-field-background-color' as string]: backgroundColor,
                }}
                // allowClear
                placeholder={(
                    <span
                        className="ECSelectSimpleForm-allTag"
                        style={{
                            padding: '0 12px',
                            display: 'inline-block',
                            color: textColor,
                        }}
                    >
                        Все
                    </span>
                )}
                filterOption={(input: string, option?: { label: string; value: number }) => {
                    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }}
                maxTagCount={isFocused ? undefined : 'responsive'}
                onDropdownVisibleChange={onDropdownChange}
                {...props}
            />
        </div>
    )
};