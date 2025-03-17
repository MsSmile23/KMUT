import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Button } from 'antd'
import { FC, useMemo, useState } from 'react'
import { useTreeStore } from '@shared/stores/trees'
import { ITreeStore } from '../treeTypes'
import { useTheme } from '@shared/hooks/useTheme'
import { saveTreeIdSettings } from '../utils'
import { useAccountStore } from '@shared/stores/accounts'
import { StoreStates } from '@shared/types/storeStates'
import { ECTooltip } from '@shared/ui/tooltips'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export const ClearSettings: FC<{ id: number }> = ({ id }) => {
    const clearSettings = useTreeStore((state: ITreeStore) => state.clearSettings)
    const chosenClassifiersCount = useTreeStore((state: ITreeStore) => state.chosenClassifiersCount[id])
    const groupingOrder = useTreeStore((state: ITreeStore) => state.groupingOrder[id])
    const searchValue = useTreeStore((state: ITreeStore) => state.searchValue[id])
    const showHierarchy = useTreeStore((state: ITreeStore) => state.showHierarchy[id])
    const visibleClassIds = useTreeStore((state: ITreeStore) => state.visibleClassIds[id])
    const intermediateClassIds = useTreeStore((state: ITreeStore) => state.intermediateClassIds[id])
    const theme = useTheme()
    const accountData = useAccountStore((st) => st.store.data?.user)
    const storeState = useAccountStore((st) => st.store.state)
    const [updatingState, setUpdatingState] = useState('idle')


    const themeMode = accountData?.settings?.themeMode
    
    const color = useMemo(() => {
        return (
            createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode) ||
            theme?.components?.tree?.showcase?.buttons?.color
        )
    }, [theme, themeMode])
    
    
    const clearAll = () => {
        setUpdatingState('updating')
        saveTreeIdSettings(
            accountData?.settings,
            {
                chosenClassifiers: {},
                groupingOrder: [],
                visibleClasses: [],
                intermediateClasses: [],
                showHierarchy: false
            },
            id
        )
        clearSettings(id)
        setUpdatingState('finish')
    }

    if (
        chosenClassifiersCount  > 0 ||
        groupingOrder?.length > 0 ||
        searchValue?.length > 0 ||
        showHierarchy ||
        (showHierarchy && visibleClassIds?.length > 0) ||
        intermediateClassIds?.length > 0 ||
        (storeState !== StoreStates.FINISH && updatingState === 'updating')
    ) {
        return (
            <ECTooltip title="Сбросить все фильтры">
                <Button
                    icon={<ECIconView icon="DeleteOutlined" style={{ fontSize: 25 }} />}
                    style={{ 
                        color: color ?? '#ffffff',
                        border: 'none',
                        boxShadow: 'none',
                        minWidth: 24,
                        minHeight: 24,
                        background: 'transparent',
                    }}
                    onClick={clearAll}
                />
            </ECTooltip>
        )
    }

    return <> </>
}