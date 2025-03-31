import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { IoPersonCircleOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";

const Group = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch(`/api/groups/${groupId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setGroup(data);
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
                        <button className="relative p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform">
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
        </div>
    );
};

export default Group;