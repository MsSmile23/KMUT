/* eslint-disable max-len */
import { FC } from 'react';

const renderPosition = (id) => {

    return {
        top: (
            <marker
                id={`composition-${id}`}
                viewBox="0 0 10 21"
                markerHeight={21}
                markerWidth={10}
                refX={5}
                refY={21}

            >
                <path transform="translate(10) rotate(90)" d="M11 1.5L2.30347 5L11 8.5L19.6519 5L11 1.5Z" fill="black" stroke="black" />
            </marker>
        ),
        left: (
            <marker
                id={`composition-${id}`}
                viewBox="0 0 21 10"
                markerHeight={10}
                markerWidth={21}
                refX={22}
                refY={5}
            >
                <path d="M11 1.5L2.30347 5L11 8.5L19.6519 5L11 1.5Z" fill="black" stroke="black" />
            </marker>
        ),
        right: (
            <marker
                id={`composition-${id}`}
                viewBox="0 0 21 10"
                markerHeight={10}
                markerWidth={21}
                refX={1}
                refY={5}
            >
                <path d="M11 1.5L2.30347 5L11 8.5L19.6519 5L11 1.5Z" fill="black" stroke="black" />
            </marker>
        ),
        bottom: (
            <marker
                id={`composition-${id}`}
                viewBox="0 0 10 21"
                markerHeight={21}
                markerWidth={10}
                refX={5}
                refY={0}
            >
                <path transform="translate(10) rotate(90)" d="M11 1.5L2.30347 5L11 8.5L19.6519 5L11 1.5Z" fill="black" stroke="black" />
            </marker>
        )
    }
}

const RhombColor: FC<any> = ({ targetPos, id }) => {

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0 }} fill="transparent">
            <defs>
                {renderPosition(id)[targetPos]}
            </defs>
        </svg>
    )}

export default RhombColor;