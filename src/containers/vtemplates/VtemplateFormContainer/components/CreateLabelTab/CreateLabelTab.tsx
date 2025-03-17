import { CustomTab } from '@shared/ui/CustomTabs/components/CustomTab'
import { Dropdown, Popconfirm } from 'antd'
import {
    EditOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { FC, useEffect, useMemo, useState } from 'react';
import { StateText } from '@entities/states';
import { selectStates, useStatesStore } from '@shared/stores/states';
import { useStateEntitiesStore } from '@shared/stores/state-entities';
import { useObjectsStore } from '@shared/stores/objects';
import { IChildObjectWithPaths } from '@shared/utils/objects';

interface CreateLabelTabProps {
    label: string 
    keyTab: string 
    i: number 
    preview: boolean
    activeKey: string
    lengthTab: number
    handleClickEdit?: (event: any, key: string) => void,
    handleRemoveTab?: (event: any, key: string) => void,
    objectId?: number,
    enableStateText?: boolean
    group_name?: string
    isInterfaceShowcase?: boolean 
    typeTabs?: 'vertical' | 'horizontal'
    tabOutputMode?: 'individualTabs' | 'tabsList'
    linkedObjects?: IChildObjectWithPaths[],
    objectGroupPreview?: number
    onSelectObject?: (id: number, keyTab: string) => void;
}

const CreateLabelTab: FC<CreateLabelTabProps> = (props) => {

    const { 
        label, 
        keyTab, 
        i, 
        preview, 
        activeKey, 
        lengthTab,
        handleClickEdit,
        handleRemoveTab,
        objectId,
        enableStateText,
        isInterfaceShowcase,
        typeTabs,
        tabOutputMode = 'individualTabs',
        linkedObjects,
        objectGroupPreview,
        onSelectObject,
    } = props

    const object = useObjectsStore().getByIndex('id', objectId)
    const states = useStatesStore(selectStates)
    const stateEntities = useStateEntitiesStore(st => st.store.data)
    const [ open, setOpen ] = useState(false)

    //Статус объекта вкладки
    const stateTextElement = (object: Pick<IChildObjectWithPaths, 'id' | 'name'>, label: string) => {
        //Получаем статус
        const stateId = stateEntities?.objects?.find((se) => se.entity === object?.id)?.state
        const state = states.find(({ id }) => id === stateId)

        return (
            <span onClick={() => setOpen(true)}>
                {enableStateText ?
                    <StateText 
                        state={state} 
                    >
                        {label}
                    </StateText>
                
                    : label}
            </span>
        )
    }

    //Формируем выпадающий список объектов
    const items = useMemo(() => {
        return linkedObjects?.map((linkedObject) => {

            return {
                label: linkedObject.name,
                key: linkedObject.id,
                onClick: () => {
                    onSelectObject(linkedObject.id, keyTab)
                    setOpen(false)
                }
            }
        })
    }, [linkedObjects])

    const stateLabelText = stateTextElement(object, label)
    
    const customTabRender = (
        <CustomTab
            activeKey={activeKey}
            currentKey={keyTab}
            tabsLength={lengthTab}
            index={i}
            typeTabs={typeTabs}
            preview={preview}
        >
            {!preview
                ? (
                    <span>
                        {stateLabelText}
                        <span
                            className="iconEdit"
                            onClick={(e) => handleClickEdit(e, keyTab)}
                        >
                            <EditOutlined />
                        </span>
                        {!isInterfaceShowcase && 
                        <span className="iconEdit" onClick={(e) => e.stopPropagation()}>
                            <Popconfirm
                                placement="bottomRight"
                                title="Удалить ?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={(e) => handleRemoveTab(e, keyTab)}
                            >
                                <CloseOutlined />
                            </Popconfirm>
                        </span>}
                    </span>
                )
                : stateLabelText}
        </CustomTab>
    )

    //В случае выбора выпадающего списка передаем объект по-умолчанию в onSelectObject
    useEffect(() => {
        if (tabOutputMode === 'tabsList') {
            onSelectObject(objectGroupPreview ?? items[0]?.key, keyTab)
        }
    }, [tabOutputMode])

    return tabOutputMode == 'tabsList' && linkedObjects?.length !== 0 ?
        <Dropdown
            trigger={['click']}
            placement="bottomRight"
            menu={{ 
                items: items,
                selectable: true,
                onClick: () => setOpen(false)
            }}
            open={open}
            onOpenChange={(open) => setOpen(open)}
        >
            {customTabRender}
        </Dropdown>
        : customTabRender
}

export default CreateLabelTab