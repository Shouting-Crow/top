import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplicationEdit = () => {
    const [formData, setFormData] = useState({
        contact: "",
        field: "",
        techStacks: []
    });

    const [skillInput, setSkillInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplication = async () => {
            const token = localStorage.getItem("jwtToken");

            try {
                const response = await fetch("/api/user-info/my-info", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                }
            } catch (error) {
                console.error("지원 정보를 불러오지 못했습니다.", error);
            }
        };

        fetchApplication();
    }, []);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 스킬 추가
    const handleSkillAdd = () => {
        if (skillInput.trim() !== "") {
            setFormData({ ...formData, techStacks: [...formData.techStacks, skillInput] });
            setSkillInput("");
        }
    };

    // 스킬 삭제
    const handleSkillRemove = (skill) => {
        setFormData({ ...formData, techStacks: formData.techStacks.filter(s => s !== skill) });
    };

    // 수정 요청 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch("/api/user-info", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("지원 정보가 수정되었습니다.");
                navigate("/application-info");
            } else {
                const errorText = await response.text();
                alert("수정 실패: " + errorText);
            }
        } catch (error) {
            console.error("수정 중 오류 발생:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center mb-4">지원 정보 수정</h2>

                <label className="block text-gray-700">연락처</label>
                <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg mb-3"
                    required
                />

                <label className="block text-gray-700">지원 분야</label>
                <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg mb-3"
                    required
                />

                <label className="block text-gray-700">보유 스킬</label>
                <div className="flex items-center mb-3">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button
                        type="button"
                        className="ml-2 w-24 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={handleSkillAdd}
                    >
                        추가
                    </button>
                </div>

                {/* 스킬 목록 */}
                <div className="flex flex-wrap gap-2">
                    {formData.techStacks.map((skill, index) => (
                        <div key={index} className="px-2 py-0.5 bg-gray-200 rounded-full flex items-center text-sm">
                            {skill}
                            <button
                                type="button"
                                className="px-1 py-0 text-xs text-red-500 ml-1 hover:text-red-700 transition"
                                onClick={() => handleSkillRemove(skill)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* 버튼 */}
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                        뒤로가기
                    </button>

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationEdit;