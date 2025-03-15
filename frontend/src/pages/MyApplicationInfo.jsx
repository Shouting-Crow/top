import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyApplicationInfo = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplication = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/user-info/my-info", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    setFormData(null);
                }
            } catch (error) {
                console.error("지원 정보를 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, []);

    if (loading) {
        return <div className="text-center p-5">로딩 중...</div>;
    }

    if (!formData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg font-semibold">현재 등록하신 지원 정보가 없습니다.</p>
                    <p className="text-sm text-gray-600 mb-4">아래의 버튼으로 등록해주세요!</p>
                    <button
                        onClick={() => window.location.href = "/application-info/register"}
                        className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                    >
                        지원 정보 등록하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center mb-4">{formData.nickname} 님의 지원 정보</h2>

                <p className="mb-2"><strong>연락처:</strong> {formData.contact}</p>
                <p className="mb-2"><strong>지원 분야:</strong> {formData.field}</p>
                <p className="mb-2"><strong>보유 스킬:</strong> {formData.techStacks ? formData.techStacks.join(", ") : "없음"}</p>

                <button
                    onClick={() => window.location.href = "/application-info/edit"}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    수정하기
                </button>
            </div>
        </div>
    );
};

export default MyApplicationInfo