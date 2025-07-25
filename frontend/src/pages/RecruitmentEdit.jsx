import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipboardDocumentListIcon, CalendarIcon } from "@heroicons/react/24/outline";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative w-full">
        <button
            type="button"
            onClick={onClick}
            ref={ref}
            className="w-full h-[48px] text-left px-4 pr-10 border border-gray-300 rounded-xl flex items-center text-gray-700 bg-white hover:border-gray-400 transition"
        >
            <span
                className={`block w-full truncate whitespace-nowrap overflow-hidden ${value ? '' : 'text-gray-400'}`}
            >
                {value || placeholder}
            </span>
        </button>
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
    </div>
));

const RecruitmentEdit = () => {
    const { recruitmentId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const [totalMembers, setTotalMembers] = useState(2);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecruitmentData();
    }, []);

    const fetchRecruitmentData = async () => {
        try {
            const response = await fetch(`/api/recruitments/${recruitmentId}`);
            if (!response.ok) throw new Error("공고 데이터를 불러오는 데 실패했습니다.");

            const data = await response.json();
            setTitle(data.title);
            setDescription(data.description);
            setTotalMembers(data.totalMembers);
            setDueDate(new Date(data.dueDate));
            setTags(data.tags || []);
            setTopic(data.topic || "");
            setLoading(false);
        } catch (error) {
            console.error("데이터를 불러오지 못했습니다:", error);
            alert("공고 정보를 불러오는 데 실패했습니다.");
            navigate(`/recruitment/${recruitmentId}`);
        }
    };

    const handleEdit = async () => {
        if (!title || !description || !topic || totalMembers < 2 || !dueDate) {
            alert("모든 항목을 정확히 입력해주세요.");
            return;
        }

        const requestData = {
            title,
            dueDate: dueDate.toISOString().split("T")[0],
            totalMembers,
            description,
            tags,
            topic
        };

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/recruitments/${recruitmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
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

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    if (loading) return <div className="text-center text-gray-600 mt-20">로딩 중...</div>;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-6 pt-24 pb-10">
            <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-lg">
                <div className="flex items-center mb-10 gap-2">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">프로젝트 모집 공고 수정</h2>
                </div>

                {/* 제목 & 마감일 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-900 font-semibold mb-2">제목</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-900 font-semibold mb-2">마감일</label>
                        <DatePicker
                            selected={dueDate}
                            onChange={(date) => setDueDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="날짜를 선택하세요"
                            customInput={<CustomDateInput />}
                        />
                    </div>
                </div>

                {/* 주제 및 인원 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-900 font-semibold mb-2">주제</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl"
                            placeholder="예: 웹, 모바일, 서버 등"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-900 font-semibold mb-2">모집 인원</label>
                        <input
                            type="number"
                            className="w-full p-3 border rounded-xl"
                            value={totalMembers}
                            onChange={(e) => setTotalMembers(Math.max(2, Number(e.target.value)))}
                            min="2"
                        />
                    </div>
                </div>

                {/* 태그 */}
                <div className="mb-6">
                    <label className="block text-gray-900 font-semibold mb-2">기술 태그</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-xl mb-2"
                        placeholder="Enter 키로 태그 추가"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                #{tag} ✕
                            </span>
                        ))}
                    </div>
                </div>

                {/* 설명 */}
                <div className="mb-8">
                    <label className="block text-gray-900 font-semibold mb-2">설명</label>
                    <textarea
                        className="w-full p-4 border rounded-xl h-48"
                        placeholder="공고에 대한 설명을 입력하세요"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-3">
                    <button
                        className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
                        onClick={() => navigate(`/recruitment/${recruitmentId}`)}
                    >
                        취소하기
                    </button>
                    <button
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
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