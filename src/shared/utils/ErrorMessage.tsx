

const ErrorMessage = (errors) => {
    return (
        <>
            {errors?.map((error, idx) => (
                <span key={idx}>
                    <span>{error}</span>
                    <br key={idx + '-'} />
                </span>
            ))}
        </>
    )
}

export default ErrorMessage