import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAttributesStore } from '@shared/stores/attributes';
import { useClassesStore } from '@shared/stores/classes';
import { Tag } from 'antd';
import { FC } from 'react';
import { baseColumnsOptions } from './data';
import { ECTooltip } from '@shared/ui/tooltips';

export const SortableColumn: FC<{ value: string }> = ({ value  }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: value });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const findClass = useClassesStore((st) => st.getClassById)
    const findAttribute = useAttributesStore((st) => st.getAttributeById)
    const id = Number(value.match(/(\d+)/)?.[0] || '0')
    const label = baseColumnsOptions.map(({ value }) => value).includes(value)
        ? baseColumnsOptions.find((opt) => opt.value === value)?.label
        : (value.includes('class') ? findClass(id) : findAttribute(id))?.name

    const chooseStyle = () => {
        if (value.includes('target_attr')) {
            return {
                color: 'blue',
                text: 'Атрибут целевого класса',
                shortName: 'АЦК'
            }
        }

        if (value.includes('parent_class')) {
            return {
                color: 'purple',
                text: 'Родительский класс',
                shortName: 'РК'
            }
        }

        if (value.includes('parent_attr')) {
            return {
                color: 'geekblue',
                text: 'Атрибут родительского класса',
                shortName: 'АРК'
            }
        }

        return {
            color: undefined,
            text: 'Стандартное поле',
            shortName: 'СП'
        }
    }

    const styles = chooseStyle()
  
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ECTooltip title={styles?.text} placement="right">
                <Tag style={{ userSelect: 'none', marginTop: 8 }} color={styles?.color}>
                    {label} | {styles?.shortName}
                </Tag>
            </ECTooltip>
        </div>
    );
}