import { getSearch } from '@shared/api/Search/Models/getClasses/getSearch';
import { useBool } from '@shared/hooks/useBool';
import { useDebounce } from '@shared/hooks/useDebounce';
import { ISearchResponse } from '@shared/types/search';
import { Col, Dropdown, Input, InputRef, MenuProps, Row, Typography, message } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import { ECTooltip } from '@shared/ui/tooltips';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { getURL } from '@shared/utils/nav';

const cardStyle = {
    cursor: 'pointer'
}

const Title = ({ text }: { text: string }) => (
    <Typography.Text style={{ fontWeight: 600 }}>
        {text}
    </Typography.Text>
)

const HighlighterWithTooltip: FC<{ text: string, value: string}> = ({ text, value }) => {
    const limit = 100
    const found = value.indexOf(text)
    const left = value.slice(found - limit > 0 ? found - limit : 0, found)
    const right = value.slice(found, found + text.length + limit)
    const pointsOnLeft = `${value.slice(0, found).length > limit ? '...' : ''}`
    const pointsOnRight = `${value.slice(found + text.length).length > limit ? '...' : ''}`
    const result = `${pointsOnLeft}${left + right}${pointsOnRight}`

    const renderHighlighter = (value: string) => {
        return <Highlighter searchWords={[text]} textToHighlight={value} />
    }

    return (
        <ECTooltip 
            title={value.length > 200 ? renderHighlighter(`${ value.slice(0, 2000)}...`) : ''} 
            overlayStyle={{ maxWidth: '60%' }}
            placement="bottom"
        >
            {renderHighlighter(result)}
        </ECTooltip>
    )
}

interface UniversalSearchProps {
    inputWidth?: string | number
    dropdownWidth?: string | number
}

/**
 * Ширина инпута должна быть меньше ширины выпадающего списка
 */
export const UniversalSearch: FC<UniversalSearchProps> = ({ inputWidth = '100%', dropdownWidth = '100%' }) => {
    const [ text, setText ] = useState('')
    const [ loadingState, loading ] = useBool()
    const [ result, setResult ] = useState<ISearchResponse | undefined>(undefined)
    const [ focused, focus ] = useBool()
    const [ open, setOpen ] = useState(false)

    const inputRef = useRef<InputRef>(null)
    const searchedText = useDebounce(text, 1500)

    const navTo = useNavigate()
    const redirect = (id: number) => {
        navTo(getURL(
            `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}`, 
            'showcase'
        ))
        // navTo(`/objects/show/${id}`)
    }

    const objectsItems: MenuProps['items'] = (result?.objects || [])?.map((obj) => {
        return {
            label: (
                <Row key={`res-obj-${obj.id}`} style={{ ...cardStyle }} gutter={[12, 12]}>
                    <Col xl={10}><Title text={obj.class.name} /></Col>
                    <Col xl={14}><HighlighterWithTooltip text={text} value={obj.name} /></Col>
                </Row>
            ),
            key: obj.id
        }
    });

    
    const attributesItems: MenuProps['items'] = (result?.object_attributes || [])?.map((oa) => {
        return {
            label: (
                <Row key={`res-attr-${oa.id}`} style={{ ...cardStyle }} gutter={[12, 12]}>
                    <Col xs={10}><Title text={oa.object.class?.name} /></Col>
                    <Col xs={14}>{oa.object.name}</Col>
                    <Col xs={10}>{oa.attribute.name}</Col>
                    <Col xs={14}>
                        <HighlighterWithTooltip text={text} value={oa.attribute_value} />
                    </Col>
                </Row>
            ),
            key: oa.object_id
        }
    })

    const items = [...objectsItems, ...attributesItems]
    const notFoundItem: MenuProps['items'] = [{
        label: <Title text="Совпадения не найдены" />,
        key: 'search-not-found'
    }]
    const notFound = items?.length === 0

    // event должен быть MenuInfo, но этот тип не экспортируется из antd
    const goToFoundItem = (event: any) => {
        if (notFound) {
            return
        }

        setOpen(false)
        setTimeout(() => redirect(Number(event.key)), 200)
    }
    
    useEffect(() => {
        if (!searchedText) {
            setResult(undefined)

            return
        }

        const req = async (text: string) => {
            loading.setTrue()

            try {
                if (searchedText.length < 3) {
                    inputRef.current

                    return
                }    

                const response = await getSearch(text)

                if (response.data && response.success) {
                    setResult(response.data)
                    setOpen(true)
                } else {
                    throw new Error()
                }
            } catch {
                message.error('Ошибка запроса')
            } finally {
                loading.setFalse()
            }
        }

        req(searchedText)
    }, [searchedText])

    useEffect(() => {
        setTimeout(() => {
            setOpen(result !== undefined && focused)
        }, 200)
    }, [Boolean(result), focused])

    // закрываем при очистке
    useEffect(() => {
        if (!text) {
            setOpen(false)
        }
    }, [text])

    return (
        <Dropdown 
            menu={{ 
                items: notFound ? notFoundItem : items,
                onClick: goToFoundItem
            }} 
            open={open}
            overlayStyle={{ maxWidth: dropdownWidth, maxHeight: '50vh', overflowY: 'auto'  }}
        >
            <Input
                ref={inputRef} 
                addonAfter={loadingState ? <LoadingOutlined /> : <SearchOutlined style={{ color: 'white' }} />} 
                placeholder="Поиск"
                style={{ width: inputWidth }}
                value={text}
                onChange={(ev) => setText(ev.target.value)}
                onFocus={focus.setTrue}
                onBlur={focus.setFalse}
                status={searchedText.length < 3 ? (text.length > 0 ? 'warning' : undefined) : undefined}
                allowClear 
            />
        </Dropdown>
    )
}