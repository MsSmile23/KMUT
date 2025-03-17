import { useConfigStore } from '@shared/stores/config'
import { useMemo } from 'react';

export const useConfigSection = (sectionMnemo: string) => {
    const config = useConfigStore(st => st.store.data);

    const frontPageConfig = useMemo(() => {
        const configSection = config.find(section => section.mnemo === sectionMnemo);

        if (!configSection) {
            return null;
        }

        return JSON.parse(configSection.value);
    }, [config]);

    return frontPageConfig;
}