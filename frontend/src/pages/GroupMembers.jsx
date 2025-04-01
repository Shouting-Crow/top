import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const GroupMembers = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteNickname, setInviteNickname ] = useState("");
    const [isAdmin, setIsAdmin ] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const fetchMembers = async () => {
            try {
                const response = await fetch(`/api/group/${groupId}/members`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMembers(data);

                    const loginIdFromToken = parseJwt(token).sub;
                    const adminCheck = data.some(member => member.loginId === loginIdFromToken && member.role === "ADMIN");
                    setIsAdmin(adminCheck);
                } else {
                    throw new Error("멤버 목록을 불러올 수 없습니다.");
                }
            } catch (err) {
                console.error(err);
                alert("서버 오류 발생");
            }
        };

        fetchMembers();
    }, [groupId, navigate]);

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("정말로 이 멤버를 추방하시겠습니까?")) return;

        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/groups/${groupId}/remove/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                alert("추방 완료");
                setMembers((prev) => prev.filter((m) => m.userId !== userId));
            } else {
                alert("추방 실패");
            }
        } catch (err) {
            console.error("추방 실패:", err);
        }
    };

    const handleInviteMember = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!inviteNickname.trim()) {
            alert("닉네임을 입력하세요.");
            return;
        }

        const confirmInvite = window.confirm(
            `"${inviteNickname}" 사용자를 그룹에 초대하시겠습니까?`
        );

        if (!confirmInvite) return;

        try {
            const response = await fetch(`/api/groups/${groupId}/invite`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nickname: inviteNickname.trim() })
            });

            if (response.ok) {
                alert("초대가 성공적으로 완료되었습니다.");
                setShowInviteModal(false);

                setMembers((prev) => [
                    ...prev,
                    {
                        userId: Date.now(),
                        nickname: inviteNickname.trim(),
                        role: "MEMBER",
                        isNew: true
                    },
                ]);

                setInviteNickname("");
            } else {
                const errorText = await response.text();
                alert(errorText || "초대 실패");
            }
        } catch (error) {
            console.error("초대 실패 : ", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return {};
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20 px-4">
            <h2 className="text-2xl font-bold mb-6">그룹 멤버</h2>

            <div className="w-full max-w-md space-y-3 mb-6">
                {members.map((member) => (
                    <div
                        key={member.userId}
                        className="bg-white shadow p-4 rounded flex justify-between items-center"
                    >
                        <div className="flex flex-col">
                            <span className="font-semibold">
                                {member.nickname}
                                {member.isNew && (
                                    <span className="ml-2 text-xs bg-yellow-300 text-black px-2 py-1 rounded">
                                        NEW
                                    </span>
                                )}
                            </span>
                            <span className="text-sm text-gray-700">
                    {member.role === "ADMIN" ? "관리자" : "멤버"}
                </span>
                        </div>

                        {isAdmin && member.role !== "ADMIN" && !member.isNew && (
                            <button
                                onClick={() => handleRemoveMember(member.userId)}
                                className="bg-red-400 text-white px-3 py-1 text-sm rounded"
                            >
                                추방
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col space-y-3">
                {isAdmin && (
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="bg-green-400 text-white font-bold px-6 py-3 rounded"
                    >
                        그룹 멤버 초대
                    </button>
                )}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-300 text-white font-bold px-6 py-3 rounded"
                >
                    돌아가기
                </button>
            </div>

            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-[350px] relative">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => {
                                setShowInviteModal(false);
                                setInviteNickname("");
                            }}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">멤버 초대</h3>
                        <input
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            value={inviteNickname}
                            onChange={(e) => setInviteNickname(e.target.value)}
                            className="w-full px-3 py-2 rounded mb-4"
                        />
                        <button
                            onClick={handleInviteMember}
                            className="w-full bg-green-400 text-white py-2 rounded font-semibold"
                        >
                            초대하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupMembers;
