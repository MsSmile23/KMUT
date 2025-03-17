/* eslint-disable max-len */
import { FC } from 'react';

const renderPosition = (id) => {
    return {
        top: (
            <marker
                id={`generalization-${id}`}
                viewBox="0 0 24 24"
                markerHeight={20}
                markerWidth={20}
                refX={16}
                refY={11}
            >
                <path
                    fill="#FFF"
                    stroke="#000"
                    transform="translate(27 18) rotate(180)"
                    d="M12.2048 7.29258L18.1189 15.7412C18.49 16.2715 18.1107 17 17.4635 17L6.53652 17C5.88931 17 5.50998 16.2715 5.88114 15.7412L11.7952 7.29258C11.8947 7.1504 12.1053 7.1504 12.2048 7.29258Z"
                />
            </marker>
        ),
        left: (
            <marker
                id={`generalization-${id}`}
                viewBox="0 0 24 24"
                markerHeight={20}
                markerWidth={20}
                refX={15}
                refY={12}
            >
                <path
                    fill="#FFF"
                    stroke="#000"
                    transform="translate(22 0) rotate(90)"
                    d="M12.2048 7.29258L18.1189 15.7412C18.49 16.2715 18.1107 17 17.4635 17L6.53652 17C5.88931 17 5.50998 16.2715 5.88114 15.7412L11.7952 7.29258C11.8947 7.1504 12.1053 7.1504 12.2048 7.29258Z"
                />
            </marker>
        ),
        right: (
            <marker
                id={`generalization-${id}`}
                viewBox="0 0 24 24"
                markerHeight={20}
                markerWidth={20}
                refX={10}
                refY={9}
            >
                <path
                    fill="#FFF"
                    stroke="#000"
                    transform="translate(3 20) rotate(-90)"
                    d="M12.2048 7.29258L18.1189 15.7412C18.49 16.2715 18.1107 17 17.4635 17L6.53652 17C5.88931 17 5.50998 16.2715 5.88114 15.7412L11.7952 7.29258C11.8947 7.1504 12.1053 7.1504 12.2048 7.29258Z"
                />
            </marker>
        ),
        bottom: (
            <marker
                id={`generalization-${id}`}
                viewBox="0 0 24 24"
                markerHeight={20}
                markerWidth={20}
                refX={12}
                refY={7}
            >
                <path
                    fill="#FFF"
                    stroke="#000"
                    d="M12.2048 7.29258L18.1189 15.7412C18.49 16.2715 18.1107 17 17.4635 17L6.53652 17C5.88931 17 5.50998 16.2715 5.88114 15.7412L11.7952 7.29258C11.8947 7.1504 12.1053 7.1504 12.2048 7.29258Z"
                />
            </marker>
        )
    }
}

const ArrowRightEmpty: FC<any> = ({ targetPos, id }) => (
    // <svg style={{ position: 'absolute', top: 0, left: 0 }} fill="transparent">
    //     <defs>
    //         {renderPosition(id)[targetPos]}
    //     </defs>
    // </svg>
    <svg
        style={{ position: 'absolute', top: 0, left: 0 }}
    >
        <defs>
            {renderPosition(id)[targetPos]}
        </defs>
    </svg>
);

export default ArrowRightEmpty;