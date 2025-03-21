import { FC } from 'react';
import { getBezierPath } from 'reactflow';
import { getEdgeParams } from './services';

const  FloatingConnectionLine: FC<any> = ({ toX, toY, fromPosition, toPosition, fromNode }) => {
    if (!fromNode) {
        return null;
    }

    const targetNode = {
        id: 'connection-target',
        width: 1,
        height: 1,
        positionAbsolute: { x: toX, y: toY },
        style: { background: 'transparent' }
    };

    const { sx, sy } = getEdgeParams(fromNode, targetNode);
    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: fromPosition,
        targetPosition: toPosition,
        targetX: toX,
        targetY: toY
    });

    return (
        <g>
            <path
                fill="none"
                stroke="#222"
                strokeWidth={1.5}
                className="animated"
                d={edgePath}
            />
            <circle
                cx={toX}
                cy={toY}
                fill="red"
                r={3}
                stroke="#222"
                strokeWidth={1.5}
            />
        </g>
    );
}

export default FloatingConnectionLine;