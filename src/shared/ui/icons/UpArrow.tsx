/* eslint-disable max-len */
import { CSSProperties } from 'react'


const UpArrow = ({ style, fill }: { style?: CSSProperties, fill?: string }) => {
    return (
        <svg
            height="24px"
            width="24px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15.304 15.304"
            xmlSpace="preserve"
            style={style}
        >
            <g>
                <path
                    style={{ fill: fill ?? 'black', width: 10 }} d="M12.675,5.92L7.954,0.216c0,0-0.387-0.454-0.793-0.047C6.603,0.728,2.587,6.058,2.587,6.058
		S1.874,6.766,2.819,6.766c0.948,0,2.457,0,2.457,0s0,0.411,0,1.04c0,1.939,0,5.714,0,7.16c0,0-0.011,0.338,0.428,0.338
		c0.437,0,3.129,0,3.743,0c0.611,0,0.506-0.404,0.506-0.404c0-1.484,0-5.135,0-7.144c0-0.701,0-1.16,0-1.16s1.883,0,2.66,0
		S12.675,5.92,12.675,5.92z"
                />
            </g>
        </svg>
    )
}

export default UpArrow