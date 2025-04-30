import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logoImage from "../assets/top_logo_ex.jpg";

const FindLoginIds = () => {
    const [email, setEmail] = useState("");
    const [emailChecked, setEmailChecked] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [inputCode, setInputCode] = useState(["", "", "", ""]);
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);

    //가입된 이메일 확인
    const checkEmail = async () => {
        try {
          const response = await fetch("/api/users/check-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({email})
          });

          if (response.ok) {
              alert("가입된 이메일입니다. 해당 이메일로 인증을 진행해주세요.");
              setEmailChecked(true);
          } else {
              alert("가입 이력이 없습니다.");
          }
        } catch (error) {
            console.error("이메일 확인 실패 : ", error);
        }
    };

    //인증 코드 메일 전송
    const sendAuthCode = async () => {
        try {
            const response = await fetch("/api/find/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email})
            });

            if (response.ok) {
                alert("인증 코드가 이메일로 전송되었습니다.");
                setCodeSent(true);

                setTimeLeft(180);

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }

                timerRef.current = setInterval(() => {
                    setTimeLeft(prev => {
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
            console.error("인증 코드 전송 실패 : ", error);
        }
    };

    const verifyCode = async () => {
        const code = inputCode.join("");

        try {
            const response = await fetch("/api/find/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, code})
            });

            if (response.ok) {
                const loginIds = await response.json();
                navigate("/find/login-ids-result", {state: {loginIds}});
            } else {
                alert("인증 코드가 올바르지 않습니다.");
            }
        } catch (error) {
            console.error("인증 코드 확인 실패 : ", error);
        }
    };

    //인증 코드 하나씩 입력
    const handleChange = (index, value) => {
        if (value.length > 1) return;

        const newCodes = [...inputCode];
        newCodes[index] = value;
        setInputCode(newCodes);

        if (value && index < inputCode.length - 1) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput.focus();
        }
    };

    //재발급 버튼
    const handleResendCode = () => {
        sendAuthCode();
    };

    //언마운트 경우 타이머 초기화
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center pt-28 p-6">
            <div className="flex flex-col items-center mb-4">
                <Link to="/" className="flex items-center">
                    <img src={logoImage} alt="Logo" className="h-12 w-auto" />
                </Link>
            </div>

            <h2 className="text-2xl font-bold mb-8">아이디 찾기</h2>

            <div className="w-full max-w-md space-y-4">
                <input
                    type="email"
                    placeholder="가입한 이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !emailChecked) checkEmail();
                    }}
                    className="w-full border p-3 rounded"
                    disabled={emailChecked}
                />
                {!emailChecked && (
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        onClick={checkEmail}
                    >
                        확인
                    </button>
                )}

                {emailChecked && !codeSent && (
                    <button
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        onClick={sendAuthCode}
                    >
                        인증 코드 보내기
                    </button>
                )}

                {codeSent && (
                    <div className="flex flex-col items-center mt-6 gap-4">
                        <div className="flex gap-2 justify-center">
                            {inputCode.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`code-${idx}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    className="w-12 h-12 text-center text-xl border rounded"
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            {timeLeft > 0 ? (
                                <span className="text-green-600 font-semibold">
                                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                                </span>
                            ) : (
                                <span className="text-red-500 font-semibold">시간 초과</span>
                            )}

                            <button
                                onClick={handleResendCode}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                재발급
                            </button>
                        </div>
                    </div>
                )}

                {codeSent && (
                    <button
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        onClick={verifyCode}
                    >
                        인증하기
                    </button>
                )}
            </div>

            <button
                onClick={() => navigate("/login")}
                className="mt-6 text-gray-600 hover:text-gray-800 text-sm"
            >
                로그인 화면으로 돌아가기
            </button>
        </div>
    );
};

export default FindLoginIds;