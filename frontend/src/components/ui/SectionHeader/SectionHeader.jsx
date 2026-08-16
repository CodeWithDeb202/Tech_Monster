import "./SectionHeader.css";

function SectionHeader({
    badge,
    title,
    description
}) {

    return (

        <div id="section-header">

            <span>{badge}</span>

            <h2>{title}</h2>

            <p>{description}</p>

        </div>

    )

}

export default SectionHeader;