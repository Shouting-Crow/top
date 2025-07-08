import {useEffect, useState, useContext, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import ReplyModal from "../components/ReplyModal";
import "../index.css";
import MessageContext from "../context/MessageContext.js";
import { FiMail, FiSend, FiTrash2 } from "react-icons/fi";
import { IoIosMail } from "react-icons/io";
import { FiX } from "react-icons/fi";

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
                const errorText = await response.text();

                if (errorText.includes("수신자")) {
                    alert("쪽지 수신자를 찾을 수 없습니다.");
                } else {
                    alert("쪽지 전송에 실패했습니다.");
                }
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
            {/* 타이틀 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-2xl font-bold">
                    <FiMail className="text-black" />
                    <h2>내 쪽지함</h2>
                </div>
                <button
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <IoIosMail className="text-xl" />
                    <span className="text-sm font-semibold">쪽지 쓰기</span>
                </button>
            </div>

            {/* 메시지 리스트 */}
            {messages.length === 0 ? (
                <p className="text-gray-500 text-center">받은 쪽지가 없습니다.</p>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.messageId}
                            className={`p-4 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                                msg.read ? "bg-gray-200" : "bg-white"
                            }`}
                        >
                            {/* 작성자 및 내용 */}
                            <div className="flex flex-col sm:flex-row sm:items-center w-full">
                                <span className="font-semibold text-sm text-gray-800 w-32">
                                    {msg.senderName}
                                </span>

                                <button
                                    onClick={() => openDetailModal(msg.messageId)}
                                    className="flex-1 max-w-[500px] truncate break-words text-sm text-gray-800 hover:underline text-left"
                                >
                                    {msg.content || "내용 없음"}
                                </button>
                            </div>

                            {/* 시간 및 두 버튼 */}
                            <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                                <span className="text-xs text-gray-500 mr-4 sm:w-36 text-right">
                                    {formatChatTime(msg.sentAt)}
                                </span>

                                <div className="flex items-center gap-2">
                                    {msg.senderName !== "[시스템]" && (
                                        <FiSend
                                            size={16}
                                            className="text-blue-500 hover:text-blue-600 cursor-pointer"
                                            title="답장"
                                            onClick={() => handleReply(msg.senderName)}
                                        />
                                    )}
                                    <FiTrash2
                                        size={16}
                                        className="text-red-500 hover:text-red-600 cursor-pointer"
                                        title="삭제"
                                        onClick={() => deleteMessage(msg.messageId)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 페이지네이션 */}
                    <div className="flex justify-center items-center mt-10 gap-2">
                        {/* 이전 버튼 */}
                        <button
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                            onClick={() => fetchMessages(Math.max(0, page - 1))}
                            disabled={page === 0}
                        >
                            &lt;
                        </button>

                        {/* 페이지 번호 5개씩 */}
                        {Array.from({ length: totalPages })
                            .slice(Math.floor(page / 5) * 5, Math.min(Math.floor(page / 5) * 5 + 5, totalPages))
                            .map((_, i) => {
                                const pageNum = Math.floor(page / 5) * 5 + i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => fetchMessages(pageNum)}
                                        className={`w-8 h-8 text-sm font-medium rounded-full flex items-center justify-center ${
                                            page === pageNum
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-800 border border-gray-300"
                                        }`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}

                        {/* 다음 버튼 */}
                        <button
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                            onClick={() => fetchMessages(Math.min(totalPages - 1, page + 1))}
                            disabled={page === totalPages - 1}
                        >
                            &gt;
                        </button>
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        {/* 타이틀 */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2 text-xl font-bold">
                                <FiSend className="text-gray-700" />
                                <span>쪽지 쓰기</span>
                            </div>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* 수신자 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-1">
                                수신자 닉네임
                            </label>
                            <input
                                type="text"
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                className="w-full px-3 py-2 border rounded text-sm"
                                placeholder="닉네임 입력"
                            />
                        </div>

                        {/* 쪽지 내용 */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-1">
                                쪽지 내용
                            </label>
                            <textarea
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-3 py-2 border rounded resize-none text-sm"
                                placeholder="쪽지 내용을 입력하세요"
                            />
                        </div>

                        {/* 전송 버튼 */}
                        <div className="flex justify-center">
                            <button
                                onClick={sendNewMessage}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                            >
                                보내기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyMessages;
