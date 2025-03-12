import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

            alert("로그인 성공!");
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">로그인</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
                <div className="mb-4">
                    <label className="block text-gray-700">아이디</label>
                    <input
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    로그인
                </button>
            </form>
        </div>
    );
};

export default Login;