import "./MessageBubble.css";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

export default function MessageBubble({

    message,

    currentUser,
    onDeleteForMe,

    onDeleteForEveryone,
    onReply

}) {

    const isMine =

        message.sender?._id === currentUser?._id ||

        message.sender === currentUser?._id;

    const isImage =

        message.file &&
        (
            message.file.endsWith(".jpg") ||
            message.file.endsWith(".jpeg") ||
            message.file.endsWith(".png") ||
            message.file.endsWith(".webp")
        );

    const [showMenu, setShowMenu] = useState(false);

    return (

        <div

            className={

                `messageRow ${isMine ? "mine" : "other"}`

            }

        >

            <div className="messageBubble">

                {

                    isMine && !message.isDeleted && (

                        <button

                            className="msgMenuBtn"

                            onClick={() =>

                                setShowMenu(!showMenu)

                            }

                        >

                            <HiDotsVertical />

                        </button>

                    )

                }

                {

                    showMenu && (

                        <div className="msgMenu">

                            <button
                                onClick={() => {
                                    onReply(message);
                                    setShowMenu(false);
                                }}
                            >
                                Reply
                            </button>

                            <button
                                onClick={() => {
                                    onDeleteForMe(message._id);
                                    setShowMenu(false);
                                }}
                            >
                                Delete for Me
                            </button>

                            {
                                isMine &&
                                <button
                                    onClick={() => {
                                        onDeleteForEveryone(message._id);
                                        setShowMenu(false);
                                    }}
                                >
                                    Delete for Everyone
                                </button>
                            }

                        </div>

                    )

                }

                {
                    message.isDeleted ? (

                        <p className="deletedMessage">

                            🚫 This message was deleted

                        </p>

                    ) : (

                        <>

                            {/* Reply Preview */}
                            {

                                message.replyTo && (

                                    <div className="replyBox">

                                        <strong>

                                            {message.replyTo.sender?.firstName}

                                        </strong>

                                        <p>

                                            {

                                                message.replyTo.message ||

                                                "📎 Attachment"

                                            }

                                        </p>

                                    </div>

                                )

                            }

                            {/* Current Message */}

                            {

                                message.message && (

                                    <p>

                                        {message.message}

                                    </p>

                                )

                            }

                            {

                                message.file && (

                                    isImage ? (

                                        <img
                                            src={message.file}
                                            alt="chat"
                                            className="chatImage"
                                        />

                                    ) : (

                                        <a
                                            href={message.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="chatFile"
                                        >

                                            📎 Download Attachment

                                        </a>

                                    )

                                )

                            }

                        </>

                    )

                }

                <div className="messageFooter">

                    <small>

                        {

                            new Date(

                                message.createdAt

                            ).toLocaleTimeString(

                                [],

                                {

                                    hour: "2-digit",

                                    minute: "2-digit"

                                }

                            )

                        }

                    </small>

                    {

                        isMine && (

                            <span

                                className={

                                    message.seen

                                        ? "seen"

                                        : message.delivered

                                            ? "delivered"

                                            : "sent"

                                }

                            >

                                {

                                    message.seen

                                        ? "✓✓"

                                        : message.delivered

                                            ? "✓✓"

                                            : "✓"

                                }

                            </span>

                        )

                    }

                </div>

            </div>

        </div>

    );

}