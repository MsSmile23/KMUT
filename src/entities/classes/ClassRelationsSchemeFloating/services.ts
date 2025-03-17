import { toSvg } from 'html-to-image';
import { Position, MarkerType } from 'reactflow';
import Dagre from '@dagrejs/dagre';

const nodeStyle = { background: '#fff', border: '1px solid black', borderRadius: 5, fontSize: 12 }

const sourceTargetPositions = [
    { source: 'right', target: 'left' },
];

export const getLayoutedElements = (nodes, edges, options) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => g.setNode(node.id, node));

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const { x, y } = g.node(node.id);

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

export function getNodesAndEdges(classes: any, relation: any) {
    const nodes = [];
    const edges = [];

    const currSourceTargetPos = sourceTargetPositions[0];

    let left: any = {}
    let right: any = {}

    for (let relationIndex = 0; relationIndex < relation.length; relationIndex++) {

        if (relation[relationIndex].virtual) {
            continue
        } else {
            const currentRelation = relation[relationIndex]

            for (let classIndex = 0; classIndex < classes.length; classIndex++) {

                const currentClass = classes[classIndex]
                const name = currentClass.name
                const id = `edgetypes-${(currentClass.id).toString()}`

                const style = {
                    ...nodeStyle,

                };

                // const sourcePosition = {
                //     x: classIndex * nodeWidth * 2,
                //     y: 0 * 300 + 0 * edgeTypes.length * 300,
                // };
                const sourcePosition = {
                    x: 100,
                    y: classIndex * 50,
                };

                if (currentRelation.left_class_id === currentClass.id) {

                    const sourceId = id;
                    const currentId = currentClass.id
                    const sourceData = { label: `${name}` };

                    left = {
                        id: sourceId,
                        currentId,
                        style,
                        data: sourceData,
                        position: sourcePosition,
                        sourcePosition: currSourceTargetPos.source,
                        targetPosition: currSourceTargetPos.target,
                        type: 'ResizableNodeSelected',
                        // type: 'textUpdater'
                        // type: 'buttonedge',
                    };
                }

                if (currentRelation.right_class_id === currentClass.id) {
                    // const targetPosition = {
                    //     x: sourcePosition.x + random(100),
                    //     y: sourcePosition.y + random(50),
                    //     // x: Math.random() * window.innerWidth,
                    //     // y: Math.random() * window.innerHeight,
                    // };

                    const targetId = id;
                    const targetData = { label: `${name}` };
                    const currentId = currentClass.id

                    right = {
                        id: targetId,
                        currentId,
                        style,
                        data: targetData,
                        position: sourcePosition,
                        sourcePosition: currSourceTargetPos.source,
                        targetPosition: currSourceTargetPos.target,
                        type: 'ResizableNodeSelected',

                    };
                }
            }

            if (Object.keys(left).length) {
                nodes.push(left);
            }

            if (Object.keys(right).length) {
                nodes.push(right);
            }

            if (Object.keys(left).length && Object.keys(right).length) {
                edges.push({
                    id: `${left.id}-${right.id}`,
                    currentId: `${left.currentId}-${right.currentId}`,
                    source: left.id,
                    target: right.id,
                    markerEnd: `${currentRelation.relation_type}-${`${left.id}-${right.id}`}`,
                    type: 'floating',
                    style: { background: 'transparent', border: 'none' },
                    updatable: true
                });
            }

            left = {}
            right = {}
        }
    }

    const countObj: any = {}

    edges.map((eg) => {
        const { target } = eg
        const tmp = target.split('-')[1]

        if (countObj[tmp]) {
            countObj[tmp]++
        } else {
            countObj[tmp] = 1
        }
    })

    let newsEdges: any = []

    for (let i = 0; i < edges.length; i++) {
        const tmp = edges[i].target.split('-')[1]

        if (countObj[tmp]) {
            newsEdges.push({ ...edges[i], targetHandle: String(Number(tmp) + i) })
        } else {
            newsEdges.push(edges[i])
        }
    }


    let newNodes = nodes.map((node) => {
        const { id } = node
        const tmpNode = id.split('-')[1]

        if (!!countObj?.[tmpNode] && countObj?.[tmpNode] >= 2) {
            return { ...node, type: 'textUpdater', style: nodeStyle }
        } else {
            return node
        }

    })


    newNodes = newNodes.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.id === value.id
        ))
    ).sort((a, b) => {
        const aTmp = a.id.split('-')[1]
        const bTmp = b.id.split('-')[1]

        return aTmp - bTmp
    })

    newsEdges = newsEdges.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.id === value.id
        ))
    )

    return { nodes: newNodes, edges: newsEdges };
}


function getNodeIntersection(intersectionNode, targetNode) {

    const {
        width: intersectionNodeWidth,
        height: intersectionNodeHeight,
        positionAbsolute: intersectionNodePosition,
    } = intersectionNode;
    const targetPosition = targetNode.positionAbsolute;

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + w;
    const y1 = targetPosition.y + h;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }

    if (px >= nx + n.width - 1) {
        return Position.Right;
    }

    if (py <= ny + 1) {
        return Position.Top;
    }

    if (py >= n.y + n.height - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

export function getEdgeParams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

export function createNodesAndEdges() {
    const nodes = [];
    const edges = [];
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    for (let i = 0; i < 8; i++) {
        const degrees = i * (360 / 8);
        const radians = degrees * (Math.PI / 180);
        const x = 250 * Math.cos(radians) + center.x;
        const y = 250 * Math.sin(radians) + center.y;

        nodes.push({ id: `${i}`, data: { label: 'Source' }, position: { x, y } });

        edges.push({
            id: `edge-${i}`,
            target: 'target',
            source: `${i}`,
            type: 'floating',
            markerEnd: {
                type: MarkerType.Arrow,
            },
        });
    }

    return { nodes, edges };
}

//export PDF
export async function exportFlow(reactFlowInstance: any) {
    reactFlowInstance.fitView();
    function filter(node: { tagName: string; }) {
        return (node.tagName !== 'i');
    }
    const elements = document.getElementsByClassName('react-flow__renderer')[0] as any;

    toSvg(elements, { filter: filter }).then(async (svgContent: any) => {

        const svgElement = await decodeURIComponent(svgContent.replace('data:image/svg+xml;charset=utf-8,', '').trim())

        const newWindow: any = open();

        newWindow.document.write(
            `<html>
            <head>
            <title>Flow.pdf</title>
            <style>
            @page {
                size: A4 landscape !important;
                margin:0 !important;
            }
            @media print {
            * {
            -webkit-print-color-adjust: exact !important;   /* Chrome, Safari */
            color-adjust: exact !important;                 /*Firefox*/
                }
            }
            </style>
            </head>
            <body style="margin:60px 32px 32px 32px ">
                    ${svgElement}
            <script>
            window.print();
            window.close();
            </script>
            </body>
            </html>`
        )
    })
}

export const exportSVG = (flowRef: any) => {
    if (flowRef.current === null) { return }
    toSvg(flowRef.current, {
        filter: node => !(
            node?.classList?.contains('react-flow__minimap') ||
            node?.classList?.contains('react-flow__controls') ||
            node?.classList?.contains('react-flow__panel')
        ),

    }).then(dataUrl => {
        const a = document.createElement('a');

        a.setAttribute('download', 'reactflow.svg');
        a.setAttribute('href', dataUrl);
        a.click();
    });
}