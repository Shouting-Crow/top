import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyApplicationInfoBox = () => {
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
        return <div className="text-center p-4">지원 정보 로딩 중...</div>;
    }

    if (!formData) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-lg font-semibold mb-2">현재 등록된 지원 정보가 없습니다.</p>
                <p className="text-sm text-gray-500 mb-4">아래 버튼을 통해 등록해주세요.</p>
                <button
                    onClick={() => navigate("/application-info/register")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    지원 정보 등록하기
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 text-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{formData.nickname} 님의 지원 정보</h3>
                <button
                    onClick={() => navigate("/application-info/edit")}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                >
                    수정
                </button>
            </div>

            <div className="space-y-4 text-base">
                <div>
                    <div className="font-semibold text-gray-800">연락처</div>
                    <div className="text-gray-500">{formData.contact}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-800">지원 분야</div>
                    <div className="text-gray-500">{formData.field}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-800">보유 스킬</div>
                    <div className="text-gray-500">{formData.techStacks?.join(", ") || "없음"}</div>
                </div>
            </div>
        </div>
    );
};

export default MyApplicationInfoBox;
