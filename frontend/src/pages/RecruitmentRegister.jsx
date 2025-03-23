import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecruitmentRegister = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("01");
    const [day, setDay] = useState("01");
    const [totalMembers, setTotalMembers] = useState(2);
    const [description, setDescription] = useState("");

    const handleRegister = async () => {
        const dueDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        if (!title || !description || totalMembers < 2) {
            alert("제목, 설명을 입력하고 모집 인원을 2명 이상 설정하세요.");
            return;
        }

        const requestData = {
            title,
            dueDate: dueDate,
            totalMembers,
            description
        };

        try {
            const token = localStorage.getItem("jwtToken");

            const response = await fetch("/api/recruitments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                alert("공고가 등록되었습니다!");
                navigate("/recruitments");
            } else {
                alert("공고 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("등록 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
            <div className="w-full max-w-3xl bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">프로젝트 모집 공고 등록</h2>

                {/* 제목 입력 */}
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">제목</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-md"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 마감일 입력 (년/월/일 드롭다운) */}
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">마감일</label>
                    <div className="flex gap-2">
                        <select className="p-2 border rounded-md" value={year} onChange={(e) => setYear(e.target.value)}>
                            {["2025", "2026", "2027"].map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <select className="p-2 border rounded-md" value={month} onChange={(e) => setMonth(e.target.value)}>
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <select className="p-2 border rounded-md" value={day} onChange={(e) => setDay(e.target.value)}>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 모집 인원 입력 */}
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">인원</label>
                    <input
                        type="number"
                        className="w-full p-3 border rounded-md"
                        value={totalMembers}
                        onChange={(e) => setTotalMembers(Math.max(2, Number(e.target.value)))}
                        min="2"
                    />
                </div>

                {/* 설명 입력 */}
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-2">설명</label>
                    <textarea
                        className="w-full p-3 border rounded-md h-32"
                        placeholder="공고에 대한 설명을 입력하세요"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-between">
                    <button
                        className="bg-red-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                        onClick={() => navigate("/recruitments")}
                    >
                        뒤로가기
                    </button>
                    <button
                        className="bg-green-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                        onClick={handleRegister}
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentRegister;