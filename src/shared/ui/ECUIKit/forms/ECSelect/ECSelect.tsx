import { ECSelectMode, ECSelectModeProps } from './types';
import { ECSelectDefault } from './components/ECSelectDefault/ECSelectDefault';
import { ECSelectSimpleForm } from './components/ECSelectSimpleForm/ECSelectSimpleForm';

export interface IECSelectProps<Mode extends ECSelectMode> {
    mode?: Mode,
    selectProps: ECSelectModeProps[Mode],
}

export const ECSelect = <T extends ECSelectMode = 'default'>({
    selectProps,
    mode,
}: IECSelectProps<T>) => {
    const selectMode = mode || 'default';

    if (selectMode === 'ECSimpleFilters') {
        return <ECSelectSimpleForm {...selectProps as ECSelectModeProps['ECSimpleFilters']} />
    }

    return <ECSelectDefault {...selectProps as ECSelectModeProps['default']} />;
}