import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Input, Row } from 'antd'
import { FC } from 'react'
import { useTreeStore } from '@shared/stores/trees'
import { ITreeStore } from './treeTypes'

export const TreeSearch: FC<{ id: number }> = ({ id }) => {
    // const { searchValue, setSearchValue } = useTreeStore(searchValueSelect)

    const searchValue = useTreeStore((state: ITreeStore) => state.searchValue[id])
    const setSearchValue = useTreeStore((state: ITreeStore) => state.setSearchValue)

    // const newSelectedTreeStore = createTreeStoreWithSelectors(useTreeStore, id)
    // const { searchValue, setSearchValue } = newSelectedTreeStore(['searchValue', 'setSearchValue'])

    const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value.toLowerCase(), id)
    }
    
    return (
        <Row
            style={{
                position: 'relative',
                flex: '1 1 100%',
                minWidth: '130px',
            }}
        >
            <Input
                type="text"
                placeholder="Поиск..."
                onChange={handleSearch}
                defaultValue={searchValue ?? ''} 
                // defaultValue={searchValue as unknown as 
                //     ITreeStore['searchValue'][keyof ITreeStore['searchValue']] ?? ''}
                // defaultValue={searchValue[id] ?? ''}
                value={searchValue ?? ''} 
                // value={searchValue as unknown as 
                //     ITreeStore['searchValue'][keyof ITreeStore['searchValue']] ?? ''}
                // value={searchValue[id] ?? ''}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 7,
                    right: 5
                }}
            >
                <ECIconView 
                    icon="SearchOutlined" 
                    style={{ 
                        color: '#D8D8D8', 
                        fontSize: 18 
                    }}  
                />
            </div>
        </Row>
    )
}