import { FC, useEffect, useState } from 'react';
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableColumn } from './SortableColumn';
import { Card } from 'antd';

export const SortableColumns: FC<{ 
    value?: any[] 
    onChange?: (event?: any) => any
}> = ({ value, onChange }) => {
    const [items, setItems] = useState([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setItems(value)
    }, [value])

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((value) => value === active.id);
            const newIndex = items.findIndex((value) => value === over.id);
            const result = arrayMove(items, oldIndex, newIndex)

            setItems(result);
            onChange?.(result)
        }
    }

    return (
        <Card>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((value) => <SortableColumn key={value} value={value} />)}
                </SortableContext>
            </DndContext>
        </Card>
    )
}