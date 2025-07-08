import { useEffect, useState, useContext } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { IoPersonCircleOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import ChatRoom from "./ChatRoom.jsx";
import ChatContext from "../context/ChatContext.js";
import {FaArrowLeft} from "react-icons/fa";
import CalendarPlaceholder from "../components/CalendarPlaceHolder.jsx";
import { FiX } from "react-icons/fi";

const Group = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showCreateChatRoomModal, setShowCreateChatRoomModal] = useState(false);
    const [chatRoomName, setChatRoomName] = useState("");
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [creatorId, setCreatorId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const { refreshChatRoomStates } = useContext(ChatContext);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const loginId = parseJwt(token).sub;

                const response = await fetch(`/api/groups/${groupId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setGroup(data);

                    const myInfo = data.members.find(
                        (member) => member.loginId === loginId
                    );

                    if (myInfo) {
                        setCreatorId(myInfo.userId);
                        setIsAdmin(myInfo.role === "ADMIN");
                    }

                    const existResponse = await fetch(`/api/chat/rooms/exist/${groupId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (existResponse.ok) {
                        const existData = await existResponse.json();
                        if (existData.exists) {
                            const chatRoomId = existData.chatRoomId;
                            fetchUnreadCount(chatRoomId);
                        }
                    }

                } else {
                    alert("그룹 정보를 불러오지 못했습니다.");
                }
            } catch (error) {
                console.error("그룹 정보 요청 오류:", error);
                alert("서버 오류가 발생했습니다.");
            }
        };

        fetchGroup();
    }, [groupId]);

    const handleChatClick = async () => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/chat/rooms/exist/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.exists) {
                    openChatModal(data.chatRoomId);
                } else {
                    if (isAdmin) {
                        setShowCreateChatRoomModal(true);
                    } else {
                        alert("채팅방이 아직 생성되지 않았습니다.");
                    }
                }
            } else {
                alert("채팅방 여부 확인 실패");
            }
        } catch (error) {
            console.error("채팅방 여부 확인 에러 : ", error);
            alert("서버 오류 발생");
        }
    };

    const openChatModal = async (chatRoomId) => {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`/api/chat/rooms/${chatRoomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            setUnreadCount(data.unreadMessageCount || 0);
            setSelectedChatRoomId(chatRoomId);
        }
    };

    const closeChatModal = () => {
        setSelectedChatRoomId(null);
    };

    const fetchUnreadCount = async (chatRoomId) => {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`/api/chat/rooms/${chatRoomId}/unread-count`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            const count = await response.json();
            setUnreadCount(count);
        }
    };

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return {};
        }
    }

    if (!group) return <div className="text-center p-10">로딩 중...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20 px-6">

            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6 relative">
                <div className="flex justify-between items-center mb-4 relative">
                    {/* 뒤로 가기 버튼 */}
                    <button
                        onClick={() => navigate("/my-groups")}
                    >
                        <FaArrowLeft className="text-2xl text-gray-800 hover:text-black" />
                    </button>

                    <h2 className="text-2xl font-bold text-center flex-1">{group.name}</h2>

                    {/* 맴버, 채팅방 버튼 */}
                    <div className="flex space-x-4">
                        <button
                            className="relative p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                            onClick={() => navigate(`/groups/${groupId}/members`)}
                        >
                            <IoPersonCircleOutline size={28} className="text-gray-700" />
                        </button>

                        <button
                            className="relative p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                            onClick={handleChatClick}
                        >
                            <IoChatbubbleEllipsesOutline size={28} className="text-gray-700" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* 공지 (추후 도메인에 추가해 어드민이 추가 및 변경 가능)*/}
                <div className="overflow-hidden relative bg-black border border-gray-400 p-3 mt-10 rounded mb-3 shadow-md h-12">
                    <div className="absolute flex whitespace-nowrap animate-marquee-right gap-[350px]">
                        <span className="font-bold font-mono text-white">
                            새로운 공유 공간이 추가되었습니다. 많이 이용해주세요~
                        </span>
                        <span className="font-bold font-mono text-white">
                            새로운 공유 공간이 추가되었습니다. 많이 이용해주세요~
                        </span>
                    </div>
                </div>

                {/* 그룹 설명 */}
                <div className="mt-8 px-6 py-4 rounded-lg border-2 border-blue-300 bg-blue-50 text-blue-900 text-center font-semibold text-base tracking-wide shadow-sm">
                    💡 {group.description}
                </div>
            </div>

            {/* 달력 및 기록 기능 */}
            <CalendarPlaceholder groupId={group.id} />

            {/*채팅방 생성 모달*/}
            {showCreateChatRoomModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                        {/* 닫기 */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setShowCreateChatRoomModal(false);
                                setChatRoomName("");
                            }}
                        >
                            <FiX size={20} />
                        </button>

                        {/* 타이틀 */}
                        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
                            채팅방 생성
                        </h3>

                        {/* 입력창 */}
                        <input
                            type="text"
                            value={chatRoomName}
                            onChange={(e) => setChatRoomName(e.target.value)}
                            placeholder="채팅방 이름을 입력하세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* 생성 버튼 */}
                        <div className="flex justify-center">
                            <button
                                onClick={async () => {
                                    const token = localStorage.getItem("jwtToken");
                                    const body = {
                                        groupId: Number(groupId),
                                        creatorId: creatorId,
                                        chatRoomName: chatRoomName.trim()
                                    };

                                    try {
                                        const response = await fetch("/api/chat/room", {
                                            method: "POST",
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(body)
                                        });

                                        if (response.ok) {
                                            const data = await response.json();
                                            alert("채팅방이 생성되었습니다.");
                                            openChatModal(data.chatRoomId);
                                        } else {
                                            const text = await response.text();
                                            alert(text || "채팅방 생성 실패");
                                        }
                                    } catch (err) {
                                        console.error("채팅방 생성 에러:", err);
                                        alert("서버 오류 발생");
                                    }
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm font-medium"
                            >
                                생성하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*채팅방 모달*/}
            {selectedChatRoomId && (
                <ChatRoom
                    chatRoomId={selectedChatRoomId}
                    onClose={closeChatModal}
                    onOpen={() => {
                        setUnreadCount(0);
                        refreshChatRoomStates();
                    }}
                />
            )}
        </div>
    );
};

export default Group;