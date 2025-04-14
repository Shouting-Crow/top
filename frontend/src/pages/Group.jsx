import { useEffect, useState, useContext } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { IoPersonCircleOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import ChatRoom from "./ChatRoom.jsx";
import ChatContext from "../context/ChatContext.js";

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
                <div className="flex justify-center items-center mb-4 relative">
                    <h2 className="text-2xl font-bold text-center w-full">{group.name}</h2>

                    <div className="absolute top-0 right-0 flex space-x-4">
                        {/* 그룹원 보기 버튼 */}
                        <button
                            className="relative p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                            onClick={() => navigate(`/groups/${groupId}/members`)}
                        >
                            <IoPersonCircleOutline size={28} className="text-gray-700" />
                        </button>

                        {/* 채팅방 열기 버튼 */}
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
                <div className="bg-gray-100 p-3 mt-10 rounded mb-3 shadow-sm">
                    📢 새로운 공유 공간이 추가되었습니다. 많이 이용해주세요~
                </div>

                {/* 그룹 설명 */}
                <p className="text-gray-700 mt-10 whitespace-pre-wrap">
                    {group.description}
                </p>
            </div>

            {/* 추가 활용 영역 */}
            <div className="w-full max-w-4xl h-96 bg-white shadow-inner rounded-lg flex items-center justify-center text-gray-400 text-lg">
                추가 활용 칸
            </div>

            {/*채팅방 생성 모달*/}
            {showCreateChatRoomModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-cyan-300 p-6 rounded-lg shadow-lg w-[400px] relative">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => {
                                setShowCreateChatRoomModal(false);
                                setChatRoomName("");
                            }}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">채팅방 생성</h3>
                        <label className="block mb-2 font-semibold">채팅방 이름</label>
                        <input
                            type="text"
                            value={chatRoomName}
                            onChange={(e) => setChatRoomName(e.target.value)}
                            placeholder="채팅방 이름을 입력하세요"
                            className="w-full px-3 py-2 rounded mb-4"
                        />
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
                            className="w-full bg-green-400 text-white py-2 rounded font-semibold"
                        >
                            생성하기
                        </button>
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