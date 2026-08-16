import "./Card.css";

function Card({
    children,
    hover = true,
    className = ""
}) {

    return (

        <div className={`card ${hover ? "card-hover" : ""} ${className}`} >
            {children}

        </div>

    )

}

export default Card;