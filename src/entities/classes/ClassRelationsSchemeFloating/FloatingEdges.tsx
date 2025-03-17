import { useCallback } from 'react';
import { useStore, getBezierPath } from 'reactflow';
import { getEdgeParams } from './services';
import RhombColor from './Icons/RhombColor';
import Rhomb from './Icons/Rhomb';
import ArrowRightEmpty from './Icons/ArrowRightEmpty';
import ArrowRight from './Icons/ArrowRight';

function FloatingEdge({ id, source, target, markerEnd, style }) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    if (!sourceNode || !targetNode) {
        return null;
    }

    const newSourceNode = {
        'width': sourceNode.width,
        'height': sourceNode.height,
        'id': sourceNode.id,
        //@ts-ignore
        'currentId': sourceNode.currentId,
        'style': sourceNode.style,
        'data': sourceNode.data,
        'position': sourceNode.position,
        'sourcePosition': sourceNode.sourcePosition,
        'targetPosition': sourceNode.targetPosition,
        'type': sourceNode.type,
        //@ts-ignore
        'rank': sourceNode.rank,
        'positionAbsolute': sourceNode.positionAbsolute
    }

    const newTargetNode = {
        'width': targetNode.width,
        'height': targetNode.height,
        'id': targetNode.id,
        //@ts-ignore
        'currentId': targetNode.currentId,
        'style': targetNode.style,
        'data': targetNode.data,
        'position': targetNode.position,
        'sourcePosition': targetNode.sourcePosition,
        'targetPosition': targetNode.targetPosition,
        'type': targetNode.type,
        //@ts-ignore
        'rank': targetNode.rank,
        'positionAbsolute': targetNode.positionAbsolute
    }

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(newSourceNode, newTargetNode);

    const tmp: string = markerEnd.split('url')[1].split('(')[1].split(')')[0].split('#')[1]

    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
    });

    return (
        <>
            {tmp === `composition-${id}` && (<RhombColor targetPos={targetPos} id={id} />)}
            {tmp === `aggregation-${id}` && (<Rhomb targetPos={targetPos} id={id} />)}
            {tmp === `generalization-${id}` && (<ArrowRightEmpty targetPos={targetPos} id={id} />)}
            {tmp === `association-${id}` && (<ArrowRight targetPos={targetPos} id={id} />)}
            
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                style={style}
            />
        </>

    );
}

export default FloatingEdge;