export type TPage = {
    name: string
    url: string
    menu?: string
    vtemplate_id: number
    id: string
    component?: React.FC
    fullScreen?: boolean
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type TColor = RGB | RGBA | HEX;