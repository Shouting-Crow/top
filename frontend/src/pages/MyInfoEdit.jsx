import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyInfoEdit = () => {
    const [formData, setFormData] = useState({
        id: "",
        loginId: "",
        password: "",
        email: "",
        phoneNumber: "",
        nickname: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}`},
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    alert("사용자 정보를 불러올 수 없습니다.");
                }
            } catch (error) {
                console.error("사용자 정보 불러오기 실패: ", error);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/users/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    loginId: formData.loginId,
                    password: formData.password,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    nickname: formData.nickname,
                }),
            });

            if (response.ok) {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
                navigate("/myinfo");
            } else {
                alert("사용자 정보 수정을 할 수 없습니다.");
            }
        } catch (error) {
            console.error("사용자 정보 수정 중 오류 발생: ", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-6">내 정보 수정</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">아이디</label>
                        <input
                            type="text" name="loginId" value={formData.loginId} readOnly
                            className="w-full px-4 py-2 bg-gray-200 border rounded-lg focus:outline-none" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">비밀번호</label>
                        <input
                            type="password" name="password" value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">이메일</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">전화번호</label>
                        <input
                            type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">닉네임</label>
                        <input
                            type="text" name="nickname" value={formData.nickname} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400" />
                    </div>

                    <div className="flex justify-between mt-6">
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                            저장하기
                        </button>
                        <button type="button" onClick={() => navigate("/myinfo")}
                                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500">
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyInfoEdit;