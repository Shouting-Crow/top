import {Link, useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMailOutline, IoChatbubbleEllipsesOutline} from "react-icons/io5";
import axios from "axios";
import logoImage from "../assets/top_logo_ex.jpg";
import MessageModal from "../components/MessageModal";
import ReplyModal from "../components/ReplyModal";
import "../index.css";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    const [messagesCount, setMessagesCount] = useState(0); //쪽지 카운트
    const [chatsCount, setChatsCount] = useState(0); //채팅방 채팅 카운트

    const [messages, setMessages] = useState([]); //최근 5개 메시지 저장
    const [showMessagesDropdown, setShowMessagesDropdown] = useState(false); //메시지 드롭다운

    const [selectedMessage, setSelectedMessage] = useState(null); //쪽지 상세 조회 정보
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); //쪽지 상세 정보 모달 상태

    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false); //답장 모달
    const [replyRecipient, setReplyRecipient] = useState(""); //답장 발송자

    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("http://localhost:8080/api/users/me", {
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

            console.log("최근 5개의 쪽지 확인을 위한 요청 보내기....");

            try {
                const response = await fetch("http://localhost:8080/api/messages/recent", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("최근 쪽지 데이터 : ", data);
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
            const response = await fetch(`http://localhost:8080/api/messages/${messageId}`, {
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
            const response = await fetch(`http://localhost:8080/api/messages/${messageId}`, {
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
            const response = await fetch(`http://localhost:8080/api/messages`, {
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

    //안 읽은 메시지 개수 가져오기
    useEffect(() => {
        const fetchUnreadMessages = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("http://localhost:8080/api/chat/unread", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const count = await response.json();
                    setUnreadMessages(count);
                }
            } catch (error) {
                console.error("안 읽은 메시지를 불러오지 못했습니다.", error);
            }
        };

        fetchUnreadMessages();
    }, []);

    // 로그아웃 함수
    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("nickname");
        setUser(null);
        setIsLoggedIn(false);
        closeModal();
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

        <header className="w-full bg-gray-100 shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-6 py-3 w-full max-w-screen-xl mx-auto">
                {/* 로고 */}
                <Link to="/" className="flex items-center">
                    <img src={logoImage} alt="Logo" className="h-12 w-auto" />
                </Link>

                {/* 로그인/회원가입 or 유저 정보 */}
                <div className="flex items-center gap-6">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="text-blue-600 hover:underline">로그인</Link>
                            <Link to="/register" className="text-blue-600 hover:underline">회원가입</Link>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-700">안녕하세요, {user?.nickname}님</span>
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                                로그아웃
                            </button>
                        </>
                    )}
                </div>

                {/* 우측 아이콘 */}
                <div className="flex items-center gap-4">
                    {/* 로그인 후에만 쪽지 및 채팅 아이콘 표시 */}
                    {isLoggedIn && (
                        <>
                            {/* 쪽지 아이콘 */}
                            <div className="relative">
                                <button className="relative p-2 bg-white rounded-md shadow-md"
                                        onClick={toggleMessagesDropdown}>
                                    <IoMailOutline size={24} className="text-gray-700" />
                                    {messages.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                                            {messages.length}
                                        </span>
                                    )}
                                </button>

                                {/* 쪽지 드롭다운 메뉴 */}
                                {showMessagesDropdown && (
                                    <div className="absolute right-0 mt-2 w-[400px] bg-gray-700 text-white shadow-lg rounded-md p-4">
                                        <h3 className="text-lg font-bold text-center mb-3">📩 쪽지함</h3>
                                        {messages.length > 0 ? (
                                            messages.map((msg) => (
                                                <div key={msg.messageId} className="flex items-center justify-between p-4 border-b border-gray-600 mb-2">

                                                    {/* 읽음 상태에 따른 아이콘 변경 */}
                                                    <span className="text-lg mr-3">
                                                        {msg.read ? "📨" : "✉️"}
                                                    </span>

                                                    {/* 쪽지 내용 버튼 */}
                                                    <button
                                                        className={`hover:underline w-3/5 text-left px-3 py-2 rounded-md text-sm whitespace-normal ${
                                                            msg.read ? "bg-gray-500 text-white" : "bg-gray-200 text-black"
                                                        }`}
                                                        onClick={() => handleMessageClick(msg.messageId)}
                                                    >
                                                        {msg.content ? msg.content : "내용 없음"}
                                                    </button>

                                                    {/* 보낸 사람 닉네임 */}
                                                    <span className="text-gray-300 text-sm text-center w-1/4">{msg.senderName}</span>

                                                    {/* 답장 버튼 */}
                                                    <button
                                                        className="text-sm bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap"
                                                        onClick={() => handleReplyClick(msg.senderName)}
                                                    >
                                                        답장
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-300">📭 받은 쪽지가 없습니다.</p>
                                        )}

                                        {/* 쪽지함 바로가기 */}
                                        <button
                                            className="block w-full text-center bg-gray-600 hover:bg-gray-500 text-white py-3 mt-4 rounded-md"
                                            onClick={() => navigate("/messages")}
                                        >
                                            쪽지함 바로가기 →
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button className="relative p-2 bg-white rounded-md shadow-md">
                                <IoChatbubbleEllipsesOutline size={24} className="text-gray-700" />
                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">3</span>
                            </button>
                        </>
                    )}

                    {/* 햄버거 메뉴 */}
                    <div className="relative">
                        <button onClick={toggleMenu} className="p-2 bg-white rounded-md shadow-md">
                            {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 !bg-gray-700 text-white shadow-lg rounded-md">
                                <button onClick={() => handleMenuClick("/myinfo")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 정보
                                </button>
                                <button onClick={() => handleMenuClick("/application-info")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 지원 정보
                                </button>
                                <button onClick={() => handleMenuClick("/my-posts")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 공고
                                </button>
                                <button onClick={() => handleMenuClick("/my-applications")}
                                        className="block w-full text-left px-4 py-2 bg-gray-700 text-white hover:bg-gray-600">
                                    내 지원 현황
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