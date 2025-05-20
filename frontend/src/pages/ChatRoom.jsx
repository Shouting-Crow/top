import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatRoom = ({ chatRoomId, onClose, onOpen }) => {
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [senderId, setSenderId] = useState(null);
    const messageEndRef = useRef(null);
    const stompClientRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            onClose();
            return;
        }

        // 채팅방 불러오기
        const fetchChatRoom = async () => {
            const res = await fetch(`/api/chat/rooms/${chatRoomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setChatRoom(data);
            } else {
                alert("채팅방 정보를 불러올 수 없습니다.");
                onClose();
            }
        };

        // 기존 메시지 불러오기
        const fetchMessages = async () => {
            const res = await fetch(`/api/chat/rooms/${chatRoomId}/messages?limit=300`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.reverse());
            }
        };

        // 내 ID 불러오기
        const fetchUserId = async () => {
            const res = await fetch(`/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSenderId(data.id);
            }
        };

        fetchChatRoom();
        fetchMessages();
        fetchUserId();
        connectWebSocket(token);

        const escHandler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", escHandler);

        return () => {
            if (stompClientRef.current?.deactivate) {
                stompClientRef.current.deactivate();
            }
            window.removeEventListener("keydown", escHandler);
        };
    }, [chatRoomId]);

    //refreshChatRoomsStates 실행을 위한 열린 시점 제공
    useEffect(() => {
        if (onOpen) {
            onOpen();
        }
    }, [onOpen]);

    const connectWebSocket = (token) => {
        const socket = new SockJS(`/ws/chat?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                client.subscribe(`/topic/chat/${chatRoomId}`, (msg) => {
                    const newMsg = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, newMsg]);
                });

                client.subscribe(`/user/queue/kick`, (message) => {
                    alert(message.body);
                    if (onClose) onClose();
                });
            },
            onStompError: (err) => {
                console.error("웹 소켓 연결 에러:", err);
            }
        });
        client.activate();
        stompClientRef.current = client;
    };

    const handleSend = () => {
        const token = localStorage.getItem("jwtToken");
        if (!inputMessage.trim()) return;
        if (!stompClientRef.current?.connected) return;

        const chatMessage = {
            chatRoomId: Number(chatRoomId),
            senderId: senderId,
            message: inputMessage.trim()
        };

        stompClientRef.current.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(chatMessage)
        });
        setInputMessage("");
    };

    const handleCloseChatRoom = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            await fetch("/api/chat/read-log", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({chatRoomId})
            });
        } catch (error) {
            console.error("채팅방 닫기 시 마지막 읽은 시점 저장 실패 : ", error);
        }

        if (onClose) onClose();
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="w-[400px] h-[600px] bg-black text-white rounded-2xl shadow-lg flex flex-col p-4 relative">
                <div className="flex justify-between items-center mb-2">
                    <div className="bg-blue-500 px-3 py-2 font-bold rounded-md">
                        💬 {chatRoom?.chatRoomName || "채팅방"}
                    </div>
                    <button
                        onClick={handleCloseChatRoom}
                        className="w-8 h-8 flex items-center justify-center text-black text-lg font-bold rounded-full hover:bg-gray-300 transition"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {messages.map((msg, i) => {
                        const isMine = msg.senderId === senderId;
                        return (
                            <div key={i} className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-[70%] break-words text-sm ${isMine ? "bg-green-400 text-black" : "bg-gray-300 text-black"}`}>
                                    {!isMine && (
                                        <div className="font-bold text-xs mb-1">{msg.senderName}</div>
                                    )}
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messageEndRef} />
                </div>

                <div className="flex p-2 border-t border-gray-700">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1 px-3 py-2 rounded text-black"
                        placeholder="메시지를 입력하세요..."
                    />
                    <button
                        onClick={handleSend}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
