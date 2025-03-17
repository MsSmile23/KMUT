import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Form, Input } from 'antd'
import { Select } from '@shared/ui/forms'
import { IHeaderOptions, IMultipleChartFormPart, IOptionsListSettings } from './MultipleChartForm'

interface ISortableFormPart {
    currentItem: IMultipleChartFormPart
    field: any
    length: number
    index: number
    remove: any
    styles: any
    restProps?: any
    optionsListSettings?: IOptionsListSettings
    isSingle?: boolean
    headerOptions?: IHeaderOptions
}
export const SortableAxisPropsItem = ({
    currentItem, 
    field, 
    length, 
    index,
    remove, 
    styles, 
    optionsListSettings, 
    isSingle, 
    headerOptions,
    ...restProps
}: ISortableFormPart) => {
    const {
        attributes,
        setActivatorNodeRef,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: currentItem?.axisID })

    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    // console.log('optionsListSettings', optionsListSettings)

    return (
        <div
            ref={setNodeRef}
            {...attributes} 
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '100%',
                padding: 10,
                border: '1px solid #d9d9d9', 
                boxSizing: 'border-box', 
                ...styles?.formItem,
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {!isSingle && (
                <Form.Item
                    style={{ marginBottom: 0, }}
                >
                    <div 
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            borderRadius: 3,
                            cursor: 'move', 
                        }}
                        ref={setActivatorNodeRef}   
                        {...listeners}     
                    >
                        <svg viewBox="0 0 20 20" width="20" height="24" fill="#ccc">
                            <path 
                                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 
                                .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 
                                14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 
                                4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" 
                            />
                        </svg>
                    </div>
                </Form.Item>)}
            <Form.Item
                name={[field.name, 'axisName']}
                key={`${field.key}-target-${index}`}
                style={headerOptions?.axisName?.styles}
                validateDebounce={500}
            >
                <Input 
                    type="text" 
                    placeholder="Название оси" 
                    allowClear
                />
            </Form.Item>
            <Form.Item
                name={[field.name, 'attributeIds']}
                key={`${field.key}-linked-${index}`}
                style={headerOptions?.attributeIds?.styles}
            >
                <Select 
                    placeholder="Выберите атрибуты"
                    options={optionsListSettings?.attributes/* .sort((a, b) => a.label.localeCompare(b.label)) */}
                    allowClear
                    mode="multiple"
                    showSearch
                    autoClearSearchValue={false}
                    filterOption={filterOption}
                    maxTagCount="responsive"
                    {...restProps}
                />
            </Form.Item>
            <Form.Item 
                name={[field.name, 'unit']}
                style={headerOptions?.unit?.styles}
                key={`${field.key}-unit-${index}`}
            >
                <Select 
                    placeholder="Выберите единицу измерения"
                    options={optionsListSettings?.units}
                    // options={getListByType('unit')}
                    // options={optionsListSettings?.classes ?? storeClasses}
                    allowClear
                    autoClearSearchValue={true}
                    showSearch
                    filterOption={filterOption}
                    maxTagCount="responsive"
                    // onClear={() => customClearFields('classId', index)}
                    {...restProps}
                />
            </Form.Item>
            {/* <Form.Item 
                name={[field.name, 'minValue']}
                style={headerOptions?.minValue?.styles}
                key={`${field.key}-minValue-${index}`}
            >
                <Select 
                    placeholder="Минимальная величина"
                    options={optionsListSettings?.minValues}
                    // options={getListByType('minValue')}
                    allowClear
                    showSearch
                    autoClearSearchValue={false}
                    filterOption={filterOption}
                    maxTagCount="responsive"
                    {...restProps}
                />
            </Form.Item>
            <Form.Item 
                name={[field.name, 'maxValue']}
                style={headerOptions?.maxValue?.styles}
                key={`${field.key}-maxValue-${index}`}
            >
                <Select 
                    placeholder="Максимальная величина"
                    options={optionsListSettings?.maxValues}
                    // options={getListByType('maxValue')}
                    allowClear
                    showSearch
                    autoClearSearchValue={false}
                    filterOption={filterOption}
                    maxTagCount="responsive"
                    {...restProps}
                />
            </Form.Item> */}
            {!isSingle && length > 1 && (
                <Form.Item
                    style={{ marginBottom: 0, }}
                >
                    <div
                        onClick={() => {
                            remove(field.name)
                        }}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center',
                            borderRadius: 3,
                            cursor: 'pointer', 
                        }}    
                    >
                        <ECIconView 
                            icon="DeleteOutlined" 
                            style={{ 
                                cursor: 'pointer',
                                color: '#ccc', 
                                fontSize: 18, 
                            }}  
                        />
                    </div>
                </Form.Item>)}
        </div>
    )
}