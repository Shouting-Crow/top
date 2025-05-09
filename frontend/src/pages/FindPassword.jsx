import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/top_logo_ex.jpg";

const FindPassword = () => {
    const [loginId, setLoginId] = useState("");
    const [email, setEmail] = useState("");
    const [inputCode, setInputCode] = useState(["", "", "", ""]);
    const [isVerifiedUser, setIsVerifiedUser] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const handleCheckUser = async () => {
        try {
            const response = await fetch("/api/users/check-loginid-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, email })
            });

            if (response.ok) {
                alert("입력한 정보가 확인되었습니다.");
                setIsVerifiedUser(true);
            } else {
                const errText = await response.text();
                alert(errText || "입력한 정보를 다시 확인해주세요.");
            }
        } catch (error) {
            console.error("유저 정보 확인 실패", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    const sendAuthCode = async () => {
        try {
            const response = await fetch("/api/find-password/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, email })
            });

            if (response.ok) {
                alert("인증 코드가 이메일로 전송되었습니다.");
                setCodeSent(true);
                setTimeLeft(180);

                if (timerRef.current) clearInterval(timerRef.current);

                timerRef.current = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                alert("인증 코드 전송 실패");
            }
        } catch (error) {
            console.error("인증 코드 전송 실패", error);
        }
    };

    const verifyCode = async () => {
        const code = inputCode.join("");
        try {
            const response = await fetch("/api/find-password/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, email, code })
            });

            if (response.ok) {
                const result = await response.json();
                if (result === true) {
                    navigate("/change-password", { state: { loginId, email } });
                } else {
                    alert("인증 실패. 코드를 다시 확인해주세요.");
                }
            }
        } catch (error) {
            console.error("인증 실패", error);
        }
    };

    const handleInputCodeChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newCode = [...inputCode];
        newCode[index] = value;
        setInputCode(newCode);
        if (value && index < 3) {
            document.getElementById(`code-${index + 1}`).focus();
        }
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="flex flex-col items-center pt-28 p-6">
            <div className="flex flex-col items-center mb-4">
                <img src={logoImage} alt="Logo" className="h-12 w-auto" />
            </div>

            <h2 className="text-2xl font-bold mb-6">비밀번호 찾기</h2>

            <div className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    placeholder="아이디 입력"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full border p-3 rounded"
                    disabled={isVerifiedUser}
                />
                <input
                    type="email"
                    placeholder="가입한 이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded"
                    onKeyDown={(e) => e.key === "Enter" && handleCheckUser()}
                    disabled={isVerifiedUser}
                />
                {!isVerifiedUser && (
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        onClick={handleCheckUser}
                    >
                        확인
                    </button>
                )}

                {isVerifiedUser && !codeSent && (
                    <button
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        onClick={sendAuthCode}
                    >
                        인증 코드 보내기
                    </button>
                )}

                {codeSent && (
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <div className="flex gap-2 justify-center">
                            {inputCode.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`code-${idx}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleInputCodeChange(idx, e.target.value)}
                                    className="w-12 h-12 text-center text-xl border rounded"
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            {timeLeft > 0 ? (
                                <span className="text-green-600 font-semibold">
                                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                                    {String(timeLeft % 60).padStart(2, "0")}
                                </span>
                            ) : (
                                <span className="text-red-500 font-semibold">시간 초과</span>
                            )}
                            <button
                                className="text-blue-600 text-sm hover:underline"
                                onClick={sendAuthCode}
                            >
                                재발급
                            </button>
                        </div>
                    </div>
                )}

                {codeSent && (
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-4"
                        onClick={verifyCode}
                    >
                        인증하기
                    </button>
                )}

                <button
                    className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                    onClick={() => navigate("/login")}
                >
                    돌아가기
                </button>
            </div>
        </div>
    );
};

export default FindPassword;