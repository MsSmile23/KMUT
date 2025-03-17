/* eslint-disable react/jsx-max-depth */
/* eslint-disable no-console */
import { PACKAGE_AREA } from '@shared/config/entities/package';
import { selectClasses, useClassesStore } from '@shared/stores/classes';
import { useRelationsStore } from '@shared/stores/relations';
import ReactFlow, {
    ControlButton,
    Controls, Handle,
    MiniMap,
    NodeResizer,
    Panel,
    Position,
    useEdgesState,
    useNodesState,
    useReactFlow,
    addEdge
} from 'reactflow'

import ELK from 'elkjs/lib/elk.bundled.js';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { exportSVG, getLayoutedElements, getNodesAndEdges } from './services';
import FloatingConnectionLine from './FloatingConnectionLine';
import { SaveOutlined, DownOutlined } from '@ant-design/icons';
import './style.css';
import { debounce } from 'lodash';
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';
import ResizableNodeSelected from './ResizableNodeSelected';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import FloatingEdge from './FloatingEdges';

enum layoutType {
    DRAG_VERTICAL = 'TB',
    DRAG_HORIZONTAL = 'LR',
    ELKJS_VERTICAL = 'Elkjs_vertical',
    ELKJS_HORIZONTAL = 'Elkjs_horizontal',
    ELKJS_RADIAL = 'Elkjs_radial',
    ELKJS_FORCE = 'Elkjs_force',
    RECOVER_OLD = 'recoverOld',
    RECOVER_FIRST_OPEN = 'recoverFirstOpen',
    DEFAULT = ''
}

const items: MenuProps['items'] = [
    { key: layoutType.RECOVER_OLD, label: 'Восстановить к последнему ручного изменению' },
    { key: layoutType.RECOVER_FIRST_OPEN, label: 'Восстановить на момент открытия схемы' },
    { key: layoutType.DRAG_VERTICAL, label: 'Dagre: Вертикальный' },
    { key: layoutType.DRAG_HORIZONTAL, label: 'Dagre: Горизонтальный' },
    { key: layoutType.ELKJS_VERTICAL, label: 'Elkjs: Вертикльный' },
    { key: layoutType.ELKJS_HORIZONTAL, label: 'Elkjs: Горизонтальный' },
    { key: layoutType.ELKJS_RADIAL, label: 'Elkjs: Радиальный' },
    { key: layoutType.ELKJS_FORCE, label: 'Elkjs: force' }
];

//Асинхронно сохраняем локалстор для использования лоадера
const asyncLocalStorage = {
    setItem(key, value) {
        return Promise.resolve().then(function() {
            localStorage.setItem(key, value);
        });
    }
};

const elk = new ELK();

const useLayoutedElements = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const defaultOptions = {
        'elk.algorithm': 'layered',
        'elk.layered.spacing.nodeNodeBetweenLayers': 100,
        'elk.spacing.nodeNode': 80,
    };

    const getLayoutedElementsNew = useCallback((options) => {
        const layoutOptions = { ...defaultOptions, ...options };
        const graph = {
            id: 'root',
            layoutOptions: layoutOptions,
            children: getNodes(),
            edges: getEdges(),
        };

        //@ts-ignore
        elk.layout(graph).then(({ children }) => {
            // By mutating the children in-place we saves ourselves from creating a
            // needless copy of the nodes array.
            children.forEach((node: any) => {
                node.position = { x: node.x, y: node.y };
            });

            //@ts-ignore
            setNodes(children);
            window.requestAnimationFrame(() => {
                fitView();
            });
        });
    }, []);

    return { getLayoutedElementsNew };
};

const flowKey = 'ML-MAIN-SCHEME';
const flowKeyFirst = 'ML-MAIN-SCHEME-FIRST'
const flowLauoyt = 'ML-MAIN-SCHEME-LAYOUT'
const flowPrevLayout = 'ML-MAIN-SCHEME-PREV-LAYOUT'

const edgeTypes: any = { floating: FloatingEdge }

const ClassRelationsSchemeFloating: FC = () => {

    const classes = useClassesStore(selectClasses).filter((item) => item.package_id === PACKAGE_AREA.SUBJECT)
    const relation = useRelationsStore(s => s.store.data)

    //Получаем готовую разметку схемы
    const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(classes, relation);

    const flowRef = useRef()

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [loadSave, setLoadSave] = useState<boolean>(false)
    const [rfInstance, setRfInstance] = useState(null);
    const [onLocalEmpty, setOnLocalEmpty] = useState<boolean>(false)


    const { fitView, setViewport } = useReactFlow();
    const { getLayoutedElementsNew } = useLayoutedElements();

    // const onConnect = useCallback(
    //     (params) =>
    //         setEdges((eds) =>
    //             addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
    //         ),
    //     [setEdges]
    // );

    const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

    const onLayoutHorizontalVertical = useCallback(
        (direction) => {
            const layouted = getLayoutedElements(nodes, edges, { direction });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });

        }, [nodes, edges]);

    //Восстановить на открытие схемы
    const recoverGetSave = useCallback(() => {
        const flowFirst = JSON.parse(localStorage.getItem(flowKeyFirst));

        if (flowFirst) {
            const { x = 0, y = 0, zoom = 1 } = flowFirst.viewport;

            setNodes(flowFirst.nodes || []);
            setEdges(flowFirst.edges || []);
            setViewport({ x, y, zoom });
            setOnLocalEmpty(true)
        }
    }, [setNodes, setViewport, setEdges, setOnLocalEmpty])

    //Восстановление последнего изменения
    const recoverGetSavePrev = useCallback(() => {
        const flowPrev = JSON.parse(localStorage.getItem(flowPrevLayout));

        if (flowPrev) {
            const { x = 0, y = 0, zoom = 1 } = flowPrev.viewport;

            setNodes(flowPrev.nodes || []);
            setEdges(flowPrev.edges || []);
            setViewport({ x, y, zoom });
            setOnLocalEmpty(true)
        }
    }, [setNodes, setViewport, setEdges, setOnLocalEmpty])

    //Получаем данные селекта
    const handleChangeLayout = useCallback((value: layoutType) => {
        asyncLocalStorage.setItem(flowLauoyt, JSON.stringify(value))
        switch (value) {
            case layoutType.DRAG_VERTICAL:
                onLayoutHorizontalVertical('TB')
                break
            case layoutType.DRAG_HORIZONTAL:
                onLayoutHorizontalVertical('LR')
                break
            case layoutType.ELKJS_VERTICAL:
                getLayoutedElementsNew({ 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' })
                break
            case layoutType.ELKJS_HORIZONTAL:
                getLayoutedElementsNew({ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' })
                break
            case layoutType.ELKJS_RADIAL:
                getLayoutedElementsNew({ 'elk.algorithm': 'org.eclipse.elk.radial' })
                break
            case layoutType.ELKJS_FORCE:
                getLayoutedElementsNew({ 'elk.algorithm': 'org.eclipse.elk.force' })
                break
            case layoutType.RECOVER_OLD:
                recoverGetSavePrev()
                break
            case layoutType.RECOVER_FIRST_OPEN:
                recoverGetSave()
                break
        }
    }, [onLayoutHorizontalVertical, getLayoutedElementsNew, recoverGetSavePrev, recoverGetSave])

    //Сохраняем схему локально
    const onSave = useCallback((flow: any) => {
        setLoadSave(true)
        asyncLocalStorage.setItem(flowKey, JSON.stringify(flow))
            .then(() => {
                setTimeout(() => setLoadSave(false), 500)
            })
    }, [])

    //Получаем сохраненные данные
    const onRestore = useCallback(() => {
        const restoreFlow = () => {
            try {
                const flow = JSON.parse(localStorage.getItem(flowKey));
                // const layout = JSON.parse(localStorage.getItem(flowLauoyt));
                // if (layout) {
                //     setSelectChoice(layout)
                // } else {
                //     setSelectChoice(layoutType.DRAG_VERTICAL)
                // }

                if (flow) {
                    asyncLocalStorage.setItem(flowKeyFirst, JSON.stringify(flow))
                    const { x = 0, y = 0, zoom = 1 } = flow.viewport;

                    setNodes(flow.nodes || []);
                    setEdges(flow.edges || []);
                    setViewport({ x, y, zoom });
                    setOnLocalEmpty(true)
                } else {
                    setOnLocalEmpty(false)
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('ошибка получения локальных данных схемы')
            }
        };

        restoreFlow();
    }, [setNodes, setViewport, handleChangeLayout, setOnLocalEmpty]);

    //debounce на перемещение схемы
    const dynamicSaveNode = useCallback(debounce(onSave, 1000), [])

    useEffect(() => {
        if (!onLocalEmpty && nodes.length) {
            handleChangeLayout(layoutType.DRAG_VERTICAL)
            setOnLocalEmpty(true)
        }
    }, [onLocalEmpty, nodes, rfInstance])

    useEffect(() => {
        if (rfInstance) {
            try {
                const flow = rfInstance.toObject();
                const flowFirst = JSON.parse(localStorage.getItem(flowKeyFirst));

                const getFlowkey = JSON.parse(localStorage.getItem(flowKey));

                if (getFlowkey) {
                    asyncLocalStorage.setItem(flowPrevLayout, JSON.stringify(getFlowkey))
                }

                if (!flowFirst) {
                    asyncLocalStorage.setItem(flowKeyFirst, JSON.stringify(flow))
                }
                dynamicSaveNode(flow)
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('ошибка получения локальных данных')
            }
        }
    }, [nodes, rfInstance])

    useEffect(() => {
        onRestore()
    }, [])

    //Формируем кастомные ячейки с 3 и более точками
    const UpdaterNode = useCallback(({ id, data, selected }) => {
        const newId: string = id.split('-')[1]
        const length: number = edges.filter((item) => !!item?.targetHandle
            && newId === item.target.split('-')[1]).length

        return (
            <>
                <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
                <div style={{ textAlign: 'center' }} className="text-update-label">
                    {data.label}
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    style={{ background: 'transparent', border: 'none', }}
                    // onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={true}

                />
                {
                    edges.filter((item) => !!item?.targetHandle
                        && newId === item.target.split('-')[1]).map((item, index) => {
                        return (
                            <Handle
                                key={item.id}
                                type="target"
                                position={Position.Left}
                                id={String(item?.targetHandle)}
                                style={{
                                    top: length > 3
                                        ? index * 10 + 5
                                        : index * 15 + 5, background: 'transparent', border: 'none'
                                }}
                                isConnectable={true}
                            />
                        )
                    })
                }
            </>
        );
    }, [edges])

    const nodeTypes = useMemo(() => ({
        textUpdater: UpdaterNode,
        ResizableNodeSelected,
    }), []);

    const menuProps = useMemo(() => {
        return {
            items,
            onClick: (e: { key: layoutType; }) => handleChangeLayout(e.key),
        }
    }, [handleChangeLayout])

    return (
        <>
            {loadSave && (<CustomPreloader size="default" style={{ position: 'absolute', left: 10, top: 10 }} />)}

            <ReactFlow
                ref={flowRef}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                onInit={setRfInstance}
                connectionLineComponent={FloatingConnectionLine}
                className="react-flow-node-resizer-example"
            >
                <MiniMap />
                <Panel position="top-right">
                    {/* @ts-ignore */}
                    <Dropdown menu={menuProps}>
                        <Button>
                            <Space>
                                Выберите действие
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Panel>
                <Controls>
                    <ControlButton
                        onClick={() => {
                            exportSVG(flowRef)
                        }}
                    >
                        <SaveOutlined style={{ width: 16, height: 16 }} />
                    </ControlButton>
                </Controls>
            </ReactFlow>
        </>
    )
}

export default ClassRelationsSchemeFloating