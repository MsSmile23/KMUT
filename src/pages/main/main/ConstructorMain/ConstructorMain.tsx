import ClassRelationsSchemeFloating from '@entities/classes/ClassRelationsSchemeFloating/ClassRelationsSchemeFloating';
import { ReactFlowProvider } from 'reactflow';

export const ConstructorMain = () => {
    return (
        // <div style={{ padding: 24, textAlign: 'center', height: '100vh', backgroundColor: '#dfe3eb' }}>
        <div style={{ flex: 1 }}>
            <div style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
                <ReactFlowProvider>

                    <ClassRelationsSchemeFloating />
                </ReactFlowProvider>
            </div>
            {/* <p>long content</p>
            {
                // indicates very long content
                Array.from({ length: 100 }, (_, index) => (
                    <React.Fragment key={index}>
                        {index % 20 === 0 && index ? 'more' : '...'}
                        <br />
                    </React.Fragment>
                ))
            } */}
        </div>
    )
}