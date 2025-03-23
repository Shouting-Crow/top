import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RecruitmentEdit = () => {
    const { recruitmentId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("01");
    const [day, setDay] = useState("01");
    const [totalMembers, setTotalMembers] = useState(2);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecruitmentData();
    }, []);

    const fetchRecruitmentData = async () => {
        try {
            const response = await fetch(`/api/recruitments/${recruitmentId}`);
            if (!response.ok) {
                throw new Error("공고 데이터를 불러오는 데 실패했습니다.");
            }

            const data = await response.json();
            setTitle(data.title);
            setDescription(data.description);
            setTotalMembers(data.totalMembers);

            const [y, m, d] = data.dueDate.split("-");
            setYear(y);
            setMonth(m);
            setDay(d);

            setLoading(false);
        } catch (error) {
            console.error("데이터를 불러오지 못했습니다.", error);
            alert("공고 정보를 불러오는 데 실패했습니다.");
            navigate(`/recruitment/${recruitmentId}`);
        }
    };

    const handleEdit = async () => {
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

            const response = await fetch(`/api/recruitments/${recruitmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                alert("공고가 수정되었습니다!");
                navigate(`/recruitment/${recruitmentId}`);
            } else {
                alert("공고 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("수정 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">로딩 중...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
            <div className="w-full h-14"></div>

            <div className="w-full max-w-3xl bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">프로젝트 모집 공고 수정</h2>

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
                        onClick={() => navigate(`/recruitment/${recruitmentId}`)}
                    >
                        취소하기
                    </button>
                    <button
                        className="bg-green-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                        onClick={handleEdit}
                    >
                        수정하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentEdit;