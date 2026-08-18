import { useEffect, useState } from "react";

import {
    getChatUsers,
    // getMessages,
    sendMessage,
    uploadChatFile,
    markAsSeen,
    deleteForMe,
    deleteForEveryone,
    searchMessages,
    getSharedFiles,
    getMessagesPage
} from "../../../services/api/message.service";

import { socket } from "../../../services/socket/socket";

import ChatSidebar from "../../dashboard/common/Message/ChatSidebar";
import ChatWindow from "../../dashboard/common/Message/ChatWindow";
import ChatInput from "../../dashboard/common/Message/ChatInput";

import "./Message.css";

export default function Message() {

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);

    const [text, setText] = useState("");

    const [typing, setTyping] = useState(false);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);

    const [replyMessage, setReplyMessage] = useState(null);
    const [search, setSearch] = useState("");
    const [sharedFiles, setSharedFiles] = useState([]);

    const [showMedia, setShowMedia] = useState(false);
    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);

    // ===============================
    // Load Current User
    // ===============================

    useEffect(() => {

        const user = JSON.parse(

            localStorage.getItem("user")

        );

        if (user) {

            queueMicrotask(() => {
                setCurrentUser(user);
            });

        }

    }, []);



    // ===============================
    // Socket Connect
    // ===============================

    useEffect(() => {

        if (!currentUser) return;

        socket.connect();

        socket.emit(

            "join",

            currentUser._id

        );

        socket.on(

            "onlineUsers",

            (users) => {

                setOnlineUsers(users);

            }

        );

        socket.on(

            "typing",

            () => {

                setTyping(true);

            }

        );

        socket.on(

            "stopTyping",

            () => {

                setTyping(false);

            }

        );

        socket.on(

            "receiveMessage",

            (message) => {

                if (

                    selectedUser &&

                    message.sender._id === selectedUser._id

                ) {

                    setMessages(prev => [

                        ...prev,

                        message

                    ]);

                }

            }

        );

        socket.on(

            "messagesSeen",

            () => {

                setMessages(prev =>

                    prev.map(msg => ({

                        ...msg,

                        seen: true

                    }))

                );

            }

        );

        socket.on(

            "messageDeleted",

            ({ messageId }) => {

                setMessages(prev =>

                    prev.map(msg =>

                        msg._id === messageId

                            ? {

                                ...msg,

                                isDeleted: true,

                                message: "",

                                file: ""

                            }

                            : msg

                    )

                );

            }

        );

        return () => {

            socket.off("onlineUsers");

            socket.off("typing");

            socket.off("stopTyping");

            socket.off("receiveMessage");

            socket.off("messagesSeen");

            socket.off("messageDeleted");

            socket.disconnect();

        };

    }, [currentUser, selectedUser]);

    // ===============================
    // Load Chat Users
    // ===============================

    const loadUsers = async () => {

        try {

            const res = await getChatUsers();

            setUsers(res.users || []);

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        queueMicrotask(() => {
            loadUsers();
        });

    }, []);

    // ===============================
    // Open Chat
    // ===============================

    const openChat = async (user) => {

        setSelectedUser(user);

        try {

            setPage(1);

            const res = await getMessagesPage(

                user._id,

                1

            );

            setMessages(res.messages);

            setHasMore(res.hasMore);

            await markAsSeen(

                user._id

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleSearch = async (value) => {

        setSearch(value);

        if (!selectedUser) return;

        if (!value.trim()) {

            openChat(selectedUser);

            return;

        }

        try {

            const res = await searchMessages(

                selectedUser._id,

                value

            );

            setMessages(

                res.messages

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    // ===============================
    // Send Text Message
    // ===============================

    const handleSend = async () => {

        if (

            !text.trim()

        ) return;

        try {

            const res = await sendMessage({

                receiver: selectedUser._id,

                message: text,

                replyTo: replyMessage?._id

            });

            setMessages(prev => [

                ...prev,

                res.data

            ]);

            setText("");

            setReplyMessage(null);

            socket.emit(

                "stopTyping",

                {

                    receiver:

                        selectedUser._id

                }

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    // ===============================
    // Upload File
    // ===============================

    const handleFile = async (file) => {

        const formData = new FormData();

        formData.append(

            "file",

            file

        );

        try {

            const upload = await uploadChatFile(

                formData

            );

            const res = await sendMessage({

                receiver: selectedUser._id,

                file: upload.fileUrl

            });

            setMessages(prev => [

                ...prev,

                res.data

            ]);

        }

        catch (err) {

            console.log(err);

        }

    };

    // ===============================
    // Typing
    // ===============================

    const handleTyping = (value) => {

        setText(value);

        socket.emit(

            "typing",

            {

                receiver:

                    selectedUser?._id

            }

        );

    };

    const handleDeleteForMe = async (id) => {

        try {

            await deleteForMe(id);

            setMessages(prev =>

                prev.filter(

                    msg =>

                        msg._id !== id

                )

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDeleteForEveryone = async (id) => {

        try {

            await deleteForEveryone(id);

            setMessages(prev =>

                prev.map(msg =>

                    msg._id === id

                        ? {

                            ...msg,

                            isDeleted: true,

                            message: "",

                            file: ""

                        }

                        : msg

                )

            );

        }

        catch (err) {

            console.log(err);

        }

    };


    const loadSharedFiles = async () => {

        if (!selectedUser) return;

        try {

            const res = await getSharedFiles(

                selectedUser._id

            );

            setSharedFiles(

                res.files

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadOlderMessages = async () => {

        if (

            !selectedUser ||

            !hasMore ||

            loadingMore

        ) return;

        try {

            setLoadingMore(true);

            const next = page + 1;

            const res = await getMessagesPage(

                selectedUser._id,

                next

            );

            setMessages(prev => [

                ...res.messages,

                ...prev

            ]);

            setPage(next);

            setHasMore(

                res.hasMore

            );

        }

        finally {

            setLoadingMore(false);

        }

    };



    return (

        <div className="chatContainer">

            <ChatSidebar

                users={users}

                selectedUser={selectedUser}

                openChat={openChat}

                onlineUsers={onlineUsers}

            />

            <div className="chatRight">

                <ChatWindow

                    currentUser={currentUser}

                    selectedUser={selectedUser}

                    messages={messages}

                    typing={typing}

                    onlineUsers={onlineUsers}

                    setReplyMessage={setReplyMessage}

                    handleDeleteForMe={handleDeleteForMe}

                    handleDeleteForEveryone={handleDeleteForEveryone}

                    search={search}

                    handleSearch={handleSearch}
                    loadSharedFiles={loadSharedFiles}
                    showMedia={showMedia}
                    setShowMedia={setShowMedia}
                    sharedFiles={sharedFiles}
                    loadOlderMessages={loadOlderMessages}
                    loadingMore={loadingMore}

                />

                {

                    replyMessage && (

                        <div className="replyPreview">

                            <div>

                                <strong>

                                    {

                                        replyMessage.sender.firstName

                                    }

                                </strong>

                            </div>

                            <p>

                                {

                                    replyMessage.message

                                }

                            </p>

                            <button

                                onClick={() =>

                                    setReplyMessage(null)

                                }

                            >

                                ✕

                            </button>

                        </div>

                    )

                }

                {
                    showMedia && (

                        <div className="mediaModal">

                            <div className="mediaHeader">

                                <h3>

                                    Shared Media

                                </h3>

                                <button

                                    onClick={() =>

                                        setShowMedia(false)

                                    }

                                >

                                    ✕

                                </button>

                            </div>

                            <div className="mediaGrid">

                                {

                                    sharedFiles.map(file => {

                                        const image =

                                            file.file.endsWith(".jpg") ||

                                            file.file.endsWith(".jpeg") ||

                                            file.file.endsWith(".png") ||

                                            file.file.endsWith(".webp");

                                        return image ?

                                            (

                                                <img

                                                    key={file._id}

                                                    src={file.file}

                                                    alt="media"

                                                />

                                            )

                                            :

                                            (

                                                <a

                                                    key={file._id}

                                                    href={file.file}

                                                    target="_blank"

                                                    rel="noreferrer"

                                                >

                                                    📎 File

                                                </a>

                                            );

                                    })

                                }

                            </div>

                        </div>

                    )
                }

                {

                    selectedUser &&

                    <ChatInput

                        text={text}

                        setText={handleTyping}

                        handleSend={handleSend}

                        handleFile={handleFile}

                    />

                }

            </div>

        </div>

    );

}
