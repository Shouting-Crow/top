import { useState } from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import logoImage from "../assets/top_logo_ex.jpg";

const Login = () => {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, password }),
            });

            if (!response.ok) {
                throw new Error("로그인 실패! 아이디나 비밀번호를 다시 한 번 확인해주세요.");
            }

            const data = await response.json();
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("nickname", data.nickname);

            alert("로그인 성공!");
            navigate(from);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-[400px] max-w-md bg-white p-8 rounded-lg shadow-lg">
                {/* 상단 로고 */}
                <div className="flex flex-col items-center mb-4">
                    <Link to="/" className="flex items-center">
                        <img src={logoImage} alt="Logo" className="h-12 w-auto" />
                    </Link>
                </div>

                {/* 로그인 폼 */}
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">로그인</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">아이디</label>
                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        className="w-80 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        로그인
                    </button>

                    {/* 아이디 및 비밀번호 찾기 */}
                    <div className="flex justify-center mt-3 gap-4">
                        <Link to="/find/login-ids" className="text-sm text-blue-600 hover:underline">
                            아이디 찾기
                        </Link>
                        <span className="text-gray-400">|</span>
                        <Link to="/find/password" className="text-sm text-blue-600 hover:underline">
                            비밀번호 찾기
                        </Link>
                    </div>

                    {/* 뒤로가기 버튼 */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-80 mt-3 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                        뒤로가기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;