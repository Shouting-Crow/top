import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplicationRegister = () => {
    const [formData, setFormData] = useState({
        contact: "",
        field: "",
        techStacks: []
    });

    const [skillInput, setSkillInput] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillAdd = () => {
        if (skillInput.trim() !== "") {
            setFormData({ ...formData, techStacks: [...formData.techStacks, skillInput] });
            setSkillInput("");
        }
    };

    const handleSkillRemove = (skill) => {
        setFormData({ ...formData, techStacks: formData.techStacks.filter(s => s !== skill) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch("/api/user-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("지원 정보가 등록되었습니다.");
                navigate("/application-info");
            } else {
                const errorText = await response.text();
                alert("등록 실패: " + errorText);
            }
        } catch (error) {
            console.error("등록 중 오류 발생:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center mb-4">지원 정보 등록</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">연락처</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:border-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">지원 분야</label>
                        <input
                            type="text"
                            name="field"
                            value={formData.field}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:border-blue-400"
                            required
                        />
                    </div>

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

                    {/* 스킬 태그 목록 */}
                    <div className="flex flex-wrap gap-2">
                        {formData.techStacks.map((skill, index) => (
                            <div
                                key={index}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full flex items-center space-x-2"
                            >
                                <span className="text-sm">{skill}</span>
                                <button
                                    type="button"
                                    className="px-1 py-0 text-xs text-red-500 ml-1 hover:text-red-700 transition"
                                    onClick={() => handleSkillRemove(skill)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex justify-between mt-6">
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
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationRegister;