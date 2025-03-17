import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Input, Row } from 'antd'

interface SearchInputProps {
    handleSearch: React.ChangeEventHandler<HTMLInputElement>,
    searchValue: string,
}

export const SearchInput = ({ handleSearch, searchValue }: SearchInputProps) => {
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
                value={searchValue ?? ''}
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