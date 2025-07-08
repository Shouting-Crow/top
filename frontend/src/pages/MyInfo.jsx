import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyApplicationInfoBox from "../components/MyApplicationInfoCard.jsx";
import MyApplicationStatusList from "../components/MyApplicationStatusList";

const MyInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login", { state: { from: location.pathname } });
                return;
            }

            try {
                const response = await fetch(`/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    alert("사용자 정보를 불러올 수 없습니다.");
                }
            } catch (error) {
                console.error("사용자 정보 불러오기 실패: ", error);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleDeleteUser = async () => {
        if (!window.confirm("정말로 탈퇴하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/users/${userInfo.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                alert("회원탈퇴가 완료되었습니다.");
                localStorage.removeItem("jwtToken");
                navigate("/");
            } else {
                alert("회원탈퇴가 실패했습니다.");
            }
        } catch (error) {
            console.error("회원탈퇴 중 오류 발생: ", error);
        }
    };

    if (!userInfo) return <div className="text-center mt-10">로딩 중 ...</div>;

    return (
        <div className="min-h-screen bg-gray-100 pt-24 px-4">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-md p-6 text-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">내 정보</h2>
                            <div className="space-x-2">
                                <button
                                    onClick={() => navigate("/myinfo/edit")}
                                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 text-sm px-3 py-1 rounded"
                                >
                                    탈퇴
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 text-base">
                            <div>
                                <div className="font-semibold text-gray-800">아이디</div>
                                <div className="text-gray-500">{userInfo.loginId}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">이메일</div>
                                <div className="text-gray-500">{userInfo.email}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">전화번호</div>
                                <div className="text-gray-500">{userInfo.phoneNumber}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">닉네임</div>
                                <div className="text-gray-500">{userInfo.nickname}</div>
                            </div>
                        </div>
                    </div>

                    {/* 내 지원 정보 */}
                    <MyApplicationInfoBox />
                </div>

                {/* 지원 현황 */}
                <MyApplicationStatusList />
            </div>
        </div>
    );
};

export default MyInfo;
