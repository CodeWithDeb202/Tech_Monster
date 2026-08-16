import "./Skeleton.css";

const Skeleton = ({
    width = "100%",
    height = "20px",
    borderRadius = "8px",
    className = "",
}) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
            }}
            aria-hidden="true"
        />
    );
};

export default Skeleton;