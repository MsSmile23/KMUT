import { useEffect, useState } from 'react';
import { StoreStates } from '@shared/types/storeStates';
import { useObjectsStore } from '@shared/stores/objects';
import { useObjectAttributesStore } from '@shared/stores/objectAttributes/useObjectAttributesStore';
import { generalStore } from '@shared/stores/general';
import { Preload } from './Preload';

const interfacePreloadStores = ['objects', 'objectAttributes'];

const interfaces = {
    showcase: 'Витрина',
    constructor: 'Конструктор',
    manager: 'Менеджер',
};

export const InterfacePreloader = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const objectsStoreState = useObjectsStore((state) => state.store.state);
    const objectsAttributesStore = useObjectAttributesStore((state) => state.store.state);
    const interfaceView = generalStore((state) => state.interfaceView);

    useEffect(() => {
        // Проверяем, находится ли хотя бы один из сторов в состоянии LOADING
        const isObjectsLoading = objectsStoreState === StoreStates.LOADING;
        const isAttributesLoading = objectsAttributesStore === StoreStates.LOADING;

        // Если хотя бы один стор в состоянии LOADING, показываем прелоадер
        if (isObjectsLoading || isAttributesLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [objectsStoreState, objectsAttributesStore, interfaceView]);

    // Если данные загружаются (LOADING), показываем прелоадер
    if (loading) {
        return <Preload selectedStores={interfacePreloadStores} loadingInterface={interfaces[interfaceView]} />;
    }

    // Если данные не загружаются, показываем интерфейс
    return <>{children}</>;
};