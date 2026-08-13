import { CircleLoader } from "react-spinners";
import "./Spinner.css";

export default function Spinner({
    message = "",
    size = 60,
    fullScreen = false
}) {
    return (
        <div
            className={`app-loader ${fullScreen ? "app-loader-fullscreen" : ""}`}
        >
            <CircleLoader
                size={size}
                color="#2563eb"
                speedMultiplier={1.2}
            />

            {message && (
                <p className="app-loader-message">
                    {message}
                </p>
            )}
        </div>
    );
}