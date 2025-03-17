/* eslint-disable max-len */
import { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type {
    DraggableSyntheticListeners,
    UniqueIdentifier
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './SortableItem.scss';

interface IDragHandler {
    customDragHandlerStyle?: CSSProperties
    svgStyle?: CSSProperties
}

interface Props {
  id: UniqueIdentifier;
  customItemStyle?: CSSProperties
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
    attributes: {},
    listeners: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ref() {}
});

export function SortableItem({ children, id, customItemStyle }: PropsWithChildren<Props>) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });
    const context = useMemo(
        () => ({
            attributes,
            listeners,
            ref: setActivatorNodeRef
        }),
        [attributes, listeners, setActivatorNodeRef]
    );
    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition, ...customItemStyle
    };

    return (
        <SortableItemContext.Provider value={context}>
            <li className="SortableItem" ref={setNodeRef} style={style}>
                {children}
            </li>
        </SortableItemContext.Provider>
    );
}

export function DragHandle({ customDragHandlerStyle, svgStyle }: IDragHandler) {
    const { attributes, listeners, ref } = useContext(SortableItemContext);
    const style = customDragHandlerStyle

    return (
        <button className="DragHandle" {...attributes} {...listeners} style={{ ...style }} ref={ref}>
            <svg viewBox="0 0 20 20" width="10" style={svgStyle}>
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
            </svg>
        </button>
    );
}