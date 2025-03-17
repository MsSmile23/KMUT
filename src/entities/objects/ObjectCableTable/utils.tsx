import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { IObject } from '@shared/types/objects'
import { IChildObjectWithPaths } from '@shared/utils/objects'
import { IClass } from '@shared/types/classes'
import { Col, Row } from 'antd'

export const findAttribute = (obj: IObject, attributeId?: number, name = true) => obj?.object_attributes?.find((oa) => {
    return oa.attribute_id == attributeId
})?.attribute_value ?? (name ? obj?.name : '')

export const findAttributeInfo = (obj: IObject, attributeId?: number) => obj?.object_attributes?.find((oa) => {
    return oa?.attribute_id == attributeId
})

export const defineAttributeView = (obj: IObject, id: number) => {
    const attr = findAttributeInfo(obj, id)

    switch (attr?.attribute?.data_type?.inner_type) {
        case 'boolean': 
            return attr?.attribute_value 
                ? <CheckOutlined style={{ color: '#1ed960' }} /> 
                : <CloseOutlined />
        
        default:
            return attr?.attribute_value
    }
}

export const findLocation = (objects: IChildObjectWithPaths[], deviceId: number) => {
    return objects.find(({ id }) => id === deviceId)?.paths?.visibleArr?.map(({ name }) => name)?.join(', ')
}

export const createSide = (device: IObject, port: IObject, objects: IChildObjectWithPaths[]) => ({
    device: device, 
    port: port, 
    deviceClass: device?.class?.name,
    deviceLocation: findLocation(objects, device?.id), 
    portClass: port?.class?.name
})

export const createColumn = (key: string, title: string | [string, string], options?: {
    whiteSpace?: React.CSSProperties['whiteSpace'], 
    fixed?: 'left' | 'right', 
    align?: 'left' | 'center' | 'right',
}) => {
    const styles = { 
        textAlign: 'center' as const, 
        whiteSpace: options?.whiteSpace,
        // todo: вынести в отдельные стили
        fontSize: 16, fontWeight: 700
    }

    const isTitleString = typeof title === 'string'

    return {
        key,
        title: isTitleString
            ? (<div style={styles}>{title}</div>)
            : (
                <Row>
                    <Col xs={24} style={styles}>{title[0]}</Col>
                    <Col xs={24} style={styles}>{title[1]}</Col>
                </Row>
            ),
        dataIndex: key,
        sorter: (a: any, b: any) => a?.[key]?.props?.children?.localeCompare(b?.[key]?.props?.children),
        fixed: options?.fixed,
        align: options?.align,
        sortableTitle: isTitleString ? title : `${title[0]} ${title[1]}`
    }
}

export const findDevice = (objects: IObject[], relationsPortDevice: number[],  searchedObj: IObject) => {
    return objects.find((obj) => obj.id === searchedObj?.links_where_left.find((link) => {
        return relationsPortDevice.includes(link.relation_id)
    })?.right_object_id)
}

export const findClassName = (classes: IClass[], obj: IObject) => {
    return classes.find((cls) => cls.id === obj?.class_id)?.name
}