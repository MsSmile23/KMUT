import { FC } from 'react'
import { TreeFiltering } from '../TreeFiltering'
import { TreeGrouping } from '../TreeGrouping'
import { ITreeState, ITreeStore } from '../treeTypes'
import { ClearSettings } from './ClearSettings'
import { useTreeStore } from '@shared/stores/trees'
import { TreeButton } from './TreeButton'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';


export const TreeHeader: FC<{
    availableClassifiers: ITreeState['availableClassifiers'],
    id: number
}> = ({ availableClassifiers, id }) => {

    const expandedKeys = useTreeStore((state: ITreeStore) => state.expandedKeys[id])
    const setExpandedKeys = useTreeStore((state: ITreeStore) => state.setExpandedKeys)

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                marginBottom: 14,
                gap: 8
            }}
        >
            {expandedKeys === undefined
                ? <CustomPreloader size="small" />
                : (
                    <>
                        <TreeButton
                            icon={expandedKeys.findIndex(key => key === '0-0') > -1
                                ? 'FolderOpenOutlined'
                                : 'FolderOutlined'}
                            iconSize={25}
                            title={expandedKeys.findIndex(key => key === '0-0') > -1
                                ? 'Свернуть ветки'
                                : 'Развернуть ветки'}
                            onClickHandler={() => {
                                expandedKeys.findIndex(key => key === '0-0') > -1
                                    ? setExpandedKeys(expandedKeys.filter(key => key !== '0-0'), id)
                                    : setExpandedKeys([...expandedKeys, '0-0'], id)

                            }}
                        />
                        <div style={{ flex: 1 }}></div>
                        <ClearSettings id={id} />
                        <TreeGrouping
                            id={id}
                            classifiers={availableClassifiers}
                        />
                        <TreeFiltering
                            id={id}
                            classifiers={availableClassifiers}
                        />
                    </>)}

        </div>
    )
}