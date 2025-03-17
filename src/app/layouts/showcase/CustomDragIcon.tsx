import { FC } from 'react'

/* eslint-disable max-len */
export const CustomDragIcon: FC<{ 
    styles: React.CSSProperties 
}> = ({ styles }) => {
    return (
        <svg 
            width={`${styles.width}` ?? '50'} 
            height={`${styles.height}` ?? '50'} 
            viewBox="0 0 50 50" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs />
            <circle id="Эллипс 13" cx="25.000000" cy="25.000000" r="13.000000" fill={styles.backgroundColor} fillOpacity="1.000000" />
            <path id="Эллипс 14" d="M10.66 4.52C15.15 1.37 20.33 -0.09 25.43 0C30.92 0.09 35.96 1.96 40.04 5.03L37.28 8.68C33.7 5.99 29.52 4.65 25.35 4.58C20.87 4.5 16.7 5.87 13.28 8.27L10.66 4.52Z" fill={styles.backgroundColor} fillOpacity="1.000000" fillRule="evenodd" />
            <path id="Эллипс 15" d="M4.52 39.33C1.37 34.84 -0.09 29.66 0 24.56C0.09 19.07 1.96 14.03 5.03 9.95L8.68 12.71C5.99 16.29 4.65 20.47 4.58 24.64C4.5 29.12 5.87 33.3 8.27 36.71L4.52 39.33Z" fill={styles.backgroundColor} fillOpacity="1.000000" fillRule="evenodd" />
            <path id="Эллипс 16" d="M39.33 45.47C34.84 48.62 29.66 50.08 24.56 49.99C19.07 49.9 14.03 48.03 9.95 44.96L12.71 41.31C16.29 44 20.47 45.34 24.64 45.41C29.12 45.49 33.29 44.12 36.71 41.73L39.33 45.47Z" fill={styles.backgroundColor} fillOpacity="1.000000" fillRule="evenodd" />
            <path id="Эллипс 17" d="M45.17 10.24C48.41 14.67 49.98 19.81 49.99 24.92C50.01 30.4 48.25 35.49 45.27 39.62L41.56 36.95C44.18 33.31 45.43 29.1 45.41 24.93C45.4 20.45 43.94 16.3 41.48 12.94L45.17 10.24Z" fill={styles.backgroundColor} fillOpacity="1.000000" fillRule="evenodd" />
        </svg>
    )
}