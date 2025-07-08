import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { CiFaceSmile } from "react-icons/ci";

const StudyGroups = () => {
    const [studyGroups, setStudyGroups] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchType, setSearchType] = useState("all");
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudyGroups(page);
    }, [page]);

    const fetchStudyGroups = async (pageNum) => {
        try {
            const response = await fetch(`/api/study-groups?page=${pageNum - 1}`);
            const data = await response.json();
            setStudyGroups(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("스터디 그룹 목록을 불러오지 못했습니다:", error);
        }
    };

    const handleRegisterClick = () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?");
            if (confirmLogin) navigate("/login", { state: { from: location.pathname } });
        } else {
            navigate("/study-group/register");
        }
    };

    const handleStudyGroupClick = (id, isInactive) => {
        if (!isInactive) {
            navigate(`/study-group/${id}`);
        }
    };

    const handleSearch = async () => {
        if (keyword.trim().length < 2) {
            alert("검색어는 두 글자 이상 입력해주세요.");
            return;
        }

        try {
            const response = await fetch(`/api/study-groups/search?searchType=${searchType}&keyword=${keyword}&page=${page - 1}`);
            const data = await response.json();
            setStudyGroups(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number + 1);
        } catch (error) {
            console.error("검색 실패:", error);
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100 p-6">
            {/* 상단 배너 */}
            <div className="w-full max-h-[280px] overflow-hidden mb-8 bg-white flex justify-center mx-auto mt-9 mb-8">
                <img
                    src="/banner/study_group_banner.png"
                    alt="Top Study Group 배너"
                    className="h-auto w-full object-contain"
                />
            </div>

            {/* 검색, 등록 버튼 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-7xl mb-8 gap-3">
                <div className="flex flex-grow items-center gap-2">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="all">전체</option>
                        <option value="title">제목</option>
                        <option value="creator">작성자</option>
                        <option value="content">내용</option>
                    </select>
                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        className="border p-2 rounded-md w-72"
                    />
                    <button
                        onClick={handleSearch}
                        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    >
                        <IoSearchSharp className="h-5 w-5 text-gray-800" />
                    </button>
                </div>

                <button
                    onClick={handleRegisterClick}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition self-end sm:self-auto"
                >
                    공고 등록
                </button>
            </div>

            {/* 스터디 그룹 리스트 */}
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-7xl w-full">
                {studyGroups.map((study) => {
                    const daysLeft = Math.max(
                        0,
                        Math.ceil((new Date(study.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                    );

                    return (
                        <div
                            key={study.id}
                            className={`p-6 rounded-2xl shadow-md transition-all w-full h-full min-h-[220px] flex flex-col justify-between ${
                                study.inactive
                                    ? "bg-gray-300 cursor-not-allowed opacity-70"
                                    : "bg-white hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                            }`}
                            onClick={() => handleStudyGroupClick(study.id, study.inactive)}
                        >
                            {/* 작성자 닉네임 */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                <CiFaceSmile className="h-4 w-4" />
                                <span className="font-medium">{study.creatorNickname}</span>
                            </div>

                            {/* 제목 */}
                            <h3 className="text-base font-semibold text-gray-900 mb-2 break-words line-clamp-2">
                                {study.title}
                            </h3>

                            {/* 주제 */}
                            <p className="text-sm text-gray-700 mb-3">{study.topic}</p>

                            {/* 스터디 기간 */}
                            <div className="text-xs text-gray-600 mb-4">
                                ⏳ {study.startDate} ~ {study.endDate}
                            </div>

                            <div className="flex justify-between items-end mt-auto">
                                <span className="text-xs text-gray-500">
                                    마감일 | {study.dueDate}
                                </span>

                                <div className="text-right">
                                    {/* 조회수 */}
                                    <div className="text-xs text-gray-500 flex items-center justify-end mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {study.views}
                                    </div>

                                    {/* D-Day */}
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded ${
                                            daysLeft <= 7 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        D-{daysLeft}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center mt-10 gap-2">
                <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                >
                    &lt;
                </button>

                {Array.from({ length: totalPages })
                    .slice(Math.floor((page - 1) / 5) * 5, Math.min(Math.floor((page - 1) / 5) * 5 + 5, totalPages))
                    .map((_, i) => {
                        const pageNum = Math.floor((page - 1) / 5) * 5 + i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-8 h-8 text-sm font-medium rounded-full flex items-center justify-center ${
                                    page === pageNum ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-300"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default StudyGroups;
