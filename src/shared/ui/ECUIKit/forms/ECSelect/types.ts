import { IECSelectDefaultProps } from './components/ECSelectDefault/ECSelectDefault';
import { IECSelectSimpleForm } from './components/ECSelectSimpleForm/ECSelectSimpleForm';

export type ECSelectModeProps = {
    'default': IECSelectDefaultProps,
    'ECSimpleFilters': IECSelectSimpleForm,
}

export type ECSelectMode = keyof ECSelectModeProps;