import "./Button.css";

function Button({
    children,
    icon,
    variant = "primary",
    type = "button",
    onClick,
    disabled = false,
    fullWidth = false
}) {

    return (

        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} ${fullWidth ? "full-width" : ""}`}
        >

            <span>{children}</span>

            {icon}
            
        </button>

    )

}

export default Button;