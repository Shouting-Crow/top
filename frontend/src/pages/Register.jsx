import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import logoImage from "../assets/top_logo_ex.jpg";

const Register = () => {
    const [formData, setFormData] = useState({
        loginId: "",
        password: "",
        email: "",
        phoneNumber: "",
        nickname: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailLocal, setEmailLocal] = useState("");
    const [emailDomain, setEmailDomain] = useState("gmail.com");
    const [emailCustom, setEmailCustom] = useState("");
    const [phone1, setPhone1] = useState("010");
    const [phone2, setPhone2] = useState("");
    const [phone3, setPhone3] = useState("");

    const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "loginId") setIsLoginIdChecked(false);
        if (name === "nickname") setIsNicknameChecked(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoginIdChecked) {
            alert("아이디 중복확인을 진행해주세요.");
            return;
        }

        if (!isNicknameChecked) {
            alert("닉네임 중복확인을 진행해주세요.");
            return;
        }

        const email = emailDomain === "custom"
            ? `${emailLocal}@${emailCustom}`
            : `${emailLocal}@${emailDomain}`;
        const phoneNumber = phone1 + phone2 + phone3;

        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    loginId: formData.loginId,
                    password: formData.password,
                    email,
                    phoneNumber,
                    nickname: formData.nickname,
                }),
            });

            if (response.ok) {
                alert("회원가입이 완료되었습니다.");
                navigate("/login");
            } else {
                const errorMessage = await response.text();
                alert(`회원가입 실패: ${errorMessage}`);
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생: ", error);
        }
    };

    const handleCheckLoginId = async () => {
        try {
            const response = await fetch(`/api/users/check-loginid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId: formData.loginId }),
            });

            if (response.ok) {
                const isDuplicated = await response.json();
                if (isDuplicated) {
                    alert("이미 사용 중인 아이디입니다.");
                    setIsLoginIdChecked(false);
                } else {
                    alert("사용 가능한 아이디입니다.");
                    setIsLoginIdChecked(true);
                }
            } else {
                alert("아이디 중복 확인 실패");
                setIsLoginIdChecked(false);
            }
        } catch (error) {
            console.error("아이디 중복 확인 에러: ", error);
        }
    };

    const handleCheckNickname = async () => {
        try {
            const response = await fetch(`/api/users/check-nickname`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname: formData.nickname }),
            });

            if (response.ok) {
                const isDuplicated = await response.json();
                if (isDuplicated) {
                    alert("이미 사용 중인 닉네임입니다.");
                    setIsNicknameChecked(false);
                } else {
                    alert("사용 가능한 닉네임입니다.");
                    setIsNicknameChecked(true);
                }
            } else {
                alert("닉네임 중복 확인 실패");
                setIsNicknameChecked(false);
            }
        } catch (error) {
            console.error("닉네임 중복 확인 에러: ", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-4">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
                <div className="flex flex-col items-center mb-4">
                    <Link to="/">
                        <img src={logoImage} alt="TOP 로고" className="h-14 w-auto mb-2" />
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* 아이디 */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 font-semibold">아이디</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                className="w-48 px-4 py-2 border rounded-full text-center text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleCheckLoginId}
                                className="text-xs px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                중복확인
                            </button>
                            {isLoginIdChecked && (
                                <HiCheckCircle className="text-green-500 text-xl" />
                            )}
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 font-semibold">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-72 px-4 py-2 bg-white border rounded-full text-center text-sm"
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 font-semibold whitespace-nowrap">비밀번호 확인</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-72 px-4 py-2 bg-white border rounded-full text-center text-sm"
                        />
                        {confirmPassword.length > 0 && (
                            confirmPassword === formData.password ? (
                                <HiCheckCircle className="text-green-500 text-xl ml-2" />
                            ) : (
                                <HiXCircle className="text-red-500 text-xl ml-2" />
                            )
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 font-semibold">이메일</label>
                        <div className="flex flex-wrap gap-2 items-center w-full">
                            <input
                                type="text"
                                value={emailLocal}
                                onChange={(e) => setEmailLocal(e.target.value)}
                                className="w-32 px-4 py-2 border rounded-full text-center text-sm"
                            />
                            <span className="text-gray-600">@</span>
                            <select
                                value={emailDomain}
                                onChange={(e) => {
                                    setEmailDomain(e.target.value);
                                    if (e.target.value !== "custom") setEmailCustom("");
                                }}
                                className="w-29 px-4 py-2 border rounded-full text-center text-sm"
                            >
                                <option value="gmail.com">gmail.com</option>
                                <option value="naver.com">naver.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="custom">직접 입력</option>
                            </select>
                            <input
                                type="text"
                                value={emailCustom}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEmailCustom(val);
                                    const preset = ["gmail.com", "naver.com", "daum.net"];
                                    if (preset.includes(val)) {
                                        setEmailDomain(val);
                                        setEmailCustom("");
                                    } else {
                                        setEmailDomain("custom");
                                    }
                                }}
                                disabled={emailDomain !== "custom"}
                                className="w-28 px-4 py-2 border rounded-full text-center text-sm"
                                placeholder="직접 입력"
                            />
                        </div>
                    </div>

                    {/* 전화번호 */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 font-semibold">전화번호</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={phone1}
                                onChange={(e) => setPhone1(e.target.value)}
                                className="w-24 px-4 py-2 border rounded-full text-center text-sm"
                                maxLength={3}
                            />
                            <span className="text-gray-600">-</span>
                            <input
                                type="text"
                                value={phone2}
                                onChange={(e) => setPhone2(e.target.value)}
                                className="w-24 px-4 py-2 border rounded-full text-center text-sm"
                                maxLength={4}
                            />
                            <span className="text-gray-600">-</span>
                            <input
                                type="text"
                                value={phone3}
                                onChange={(e) => setPhone3(e.target.value)}
                                className="w-24 px-4 py-2 border rounded-full text-center text-sm"
                                maxLength={4}
                            />
                        </div>
                    </div>

                    {/* 닉네임 */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 font-semibold">닉네임</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                className="w-48 px-4 py-2 border rounded-full text-center text-sm"
                            />
                            <button
                                type="button"
                                className="text-xs px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                                onClick={handleCheckNickname}
                            >
                                중복확인
                            </button>
                            {isNicknameChecked && (
                                <HiCheckCircle className="text-green-500 text-xl" />
                            )}
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 text-sm rounded"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-sm rounded"
                        >
                            가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
