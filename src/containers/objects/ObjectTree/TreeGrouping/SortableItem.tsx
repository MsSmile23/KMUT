import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, idx, name }: {id: string, idx: number, name: string}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition  
    } = useSortable({ id });

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes} 
            {...listeners}
            key={id}
            style={{
                ...styles,
                padding: 5,
                borderRadius: 5,
                backgroundColor: '#d8d8d8',
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                overflow: ' hidden',
                textOverflow: 'ellipsis'
            }}
        >
            {idx + 1}. {name}
        </div>
    )
}