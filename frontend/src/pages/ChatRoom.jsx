import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { IoClose, IoSend, IoChatbubbleEllipses } from "react-icons/io5";

const ChatRoom = ({ chatRoomId, onClose, onOpen }) => {
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [senderId, setSenderId] = useState(null);
    const messageEndRef = useRef(null);
    const stompClientRef = useRef(null);
    const hasOpenedRef = useRef(false);

    const formatChatTime = (timestampStr) => {
        const date = new Date(timestampStr);
        const now = new Date();

        const isSameDay =
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate();

        const twoDigit = (n) => n.toString().padStart(2, '0');
        const hours = twoDigit(date.getHours());
        const minutes = twoDigit(date.getMinutes());

        if (isSameDay) {
            return `${hours}:${minutes}`;
        } else {
            return `${twoDigit(date.getMonth() + 1)}.${twoDigit(date.getDate())} ${hours}:${minutes}`;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            onClose();
            return;
        }

        let isMounted = true;

        const fetchDataAndConnect = async () => {
            try {
                const [roomRes, msgRes, userRes] = await Promise.all([
                    fetch(`/api/chat/rooms/${chatRoomId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`/api/chat/rooms/${chatRoomId}/messages?limit=300`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`/api/users/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (!roomRes.ok || !msgRes.ok || !userRes.ok) {
                    alert("채팅방 데이터를 불러오는 데 실패했습니다.");
                    onClose();
                    return;
                }

                const [roomData, msgData, userData] = await Promise.all([
                    roomRes.json(),
                    msgRes.json(),
                    userRes.json()
                ]);

                if (!isMounted) return;

                setChatRoom(roomData);
                setMessages(msgData.reverse());
                setSenderId(userData.id);

                //중복 연결 방지 코드
                if (!stompClientRef.current?.connected) {
                    connectWebSocket(token);
                }
            } catch (error) {
                console.error("채팅방 로딩 오류:", error);
                onClose();
            }
        };

        fetchDataAndConnect();

        return () => {
            isMounted = false;
            if (stompClientRef.current?.deactivate) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            hasOpenedRef.current = false;
        };
    }, [chatRoomId]);

    useEffect(() => {
        if (onOpen && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            onOpen();
        }
    }, [onOpen]);

    const connectWebSocket = (token) => {
        const socket = new SockJS(`/ws/chat?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 0, //자동 재연결 방지
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
            },
            onWebSocketClose: () => {
                console.warn("웹소켓 닫힘 감지");
            }
        });

        stompClientRef.current = client;
        client.activate();
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
                body: JSON.stringify({ chatRoomId })
            });
        } catch (error) {
            console.error("채팅방 닫기 시 마지막 읽은 시점 저장 실패:", error);
        }

        if (onClose) onClose();
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="w-[400px] h-[600px] bg-black text-white rounded-2xl shadow-lg flex flex-col border-2 border-gray-700 overflow-hidden relative">
                {/* 상단 바 */}
                <div className="flex justify-between items-center bg-gray-900 px-4 py-2">
                    <div className="flex items-center gap-2 text-base font-bold text-white">
                        <IoChatbubbleEllipses size={18} />
                        {chatRoom?.chatRoomName || "채팅방"}
                    </div>

                    <button
                        onClick={handleCloseChatRoom}
                        className="text-black transition p-1"
                        aria-label="닫기"
                    >
                        <IoClose size={18} />
                    </button>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-2 chat-scrollbar">
                    {messages.map((msg, i) => {
                        const isMine = msg.senderId === senderId;
                        const timeText = formatChatTime(msg.sendAt);

                        return (
                            <div key={i} className={`mb-1 flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div className={`flex ${isMine ? "flex-row-reverse" : "flex-row"} items-end max-w-[75%]`}>
                                    {/* 메시지 */}
                                    <div
                                        className={`px-3 py-2 rounded-lg break-words text-sm max-w-full 
                                        ${isMine ? "bg-green-400 text-black ml-1" : "bg-gray-300 text-black mr-1"}`}
                                    >
                                        {!isMine && (
                                            <div className="font-bold text-xs mb-1">{msg.senderName}</div>
                                        )}
                                        <div>{msg.message}</div>
                                    </div>

                                    {/* 시간 */}
                                    <div className="text-[10px] text-white mb-0.5">{timeText}</div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messageEndRef} />
                </div>

                {/* 입력창 */}
                <div className="flex items-center bg-gray-800 px-3 py-2 border-t border-gray-700">
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
                        className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition"
                        aria-label="전송"
                    >
                        <IoSend size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
