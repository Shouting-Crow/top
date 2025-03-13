import { useState } from "react";
import logoImage from "../assets/top_logo_ex.jpg";
import {Link} from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        loginId: "",
        password: "",
        nickname: "",
        email: "",
        phoneNumber: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("회원가입이 완료되었습니다.");
                window.location.href = "/login";
            } else {
                const errorMessage = await response.text();
                alert(`회원가입이 실패했습니다 : ${errorMessage}`);
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생 : ", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* 회원가입 폼 */}
            <form
                onSubmit={handleSubmit}
                className="w-[500px] bg-white p-8 rounded-lg shadow-lg"
            >
                {/* 상단 로고 */}
                <div className="flex flex-col items-center mb-4">
                    <Link to="/">
                        <img src={logoImage} alt="Logo" className="h-12 w-auto" />
                    </Link>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">회원가입</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">아이디</label>
                    <input
                        type="text"
                        name="loginId"
                        value={formData.loginId}
                        onChange={handleChange}
                        placeholder="아이디를 입력해 주세요"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력해 주세요"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="닉네임을 입력해 주세요"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일을 입력해 주세요"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">전화번호</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="전화번호를 입력해 주세요 (- 제외)"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                        required
                    />
                </div>

                {/* 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    회원가입
                </button>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full mt-3 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                    뒤로가기
                </button>
            </form>
        </div>
    );
};

export default Register;