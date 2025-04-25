import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MyInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login", {state: {from: location.pathname}});
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-6">내 정보</h2>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <span className="font-medium">아이디</span>
                    <span className="col-span-2">{userInfo.loginId}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <span className="font-medium">비밀번호</span>
                    <span className="col-span-2">********</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <span className="font-medium">이메일</span>
                    <span className="col-span-2">{userInfo.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <span className="font-medium">전화번호</span>
                    <span className="col-span-2">{userInfo.phoneNumber}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <span className="font-medium">닉네임</span>
                    <span className="col-span-2">{userInfo.nickname}</span>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => navigate("/myinfo/edit")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                        수정하기
                    </button>
                    <button
                        onClick={handleDeleteUser}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                        회원탈퇴
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyInfo;