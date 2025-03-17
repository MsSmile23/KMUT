import { IOptionsList } from '../types';
import { areaStaticOptions } from './static/areaStaticOptions';
import { areasplineStaticOptions } from './static/areasplineStaticOptions';
import { columnStaticOptions } from './static/columnStaticOptions';
import { lineStaticOptions } from './static/lineStaticOptions';
import { splineStaticOptions } from './static/splineStaticOptions';
import { variablepieStaticOptions } from './static/variablepieStaticOptions';
import { pieStaticOptions } from './static/pieStaticOptions';

export const highchartsStaticsOptions: IOptionsList = {
    line: lineStaticOptions,
    spline: splineStaticOptions,
    area: areaStaticOptions,
    areaspline: areasplineStaticOptions,
    column: columnStaticOptions,
    variablepie: variablepieStaticOptions,
    pie: pieStaticOptions
}