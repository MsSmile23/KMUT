const ECColorCircle = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 20 20">
            <circle cx="2" cy="10" r="7" fill={color} enableBackground="false" stroke="black" strokeWidth="1" />
        </svg>
    )
}

export default ECColorCircle