import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";

const ApplicationEdit = () => {
    const [formData, setFormData] = useState({
        contact: "",
        field: "",
        techStacks: []
    });

    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [phone3, setPhone3] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

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

                    if (data.contact === "비공개") {
                        setIsPrivate(true);
                    } else {
                        setPhone1(data.contact.slice(0, 3));
                        setPhone2(data.contact.slice(3, 7));
                        setPhone3(data.contact.slice(7));
                    }
                }
            } catch (error) {
                console.error("지원 정보를 불러오지 못했습니다.", error);
            }
        };

        fetchApplication();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillAdd = () => {
        const skill = skillInput.trim();
        if (skill && !formData.techStacks.includes(skill)) {
            setFormData({ ...formData, techStacks: [...formData.techStacks, skill] });
            setSkillInput("");
        }
    };

    const handleSkillRemove = (skill) => {
        setFormData({
            ...formData,
            techStacks: formData.techStacks.filter(s => s !== skill)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwtToken");

        const contact = isPrivate ? "비공개" : `${phone1}${phone2}${phone3}`;

        try {
            const response = await fetch("/api/user-info", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    contact,
                    field: formData.field,
                    techStacks: formData.techStacks
                }),
            });

            if (response.ok) {
                alert("지원 정보가 수정되었습니다.");
                navigate("/myinfo");
            } else {
                const errorText = await response.text();
                alert("수정 실패: " + errorText);
            }
        } catch (error) {
            console.error("수정 중 오류 발생:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-12">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-8">지원 정보 수정</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 연락처 */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">연락처</label>
                        <div className="flex gap-2 items-center mb-2">
                            <input
                                type="text"
                                value={phone1}
                                onChange={(e) => setPhone1(e.target.value.replace(/\D/g, ""))}
                                maxLength={3}
                                disabled={isPrivate}
                                className={`w-20 px-3 py-2 border rounded-full text-center text-sm ${isPrivate ? "bg-gray-200" : "bg-white"}`}
                            />
                            <span className="text-gray-600">-</span>
                            <input
                                type="text"
                                value={phone2}
                                onChange={(e) => setPhone2(e.target.value.replace(/\D/g, ""))}
                                maxLength={4}
                                disabled={isPrivate}
                                className={`w-20 px-3 py-2 border rounded-full text-center text-sm ${isPrivate ? "bg-gray-200" : "bg-white"}`}
                            />
                            <span className="text-gray-600">-</span>
                            <input
                                type="text"
                                value={phone3}
                                onChange={(e) => setPhone3(e.target.value.replace(/\D/g, ""))}
                                maxLength={4}
                                disabled={isPrivate}
                                className={`w-20 px-3 py-2 border rounded-full text-center text-sm ${isPrivate ? "bg-gray-200" : "bg-white"}`}
                            />
                            <label className="ml-4 flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className="mr-1"
                                />
                                비공개
                            </label>
                        </div>
                    </div>

                    {/* 지원 분야 */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">지원 분야</label>
                        <input
                            type="text"
                            name="field"
                            value={formData.field}
                            onChange={handleChange}
                            placeholder="예: 백엔드, 프론트엔드, UI 기획 등"
                            className="w-full px-4 py-2 border rounded-full text-center text-sm bg-white"
                            required
                        />
                    </div>

                    {/* 보유 스킬 */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">보유 스킬</label>
                        <div className="flex gap-2 items-center mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSkillAdd())}
                                placeholder="예: React, Spring"
                                className="flex-1 px-4 py-2 border rounded-full text-sm bg-white text-center"
                            />
                            <button
                                type="button"
                                onClick={handleSkillAdd}
                                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                            >
                                추가
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.techStacks.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm"
                                >
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleSkillRemove(skill)}
                                        className="ml-2 p-1 rounded-full hover:bg-red-100"
                                    >
                                        <HiX className="text-red-500 text-base" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-1.5 text-sm rounded"
                        >
                            뒤로
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-sm rounded"
                        >
                            수정
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationEdit;
