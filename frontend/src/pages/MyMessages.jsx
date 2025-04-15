import {useEffect, useState, useContext, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import ReplyModal from "../components/ReplyModal";
import "../index.css";
import MessageContext from "../context/MessageContext.js";

const MyMessages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyRecipient, setReplyRecipient] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [receiverName, setReceiverName] = useState("");
    const [content, setContent] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { fetchUnreadCount } = useContext(MessageContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async (pageNum) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/messages?page=${pageNum}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.content || []);
                setPage(data.number);
                setTotalPages(data.totalPages);
            } else {
                console.error("쪽지함 로딩 실패");
            }
        } catch (error) {
            console.error("쪽지함 로딩 오류:", error);
        }
    };

    const openDetailModal = async (messageId) => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedMessage(data);
                setIsMessageModalOpen(true);

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.messageId === messageId ? { ...msg, read: true } : msg
                    )
                );

                await fetchUnreadCount();
            }
        } catch (e) {
            console.error("쪽지 상세 로딩 실패", e);
        }
    };

    const deleteMessage = async (messageId) => {
        if (!window.confirm("쪽지를 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
                setIsMessageModalOpen(false);

                await fetchUnreadCount();
            }
        } catch (e) {
            console.error("삭제 실패", e);
        }
    };

    const handleReply = (senderName) => {
        setReplyRecipient(senderName);
        setIsReplyModalOpen(true);
        setIsMessageModalOpen(false);
    };

    const sendReply = async (content) => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverName: replyRecipient,
                    content: content
                })
            });

            if (response.ok) {
                alert("답장 전송 완료");
                setIsReplyModalOpen(false);
            } else {
                alert("답장 전송 실패");
            }
        } catch (error) {
            console.error("답장 전송 오류:", error);
        }
    };

    const sendNewMessage = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/messages`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    receiverName, content
                })
            });

            if (response.ok) {
                alert("쪽지를 성공적으로 보냈습니다.");
                setIsCreateModalOpen(false);
                setReceiverName("");
                setContent("");
                fetchMessages(page);
            } else {
                const text = await response.json();
                alert("쪽지 전송 실패 : " + text);
            }
        } catch (error) {
            console.error("쪽지 전송 오류 : ", error);
        }
    };

    // 채팅 시간 포멧 함수
    const formatChatTime = (timeValue) => {
        const date = new Date(timeValue);
        const now = new Date();
        const isToday = now.toDateString() === date.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        }

        return date.toLocaleDateString("ko-KR", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        }) + " " + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    return (
        <div className="max-w-4xl mx-auto pt-28 px-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold mb-6">📬 내 쪽지함</h2>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    쪽지 쓰기
                </button>
            </div>
            {messages.length === 0 ? (
                <p className="text-gray-500 text-center">받은 쪽지가 없습니다.</p>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.messageId}
                            className={`p-4 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center
                                        ${msg.read ? "bg-gray-200" : "bg-white"}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center w-full">
                                <span className="font-medium text-sm text-gray-700 w-32">
                                    {msg.senderName}
                                </span>

                                <button
                                    onClick={() => openDetailModal(msg.messageId)}
                                    className="flex-1 max-w-[500px] line-clamp-2 break-words text-sm text-gray-800"
                                >
                                    {msg.content || "내용 없음"}
                                </button>

                                <span className="text-xs text-gray-500 sm:w-36 text-right mt-2 sm:mt-0">
                                    {formatChatTime(msg.sentAt)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 px-3 mt-2 sm:mt-0 whitespace-nowrap">
                                <button
                                    className="text-sm bg-blue-500 px-4 py-1 rounded-md hover:bg-blue-600 text-white whitespace-nowrap"
                                    onClick={() => handleReply(msg.senderName)}
                                >
                                    답장
                                </button>
                                <button
                                    className="text-sm bg-red-500 px-4 py-1 rounded-md hover:bg-red-600 text-white whitespace-nowrap"
                                    onClick={() => deleteMessage(msg.messageId)}
                                >
                                    삭제
                                </button>
                            </div>

                        </div>
                    ))}

                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => fetchMessages(i)}
                                className={`mx-1 px-3 py-1 rounded ${
                                    page === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 모달들 */}
            {selectedMessage && isMessageModalOpen && (
                <MessageModal
                    message={selectedMessage}
                    onClose={() => setIsMessageModalOpen(false)}
                    onDelete={() => deleteMessage(selectedMessage.messageId)}
                    onReply={() => handleReply(selectedMessage.senderName)}
                />
            )}

            {isReplyModalOpen && (
                <ReplyModal
                    recipient={replyRecipient}
                    onClose={() => setIsReplyModalOpen(false)}
                    onSend={sendReply}
                />
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px] relative">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">쪽지 쓰기</h3>
                        <label className="block mb-2 font-semibold">수신자 닉네임</label>
                        <input
                            type="text"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            className="w-full px-3 py-2 border rounded mb-4"
                            placeholder="닉네임 입력"
                        />
                        <label className="block mb-2 font-semibold">내용</label>
                        <textarea
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border rounded mb-4"
                            placeholder="쪽지 내용을 입력하세요"
                        />
                        <button
                            onClick={sendNewMessage}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-semibold"
                        >
                            보내기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyMessages;
