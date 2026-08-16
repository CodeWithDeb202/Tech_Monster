import "./Spinner.css";

export default function Spinner({
    message = "",
    size = 60,
}) {
    return (
        <div
            className="custom-loader"
        >
            <div
                className="loader-circle"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }}
            >
            </div>

            {message && (
                <p className="loader-message">
                    {message}
                </p>
            )}
        </div>
    );
}