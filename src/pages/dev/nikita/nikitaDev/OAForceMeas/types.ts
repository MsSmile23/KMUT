import { IAttribute } from "@shared/types/attributes"

export interface Probe {
    class_id: number
    codename: string
    deleted_at: any
    id: number
    name: string
    object_attributes: ObjectAttributes[]
    prid: number
}

export interface Object {
    class_id: number
    codename: string
    deleted_at: any
    id: number
    name: string
}

export interface ObjectAttributes {
    attribute_id: number
    id: number
}

export interface TranformedObjectData {
    object: Object
    probes: Probe[]
}

export type ColumnType = {
    title: string;
    dataIndex: string;
    key: string;
    align?: 'left' | 'center' | 'right';
    width: string;
};

export interface ProbeTableProps {
    probe: Probe;
    selectedItems: {
        selectedProbes: Record<string, boolean>;
        selectedAttributes: Record<string, boolean>;
    };
    handleCheckboxChange: (item: IAttribute | Object | Probe, checked: boolean) => void
    getAttr: (id: number) => IAttribute
    response
    loading: {
        flag: boolean
        attempts: number
    }
}