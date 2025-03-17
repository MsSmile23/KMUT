export type CustomText = { 
    text: string 
    bold?: boolean
    italic?: boolean 
    underline?: boolean
 }

export type CustomTextWithDisplay = CustomText & {
    displayText?: string
    valueText?: string
}