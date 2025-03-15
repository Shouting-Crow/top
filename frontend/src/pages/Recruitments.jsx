import { useEffect, useState } from "react";

const Recruitments = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchRecruitment(page);
    }, [page]);

    const fetchRecruitment = async () => {
        try {
            const response = await fetch("/api/recruitments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패, 상태 코드: ${response.status}`);
            }

            const data = await response.json();
            console.log("API 응답 데이터:", data); // ✅ 응답 확인
            setRecruitments(data.content);
        } catch (error) {
            console.error("데이터를 불러오지 못했습니다.", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* 검색 , 필터 */}
            <div className="flex justify-between w-full max-w-7xl mb-8">
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
            <div className="grid grid-cols-4 gap-8 max-w-7xl">
                {recruitments.map((recruitment) => (
                    <div
                        key={recruitment.id}
                        className={`relative p-6 rounded-lg shadow-lg transition-all w-80 ${
                            recruitment.isInactive
                                ? "bg-gray-500 cursor-not-allowed opacity-90" // 비활성화
                                : "bg-white hover:-translate-y-2 hover:shadow-xl"
                        }`}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 break-words">
                            {recruitment.title}
                        </h3>

                        <div className="text-md bg-gray-100 p-3 rounded-md space-y-2">
                            <p className="text-gray-700">
                                <span className="font-semibold">등록자:</span> {recruitment.creatorNickname}
                            </p>
                            <p className="text-gray-700">
                                <span
                                    className="font-semibold">등록일:</span> {new Date(recruitment.createdAt).toISOString().split("T")[0]}
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
                                        ? "bg-gray-700 text-white" // ✅ 종료된 경우 더 어두운 색 적용
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
            <div className="flex mt-8">
                <button
                    className="px-3 py-1.5 bg-gray-300 rounded-lg font-semibold shadow-sm text-lg mr-3"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                    이전
                </button>
                <span className="px-2 py-1.5 bg-gray-200 rounded-lg font-semibold text-lg">{page}</span>
                <button
                    className="px-3 py-1.5 bg-gray-300 rounded-lg font-semibold shadow-sm text-lg ml-3"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Recruitments;