import { useToggle } from '@shared/hooks/useToggle';
import { ECModal } from '@shared/ui/modals';
import { ECTable } from '@shared/ui/tables/ECTable/ECTable';
import { FC, useEffect } from 'react';

/**
 * Модальное окно для отображения связанных классов ячейки таблицы отчетов
 *
 * @param title - заголовок модального окна
 * @param updateTitle - функция для обновления заголовка модального окна
 * @param linkedObjectsNames - массив названия связаннхы объектов для отображение в списке 
 */
export const LinkedObjectsModal: FC<{ 
    title: string, 
    updateTitle: (val: string) => void,
    linkedObjectsNames: string[], 
}> = ({
    title,
    updateTitle,
    linkedObjectsNames
}) => {
    const modal = useToggle()

    useEffect(() => {
        title ? modal.open() : modal.close()
    }, [title])

    return (
        <ECModal 
            width="60%"
            title={`Связанные объекты для "${title}"`} 
            open={modal.isOpen} 
            onCancel={() => updateTitle('')}
            footer={null}
            centered
        >
            <ECTable 
                showHeader={false}
                columns={[{ key: 'name', dataIndex: 'name', title: 'name' }]}
                dataSource={linkedObjectsNames.map((name) => ({ key: name, name }))}
                pagination={false}
                scroll={{ y: 800 }}
            />
        </ECModal>
    )
}