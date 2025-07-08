import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            <span className={`block w-full truncate ${value ? '' : 'text-gray-400'}`}>
                {value || placeholder}
            </span>
        </button>
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
    </div>
));

const StudyGroupRegister = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [totalMembers, setTotalMembers] = useState(2);
    const [dueDate, setDueDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleRegister = async () => {
        if (!title || !description || !topic || totalMembers < 2 || !dueDate || !startDate || !endDate) {
            alert("모든 항목을 정확히 입력해주세요.");
            return;
        }

        if (startDate >= endDate) {
            alert("스터디 종료일은 시작일보다 이후여야 합니다.");
            return;
        }

        const requestData = {
            title,
            description,
            topic,
            totalMembers,
            dueDate: dueDate.toISOString().split("T")[0],
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
        };

        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch("/api/study-groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                alert("공고가 등록되었습니다!");
                navigate("/study-groups");
            } else {
                alert("공고 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("등록 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-6 pt-24 pb-10">
            <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-lg">
                <div className="flex items-center mb-10 gap-2">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-800">스터디그룹 모집 공고 등록</h2>
                </div>

                {/* 제목, 마감일 */}
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

                {/* 주제, 인원 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-900 font-semibold mb-2">스터디 주제</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl"
                            placeholder="예: 알고리즘, 데이터베이스, 리액트"
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

                {/* 스터디 기간 */}
                <div className="mb-6">
                    <label className="block text-gray-900 font-semibold mb-2">스터디 기간</label>
                    <div className="flex items-center gap-1">
                        <div className="w-full max-w-[180px]">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="스터디 시작일"
                                customInput={<CustomDateInput />}
                            />
                        </div>

                        <span className="mx-1 text-gray-500 text-lg">~</span>

                        <div className="w-full max-w-[180px]">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="스터디 종료일"
                                customInput={<CustomDateInput />}
                            />
                        </div>
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
                        onClick={() => navigate("/study-groups")}
                    >
                        뒤로가기
                    </button>
                    <button
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                        onClick={handleRegister}
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyGroupRegister;
