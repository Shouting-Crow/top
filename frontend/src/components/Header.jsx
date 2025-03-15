import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMailOutline, IoChatbubbleEllipsesOutline} from "react-icons/io5";
import axios from "axios";
import logoImage from "../assets/top_logo_ex.jpg";
import "../index.css";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [messagesCount, setMessagesCount] = useState(0); //쪽지 카운트
    const [chatsCount, setChatsCount] = useState(0); //채팅방 채팅 카운트
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
        setUser(null);
        setIsLoggedIn(false);
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
                            <button className="relative p-2 bg-white rounded-md shadow-md">
                                <IoMailOutline size={24} className="text-gray-700" />
                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                                    {unreadMessages}
                                </span>
                            </button>
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
    );
};

export default Header;