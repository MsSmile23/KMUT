import { FC, useEffect, useMemo, useState } from 'react'
import { Select, SelectProps, Spin } from 'antd'
import VirtualList from 'rc-virtual-list'
interface IECSelectWithVirtualization extends SelectProps {
    options: {value: any, label: any,}[]
}
const { Option } = Select

export const ECSelectWithVirtualization: FC<IECSelectWithVirtualization> = (initialProps) => {
    const { options, ...props } = initialProps
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false)

    const filteredOptions = useMemo(() => {
        if (!searchValue) {
            return options
        }

        return options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
    }, [searchValue, options])

    const handleSearch = (value) => {
        setLoading(true)
        setSearchValue(value)
        setLoading(false)
    }

    const renderOption = (item, index, props) => {
        return (
            <Option key={`key_key_${index}_${item.value}`} value={item.value} style={props.style}>
                {item.label}
            </Option>
        )
    }
    
    return (
        <Select
            onSearch={handleSearch}
            filterOption={false}
            notFoundContent={loading ? <Spin size="small" /> : null}
            dropdownRender={(menu) => (
                <div style={{ maxWidth: 1000 }}>
                    <VirtualList data={filteredOptions} height={1} itemHeight={35} itemKey="value">
                        {renderOption}
                    </VirtualList>
                    {menu}
                </div>
            )}
            {...props}
        >
            {filteredOptions.map((option, index) => (
                <Option key={`key_${index}_${option.value}`} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    )
}