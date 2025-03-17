import { StoreStates } from './storeStates';

export interface ILicense {
    main: {
        sn: string;
        from: string;
        till: string;
        valid: boolean;  
    }
    limits: {
        classes: number;
        attributes: number;
        objects: number;
        users: number;
        vtemplates: number;
    }
    current: {
        classes: number;
        attributes: number;
        objects: number;
        users: number;
        vtemplates: number;
    } 
}

export interface IFileObjectLicense {
    file?: File | Blob; // Свойство file, которое является объектом типа File
}

export interface ILicenseStore {
    store: {
        data: ILicense
        state: StoreStates
        error: any
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: ILicenseStore['store']['data']) => void
    setState: (value: ILicenseStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    isActiveLicense: boolean
    setActiveLicense: (value: ILicenseStore['isActiveLicense']) => void
    isCreatable: ({
        entity,
        count,
    }: {
        entity: 'classes' | 'attributes' | 'objects' | 'vtemplates' | 'users' | string
        count?: number
    }) => boolean
    // getStateStereotypeById: (id: number) => IStateStereotype
}

export interface LicenseDataHeads {
    title: string;
    dataIndex: string;
}

export interface ILicenseRow  {
    id?: number,
    key: any,
    description: string,
    limit: number,
    current: number,
    status: boolean
}