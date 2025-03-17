export interface ITempModificat {
    name: string,
    beginning: any,
    end: any,
    pictureAfterTitle: string,
    holydayStatus: boolean,
}

export type ITempModificatWithGetValue = ITempModificat & {
    getValue: (key: string) => string;
}