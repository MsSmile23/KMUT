import { FC } from 'react'

export const DefaultLogo: FC<any> = ({ logoImage = '/png/KMUT_logo.png' }) => {
    //TODO:: lazyImport картинки для VITE см ForumLogo
    return <img style={{ maxWidth: '100%' }} src={logoImage} />
}