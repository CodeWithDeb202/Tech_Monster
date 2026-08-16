import "./Accordion.css";

import { useState } from "react";

import { FaPlus, FaMinus } from "react-icons/fa";

function Accordion({ question, answer }) {

    const [open, setOpen] = useState(false);

    return (

        <div className={`accordion ${open ? "active" : ""}`}>

            <button
                className="accordion-header"
                onClick={() => setOpen(!open)}
            >
                <span>{question}</span>
                {open ? <FaMinus /> : <FaPlus />}
            </button>

            <div className={`accordion-body ${open ? "open" : ""}`}>
                <p>{answer}</p>
            </div>

        </div>

    );

}

export default Accordion;