import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonSettings } from '../buttons';
import { LeftOutlined } from '@ant-design/icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Button } from 'antd';
import { UniversalSearch } from '@containers/search/UniversalSearch/UniversalSearch';
import { ECIconView } from '../ECUIKit/common/ECIconView/ECIconView';
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects';
import { Select } from '../forms';
import { IClass } from '@shared/types/classes';

export enum HEADER_TYPE {
    MAIN = 'main',
    SERVICE = 'service',
    OBJECT = 'object'
}

export interface IHeaderMobile {
    id?: number,
    headerType: HEADER_TYPE,
    isSearchVisible: boolean,
    isFilterVisible: boolean,
    isPickerVisible: boolean,
    parentClass?: IClass['id'],
    targetClasses?: IClass['id'][],
    title?: string,
}

const HeaderMobile: FC<IHeaderMobile> = (props) => {
    const { id, headerType, isFilterVisible = false, title, isSearchVisible, isPickerVisible } = props
    const navigate = useNavigate()
    const theme = useTheme()
    const getObjectById = useObjectsStore(selectObjectByIndex)
    const paramsId = useParams<{id: string} | null>()
    const goBack = () => navigate(-1)
    const pageTitle = title ? title : (paramsId?.id ? getObjectById('id', +paramsId.id)?.name : theme.title)

    return (
        <div 
            style={{ 
                padding: '9px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: 8,
                width: '100%'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }} >
                {headerType !== HEADER_TYPE.MAIN &&
                    <ButtonSettings
                        icon={false}
                        size="large"
                        onClick={goBack}
                        style={{ 
                            width: 'auto', 
                            backgroundColor: 'transparent', 
                            border: 'none', 
                            color: '#fff',
                            padding: 0
                        }}
                    >
                        <LeftOutlined />
                    </ButtonSettings>}
                <h3 
                    style={{ 
                        color: '#fff', 
                        marginLeft: 8, 
                        fontSize: 14, 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        flexGrow: 1,
                        maxWidth: 100
                    }}
                >
                    {pageTitle}
                </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {isSearchVisible && <UniversalSearch inputWidth={150} />}
                {isPickerVisible && <Select style={{ width: 150, alignSelf: 'flex-end' }} />}
                {isFilterVisible &&
                    <Button
                        icon={<ECIconView icon="FilterOutlined" style={{ fontSize: 25 }} />}
                        style={{ 
                            color: '#fff',
                            border: 'none',
                            boxShadow: 'none',
                            width: 25,
                            minHeight: 24,
                            backgroundColor: 'transparent',
                        }}
                    />}
            </div>
        </div>
    )
}

export default HeaderMobile