import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers } from "react-icons/fa";

const MyGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loginId, setLoginId] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login", {state: {from: location.pathname}});
            return;
        }

        const loginIdFromToken = JSON.parse(atob(token.split('.')[1])).sub;
        setLoginId(loginIdFromToken);

        fetch("/api/groups/my-groups", {
            headers : { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(error => {
                console.error("내 그룹 조회 실패 : ", error);
                alert("서버 오류 발생");
            });
    }, []);

    const handleDelete = async (groupId) => {
        if (!window.confirm("정말로 이 그룹을 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/groups/${groupId}`, {
                method: "DELETE",
                headers : { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                alert("그룹 삭제 완료");
                setGroups((prev) => prev.filter(group => group.id !== groupId));
            } else {
                const text = await response.text();
                alert(text || "삭제 실패");
            }
        } catch (error) {
            console.error("그룹 삭제 에러 : ", error);
            alert("서버 오류 발생");
        }
    };

    const handleLeave = async (groupId) => {
        if (!window.confirm("정말 이 그룹에서 탈퇴하시겠습니까?")) return;

        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/groups/${groupId}/leave`, {
                method: "DELETE",
                headers : { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                alert("그룹 탈퇴 완료");
                setGroups((prev) => prev.filter(group => group.id !== groupId));
            } else {
                const text = await response.text();
                alert(text || "그룹 탈퇴 실패");
            }
        } catch (error) {
            console.error("그룹 탈퇴 에러", error);
            alert("서버 오류 발생");
        }
    };

    const handleUpdateGroup = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/groups/${editingGroup.id}`, {
                method: "PUT",
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body : JSON.stringify({
                    name: editedName.trim(),
                    description: editedDescription.trim()
                })
            });

            if (response.ok) {
                const updateGroup = await response.json();
                alert("그룹의 정보가 성공적으로 수정되었습니다.");

                setGroups(prev => prev.map(g => g.id === updateGroup.id ?
                    {...g, name: updateGroup.name, description: updateGroup.description} :
                    g
                ));

                setShowEditModal(false);
            } else {
                const text = await response.text();
                alert(text || "그룹 정보 수정 실패");
            }
        } catch (error) {
            console.error("그룹 정보 수정 요청 오류 : ", error);
            alert("서버 오류 발생");
        }
    };

    const openEditModal = (group) => {
        setEditingGroup(group);
        setEditedName(group.name);
        setEditedDescription(group.description);
        setShowEditModal(true);
    };

    return (
        <>
            {/* 수정 모달 */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[400px] relative">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => setShowEditModal(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">그룹 수정</h3>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full mb-3 px-3 py-2 border rounded"
                            placeholder="그룹 이름"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full mb-4 px-3 py-2 border rounded resize-none"
                            placeholder="그룹 설명"
                            rows={4}
                        />
                        <button
                            onClick={handleUpdateGroup}
                            className="w-full bg-green-500 text-white py-2 rounded font-bold"
                        >
                            수정하기
                        </button>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-100 px-6 pt-20">
                {/* 타이틀 */}
                <div className="flex items-center gap-2 mb-8 max-w-5xl mx-auto">
                    <button onClick={() => navigate("/")} className="text-gray-700 hover:text-gray-900">
                        <FaArrowLeft size={20} />
                    </button>
                    <FaUsers className="text-green-600" size={20} />
                    <h2 className="text-2xl font-bold">내 그룹</h2>
                </div>

                <div className="w-full max-w-5xl space-y-4 mx-auto">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => navigate(`/groups/${group.id}`)}
                            className="cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-green-300 transition-all
                            flex justify-between items-center bg-green-100 p-4 rounded shadow"
                        >
                            <div className="flex items-center gap-4">
                                {/* 타입 */}
                                <div className="w-[100px] flex-shrink-0 text-center text-sm px-2 py-1 rounded
                                    bg-blue-200 text-blue-800 font-semibold whitespace-nowrap"
                                >
                                    {group.type === "PROJECT" ? "프로젝트" : "스터디그룹"}
                                </div>

                                {/* 그룹 정보 */}
                                <div>
                                    <div className="font-bold text-lg">{group.name}</div>
                                    <div className="text-gray-700">{group.description}</div>
                                </div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex space-x-2">
                                {group.admin ? (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(group);
                                            }}
                                            className="bg-gray-400 px-3 py-1 rounded text-white font-bold"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(group.id);
                                            }}
                                            className="bg-red-400 px-3 py-1 rounded text-white font-bold"
                                        >
                                            삭제
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLeave(group.id);
                                        }}
                                        className="bg-red-400 px-3 py-1 rounded text-white font-bold"
                                    >
                                        탈퇴
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyGroups;
