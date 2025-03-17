import { ProbesData } from "@shared/api/Actions/Models/getProbes/getProbes";
import { ColumnType, Probe, TranformedObjectData } from "./types";

export const columns: ColumnType[] = [
    {
        title: '',
        dataIndex: 'Check',
        key: 'Check',
        align: 'center',
        width: '1%'
    },
    {
        title: 'Измерение',
        dataIndex: 'Attribute',
        key: 'Attribute',
        width: '40%'
    },
    {
        title: 'Результат',
        dataIndex: 'Meas',
        key: 'Meas',
        align: 'center',
        width: '10%'
    },
];

export const MockResponse = [
    {
        "obj_attr_id": 10108,
        "value": "0"
    },
    {
        "obj_attr_id": 10120,
        "value": "0.012"
    },
    {
        "obj_attr_id": 10121,
        "value": "0.129"
    }
]

export const selectItem = (prevState, item, checked) => {
    const newState = {
        selectedObjects: { ...prevState.selectedObjects },
        selectedProbes: { ...prevState.selectedProbes },
        selectedAttributes: { ...prevState.selectedAttributes }
    };

    const handleObjectAttributes = (attributes) => {
        attributes.forEach((attribute) => {
            newState.selectedAttributes[`${attribute.prid}-${attribute.id}`] = checked;
        });
    };

    if (item[0]?.object || item?.object?.id) {
        const objectsToIterate = Array.isArray(item) ? item : [item];
        objectsToIterate.forEach(item => {
            newState.selectedObjects[item.object.id] = checked;
            item.probes.forEach((probe: Probe) => {
                newState.selectedProbes[probe.prid] = checked;
                handleObjectAttributes(probe.object_attributes);
            });
        });
    } else if (item?.object_attributes) {
        newState.selectedProbes[item.prid] = checked;
        handleObjectAttributes(item.object_attributes);
    } else if (item.attribute_id) {
        newState.selectedAttributes[`${item.prid}-${item.id}`] = checked;
    }
    return newState
}

export const transformData = (data: ProbesData[]): TranformedObjectData | {} => {
    const accum = {};
    data.forEach(item => {
        const objKey = `${item.object.id}`
        if (accum[objKey]) {
            const existProbe = accum[objKey].probes.find((probe: Probe) => probe.id === item.probe.id)
            if (existProbe > -1) {
                accum[objKey].probes[existProbe].object_attributes?.push(...item?.object_attributes)
            } else {
                accum[objKey].probes.push({
                    ...item.probe,
                    prid: item.prid,
                    object_attributes: item.object_attributes.map(attribute => ({...attribute, prid: item.prid}))
                })
            }
        } else {
            accum[objKey] = {
                object: item.object,
                probes: [{
                    ...item.probe,
                    prid: item.prid,
                    object_attributes: item.object_attributes.map(attribute => ({...attribute, prid: item.prid}))
                }]
            }
        }
    })
    return Object.values(accum)
}