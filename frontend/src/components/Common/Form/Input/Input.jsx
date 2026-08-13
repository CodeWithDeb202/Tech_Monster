import "./Input.css";

function Input({
    label,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
    error,
    required,
    maxLength,
    ...props
}) {
    

    return (

        <div id="input-group">
            {label && (
                <label id="input-label" htmlFor={name}>
                    {label}
                    <span id={value?.trim() ? 'labelSpanGreen' : 'labelSpanRed'}>{required && "*"}</span>
                </label>
            )}

            <div id="input-wrapper">

                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={error ? "inputError" : ""}
                    maxLength={maxLength}
                    {...props}
                />
            </div>

            {error && <small id="errorText">{error} </small> }
        </div>
    );
}

export default Input;