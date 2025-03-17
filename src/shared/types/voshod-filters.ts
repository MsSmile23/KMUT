// Аттрибут
export interface IVoshodAttributeFilter {
    backFilterName: string;
    filterAttributeId: number;
    filterClassId: number;
    filterLabel: string;
    filterType: 'objectsByAttributeValue';
    filterView: string;
    values: string[];
}

// По объекту
export interface IVoshodLinkFilter {
    backFilterName: string;
    filterClassId: number;
    filterLabel: string;
    filterType: 'objectsByFlatLinks';
    filterView: string;
    values: number[] | number;
}

// Range дат
export interface IVoshodDatesFilter {
    backFilterName: string;
    filterType: 'dates';
    values: any;
}

export interface IMassFailsRegion {
    id: number,
    region_id: number,
    objectsNotAvailable: number,
    timeStart: number,
    localTimeStart: string
}

export type IVoshodFilter = IVoshodAttributeFilter | IVoshodLinkFilter | IVoshodDatesFilter;