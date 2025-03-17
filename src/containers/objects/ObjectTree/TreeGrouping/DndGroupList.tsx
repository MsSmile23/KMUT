import { FC } from 'react'
import { IDndGroupListProps } from '../treeTypes'
import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core'
import { 
    SortableContext, arrayMove, 
    verticalListSortingStrategy, 
    horizontalListSortingStrategy 
} from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'

export const DndGroupList: FC<IDndGroupListProps & {
    strategy?: 'horizontal' | 'vertical',
    customDNDStyles?: React.CSSProperties
}> = ({
    dragOrder, setOrder, strategy, customDNDStyles
}) => {

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    )
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const newOrder = () => {
                const oldIndex = dragOrder.findIndex((dragItem) => dragItem.id === active.id);
                const newIndex = dragOrder.findIndex((dragItem) => dragItem.id === over?.id);
    
                return arrayMove(dragOrder, oldIndex, newIndex);
            }

            setOrder(newOrder())
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: strategy === 'horizontal' ? 'row' : 'column',
                gap: 5,
                padding: 10,
                ...customDNDStyles
            }}
        >
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={dragOrder.map((item) => item.id)} 
                    strategy={strategy === 'horizontal' 
                        ? horizontalListSortingStrategy 
                        : verticalListSortingStrategy
                    }
                >
                    {dragOrder.map((classifier, idx) => {
                        return (
                            <SortableItem 
                                key={classifier.id}
                                id={classifier.id}
                                idx={idx}
                                name={classifier.name}
                            />
                        )
                    })}
                </SortableContext>
            </DndContext>
        </div>
    )
}