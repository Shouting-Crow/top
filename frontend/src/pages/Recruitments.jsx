import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Recruitments = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecruitment(page);
    }, [page]);

    const fetchRecruitment = async (pageNum) => {
        try {
            const response = await fetch(`/api/recruitments?page=${pageNum - 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패, 상태 코드: ${response.status}`);
            }

            const data = await response.json();
            setRecruitments(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("데이터를 불러오지 못했습니다.", error);
        }
    };

    const handleRegisterClick = () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?");
            if (confirmLogin) {
                navigate("/login");
            }
        } else {
            navigate("/recruitment/register");
        }
    };

    const handleRecruitmentClick = (recruitmentId, isInactive) => {
        if (!isInactive) {
            navigate(`/recruitment/${recruitmentId}`);
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full h-12"></div>
            {/* 공고 등록 버튼 */}
            <div className="w-full max-w-7xl flex justify-end mt-4 mb-6">
                <button
                    className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-blue-700 transition"
                    onClick={handleRegisterClick}
                >
                    공고 등록
                </button>
            </div>

            {/* 검색, 필터 */}
            <div className="flex justify-between items-center w-full max-w-7xl mb-8">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="border p-4 rounded-lg w-3/4 shadow-sm text-lg"
                />
                <button className="bg-gray-300 px-4 py-3 rounded-lg font-semibold shadow-sm text-lg">
                    필터
                </button>
            </div>

            {/* 모집 공고 리스트 */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 max-w-7xl w-full">
                {recruitments.map((recruitment) => (
                    <div
                        key={recruitment.id}
                        className={`relative p-6 rounded-lg shadow-lg transition-all w-full ${
                            recruitment.inactive
                                ? "bg-gray-400 cursor-not-allowed opacity-80"
                                : "bg-white hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                        }`}
                        onClick={() => handleRecruitmentClick(recruitment.id, recruitment.inactive)}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 break-words">
                            {recruitment.title}
                        </h3>

                        <div className="text-md bg-gray-200 p-3 rounded-md space-y-2">
                            <p className="text-gray-700">
                                <span className="font-semibold">등록자:</span> {recruitment.creatorNickname}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">등록일:</span> {new Date(recruitment.createdAt).toISOString().split("T")[0]}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">마감일:</span> {recruitment.dueDate}
                            </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">
                                {recruitment.currentMembers} / {recruitment.totalMembers} 모집
                            </span>
                            <span
                                className={`text-lg font-bold px-4 py-2 rounded-md ${
                                    recruitment.inactive
                                        ? "bg-gray-700 text-white"
                                        : "bg-red-500 text-white"
                                }`}
                            >
                                {recruitment.inactive
                                    ? "종료"
                                    : `D-${Math.max(0, Math.ceil((new Date(recruitment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex mt-8 items-center gap-2">
                <button
                    className="px-3 py-1.5 bg-gray-300 rounded-lg font-semibold shadow-sm text-lg"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                >
                    이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-lg ${
                            page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="px-3 py-1.5 bg-gray-300 rounded-lg font-semibold shadow-sm text-lg"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Recruitments;