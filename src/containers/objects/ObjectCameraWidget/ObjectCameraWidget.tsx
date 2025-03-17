import { IObject } from '@shared/types/objects';
import { FC } from 'react';
import ReactPlayer from 'react-player';

const ObjectCameraWidget: FC<{object?: IObject, url?: string}> = ({ /* object, */ url }) => {
    return (
        <ReactPlayer controls url={url} />
    );
};

export default ObjectCameraWidget;