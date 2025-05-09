import React, { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import logoImage from "../assets/top_logo_ex.jpg";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const loginId = location.state?.loginId;

    const handleChangePassword = async (e) => {
        if (!loginId) {
            alert("접근할 수 없습니다.");
            navigate("/login");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch("/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    loginId,
                    newPassword,
                    confirmPassword
                })
            });

            if (response.ok) {
                alert("새 비밀번호가 성공적으로 등록되었습니다.");
                navigate("/login");
            } else {
                alert("비밀번호 변경 실패");
            }
        } catch (error) {
            console.error("서버 에러 발생 : ", error);
        }
    };

    const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    return (
        <div className="flex flex-col items-center pt-28 px-4">
            <Link to="/" className="flex items-center">
                <img src={logoImage} alt="Logo" className="h-12 w-auto" />
            </Link>
            <h2 className="text-2xl font-bold mb-6">비밀번호 재설정</h2>
            <div className="w-full max-w-md space-y-4">
                <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border rounded"
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(""); // 에러 초기화
                    }}
                    className={`w-full p-3 border rounded ${
                        confirmPassword
                            ? isMatch
                                ? "border-green-500"
                                : "border-red-500"
                            : ""
                    }`}
                />
                {confirmPassword && (
                    <p
                        className={`text-sm ${
                            isMatch ? "text-green-600" : "text-red-500"
                        }`}
                    >
                        {isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
                    </p>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    onClick={handleChangePassword}
                >
                    비밀번호 변경
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;