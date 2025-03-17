// eslint-disable-next-line space-before-function-paren
export function yAxisLabelFormatter (this: any) {
    return `${this.value.toLocaleString()}&nbsp;&nbsp;&#8212`
}