import { HashLoader } from "react-spinners";
import "./Hash.css";

export default function Hash({
    message = "",
    size = 60,
    fullScreen = false
}) {
    return (
        <div
            className={`app-loader ${fullScreen ? "app-loader-fullscreen" : ""}`}
        >
            <HashLoader
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