import {Link, useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef, useCallback, useContext} from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMailOutline, IoChatbubbleEllipsesOutline} from "react-icons/io5";
import logoImage from "../assets/top_logo_ex.jpg";
import MessageModal from "../components/MessageModal";
import ReplyModal from "../components/ReplyModal";
import "../index.css";
import ChatRoom from "../pages/ChatRoom.jsx";
import ChatContext from "../context/ChatContext.js";
import MessageContext from "../context/MessageContext.js";
import { FiMail } from "react-icons/fi";
import { IoIosMail } from "react-icons/io";
import { IoClose, IoChatbubbleEllipses } from "react-icons/io5";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const { unreadMessages, fetchUnreadCount } = useContext(MessageContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuDropdownRef = useRef(null);

    const [messages, setMessages] = useState([]); //최근 5개 메시지 저장
    const [showMessagesDropdown, setShowMessagesDropdown] = useState(false); //메시지 드롭다운
    const messageDropdownRef = useRef(null);

    const [showChatListModal, setShowChatListModal] = useState(false);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);

    const [selectedMessage, setSelectedMessage] = useState(null); //쪽지 상세 조회 정보
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); //쪽지 상세 정보 모달 상태

    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false); //답장 모달
    const [replyRecipient, setReplyRecipient] = useState(""); //답장 발송자

    const {chatRooms, setChatRooms, chatsCount, refreshChatRoomStates} = useContext(ChatContext);

    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("사용자 정보를 불러오지 못했습니다.", error);
            }
        };

        fetchUserInfo();
    }, []);

    //최근 5개의 쪽지 가져오기
    useEffect(() => {
        const fetchRecentMessages = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/messages/recent", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error("최근 쪽지 요청이 실패했습니다. ", response.status);
                }
            } catch (error) {
                console.log("최근 쪽지를 불러오지 못했습니다.", error);
            }
        };

        if (isLoggedIn) {
            fetchRecentMessages();
        }
    }, [isLoggedIn, location]);

    //최근 쪽지 드롭다운 토글
    const toggleMessagesDropdown = () => {
        setShowMessagesDropdown(!showMessagesDropdown);
    };

    //쪽지 상세 보기 모달 창 띄우기
    const handleMessageClick = async (messageId) => {
        setLoading(true);
        setIsMessageModalOpen(true);
        setShowMessagesDropdown(false);

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedMessage(data);

                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.messageId === messageId ? {...msg, read: true } : msg
                    )
                );

                await fetchUnreadCount();

            } else {
                alert("쪽지를 불러오는 도중 문제가 발생했습니다.");
            }
        } catch (error) {
            console.error("쪽지 불러오기 오류 : ", error);
        } finally {
            setLoading(false);
        }
    };

    //쪽지 상세 보기 모달 닫기
    const closeModal = () => {
        setSelectedMessage(null);
        setIsMessageModalOpen(false);
    };

    //모달창에서 쪽지 삭제
    const handleDeleteMessage = async (messageId) => {
        const confirmDelete = window.confirm("정말 이 쪽지를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/messages/${messageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                alert("쪽지가 삭제되었습니다.");
                closeModal();
                setMessages((prevMessages) => prevMessages.filter((msg) => msg.messageId !== messageId));
            } else {
                alert("쪽지 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("쪽지 삭제 오류 : ", error);
        }
    };

    //패이지 이동 시 모달 닫기
    useEffect(() => {
        closeModal();
    }, [location]);

    //답장 버튼 클릭 시 실행
    const handleReplyClick = (recipient) => {
        setIsMessageModalOpen(false);
        setReplyRecipient(recipient);
        setIsReplyModalOpen(true);
        setShowMessagesDropdown(false);
    };

    //쪽지 전송 요청(답장)
    const sendReplyMessage = async (content) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

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
                alert("쪽지가 성공적으로 전송되었습니다.");
                setIsReplyModalOpen(false);
            } else {
                alert("쪽지 전송에 실패했습니다.");
            }
        } catch (error) {
            console.error("쪽지 전송 오류 : ", error);
            alert("쪽지 전송 중 오류가 발생했습니다.");
        }
    };

    //읽지 않은 전체 채팅 수 및 쪽지 수 가져오기
    useEffect(() => {
        if (isLoggedIn) {
            refreshChatRoomStates();
            fetchUnreadCount();
        }
    }, [isLoggedIn, location.pathname, refreshChatRoomStates, fetchUnreadCount]);

    //채팅방 리스트 가져오기
    const fetchChatRooms = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await fetch(`/api/chat/rooms`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setChatRooms(data);
            } else {
                console.error("채팅방 리스트 불러오기 실패");
            }
        } catch (error) {
            console.error("서버 오류 발생 : ", error);
        }
    };

    //채팅 아이콘 클릭 (채팅방 리스트)
    const handleChatButtonClick = () => {
        fetchChatRooms();
        setShowChatListModal(true);
    };

    //외부 클릭 감지로 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                messageDropdownRef.current && !messageDropdownRef.current.contains(e.target) &&
                !e.target.closest(".message-button")
            ) {
                setShowMessagesDropdown(false);
            }

            if (
                menuDropdownRef.current && !menuDropdownRef.current.contains(e.target) &&
                !e.target.closest(".menu-button")
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    // 로그아웃 함수
    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("nickname");
        setUser(null);
        setIsLoggedIn(false);
        closeModal();

        alert("로그아웃 되었습니다.");

        navigate("/", { replace: true });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (path) => {
        if (!isLoggedIn) {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                navigate("/login");
            }
            return;
        }

        setMenuOpen(false);

        navigate(path);
    }

    return (
        <>
            {/*쪽지 상세 조회 모달*/}
            {isMessageModalOpen && selectedMessage && (
                <MessageModal
                    message={selectedMessage}
                    onClose={closeModal}
                    onDelete={() => handleDeleteMessage(selectedMessage.messageId)}
                    onReply={() => handleReplyClick(selectedMessage.senderName)}
                />
            )}

            {/*답장 쓰기 모달*/}
            {isReplyModalOpen && (
                <ReplyModal
                    recipient={replyRecipient}
                    onClose={() => setIsReplyModalOpen(false)}
                    onSend={sendReplyMessage}
                />
            )}

            {/*채팅방 모달 열기*/}
            {selectedChatRoomId && (
                <ChatRoom
                    chatRoomId={selectedChatRoomId}
                    onClose={() => setSelectedChatRoomId(null)}
                    onOpen={refreshChatRoomStates}
                />
            )}

        <header className="w-full bg-gray-100 fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-2 h-14 w-full max-w-screen-xl mx-auto">
                {/* 로고 */}
                <Link to="/" className="flex items-center">
                    <img src={logoImage} alt="Logo" className="h-8 w-auto" />
                </Link>

                {/* 헤더 정보 */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-full border-2 border-transparent hover:border-green-600 transition"
                            >
                                로그인
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-full border-2 border-transparent hover:border-green-600 transition"
                            >
                                회원가입
                            </Link>
                        </>
                    ) : (
                        <div className="flex-1 flex justify-center items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm sm:text-base text-gray-800">
                                    안녕하세요, <span className="font-bold">{user?.nickname}</span>님
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 px-3 py-1 text-xs bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 우측 아이콘 */}
                <div className="flex items-center gap-4">
                    {/* 로그인 후에만 쪽지 및 채팅 아이콘 표시 */}
                    {isLoggedIn && (
                        <>
                            {/* 쪽지 아이콘 */}
                            <div className="relative">
                                <button className="relative p-2 bg-white rounded-md shadow-md message-button"
                                        onClick={toggleMessagesDropdown}>
                                    <IoMailOutline size={24} className="text-gray-700" />
                                    {unreadMessages > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </button>

                                {/* 쪽지 드롭다운 메뉴 */}
                                {showMessagesDropdown && (
                                    <div
                                        ref={messageDropdownRef}
                                        className="absolute right-0 mt-2 w-[460px] bg-white text-gray-800 shadow-lg rounded-md p-4 z-50 border border-gray-300"
                                    >
                                        {/* 타이틀 */}
                                        <div className="flex justify-between items-center mb-3 px-1">
                                            <div className="flex items-center space-x-2 text-lg font-bold">
                                                <FiMail className="text-black" />
                                                <span>최근 쪽지함</span>
                                            </div>
                                            <button
                                                className="text-sm text-black hover:underline"
                                                onClick={() => navigate("/messages")}
                                            >
                                                전체 보기 &gt;
                                            </button>
                                        </div>

                                        {messages.length > 0 ? (
                                            <div className="space-y-2">
                                                {messages.map((msg) => (
                                                    <div
                                                        key={msg.messageId}
                                                        className={`flex items-center justify-between px-3 py-2 rounded-md border ${
                                                            msg.read
                                                                ? "bg-gray-200 border-gray-300"
                                                                : "bg-white border-gray-200"
                                                        }`}
                                                    >
                                                        {/* 보낸 사람 닉네임 */}
                                                        <span className="w-24 text-sm text-gray-600 truncate">
                                                            {msg.senderName.length > 6
                                                                ? `${msg.senderName.slice(0, 6)}...`
                                                                : msg.senderName}
                                                        </span>

                                                        {/* 쪽지 내용 */}
                                                        <button
                                                            className="flex-1 mx-2 text-left text-sm text-black truncate hover:underline"
                                                            onClick={() => handleMessageClick(msg.messageId)}
                                                        >
                                                            {msg.content || "내용 없음"}
                                                        </button>

                                                        {/* 답장 */}
                                                        {msg.senderName !== "[시스템]" && (
                                                            <button
                                                                className="text-blue-500 p-1 hover:text-blue-600"
                                                                onClick={() => handleReplyClick(msg.senderName)}
                                                                title="답장"
                                                            >
                                                                <IoIosMail className="text-[14px]" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-400 py-6">받은 쪽지가 없습니다.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 채팅방 */}
                            <div className="relative">
                                <button
                                    onClick={handleChatButtonClick}
                                    className="relative p-2 bg-white rounded-md shadow-md chat-button"
                                >
                                    <IoChatbubbleEllipsesOutline size={24} className="text-gray-700" />
                                    {chatsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                                            {chatsCount}
                                        </span>
                                    )}
                                </button>

                                {showChatListModal && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                                        <div
                                            className="w-[400px] h-[600px] bg-[#0e1420] rounded-2xl shadow-lg flex flex-col border-2 border-gray-700 overflow-hidden relative"
                                        >
                                            {/* 모달 상단 바 */}
                                            <div className="flex justify-between items-center bg-[#0e1420] text-white px-4 py-2 border-b border-gray-700">
                                                <div className="flex items-center gap-2 font-semibold text-sm">
                                                    <IoChatbubbleEllipses size={18} />
                                                    채팅방 목록
                                                </div>
                                                <button
                                                    onClick={() => setShowChatListModal(false)}
                                                    className="p-1 text-black hover:text-gray-700 transition"
                                                    aria-label="닫기"
                                                >
                                                    <IoClose size={18} />
                                                </button>
                                            </div>

                                            {/* 채팅방 리스트 */}
                                            <div className="flex-1 overflow-y-auto px-3 py-2 chat-scrollbar">
                                                {chatRooms.length === 0 ? (
                                                    <div className="text-center text-gray-400 mt-20">채팅방이 없습니다.</div>
                                                ) : (
                                                    chatRooms.map(room => (
                                                        <div
                                                            key={room.chatRoomId}
                                                            className="bg-[#1e2a3a] text-white px-4 py-3 rounded-lg mb-2 cursor-pointer hover:bg-[#2e3a4a]"
                                                            onDoubleClick={() => {
                                                                setSelectedChatRoomId(room.chatRoomId);
                                                                setShowChatListModal(false);
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div className="font-semibold text-sm">
                                                                    {room.chatRoomName}
                                                                    <span className="ml-2 text-gray-400 text-xs">
                                                                        [{room.groupName}]
                                                                    </span>
                                                                </div>
                                                                {room.unreadMessageCount > 0 && (
                                                                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                                                                        {room.unreadMessageCount}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex justify-between items-start gap-2 mt-1">
                                                                <div className="text-xs text-gray-300 flex-1 line-clamp-2 break-words">
                                                                    {room.lastMessageContent}
                                                                </div>
                                                                <div className="text-xs text-gray-400 whitespace-nowrap min-w-fit pl-2">
                                                                    {room.lastMessageTime ? formatChatTime(room.lastMessageTime) : ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* 햄버거 메뉴 */}
                    <div className="relative">
                        <button onClick={toggleMenu} className="p-2 bg-white rounded-md shadow-md menu-button">
                            {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                        </button>

                        {menuOpen && (
                            <div ref={menuDropdownRef} className="absolute right-0 mt-2 w-40 !bg-gray-700 text-white shadow-lg rounded-md">
                                <button onClick={() => handleMenuClick("/myinfo")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 정보
                                </button>
                                <button onClick={() => handleMenuClick("/my-posts")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 공고
                                </button>
                                <button onClick={() => handleMenuClick("/my-groups")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 그룹
                                </button>
                                <button onClick={() => handleMenuClick("/my-boards")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 게시글
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
        </>
    );
};

export default Header;