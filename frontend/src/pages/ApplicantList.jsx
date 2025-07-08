import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ApplicantList = () => {
    const [title, setTitle] = useState("");
    const { basePostId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchApplicants = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login", { state: { from: location.pathname } });
                return;
            }

            try {
                const response = await fetch(`/api/applications/${basePostId}/list?page=${page - 1}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplicants(data.applicants);
                    setTitle(data.title);
                    setTotalPages(data.totalPages);
                } else {
                    alert("지원자 정보를 불러오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("지원자 불러오기 실패:", error);
                alert("서버 오류가 발생했습니다.");
            }
        };

        fetchApplicants();
    }, [basePostId, page]);

    const handleStatusUpdateClick = async (applicationId, status) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/applications/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    applicationId,
                    basePostId,
                    status
                })
            });

            if (response.ok) {
                alert(`해당 지원을 ${status === "APPROVED" ? "승인" : "거부"}했습니다.`);
                setApplicants(prev =>
                    prev.map(app => app.applicationId === applicationId ? { ...app, status } : app)
                );
            } else {
                alert("지원 상태 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("지원 상태 변경 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return "비공개";
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
        }
        return phone;
    };

    return (
        <div className="min-h-screen bg-gray-100 px-6 pt-24 pb-12">
            <div className="flex items-center mb-10 max-w-7xl mx-auto">
                <button onClick={() => navigate("/my-posts")}>
                    <FaArrowLeft className="text-2xl text-gray-600 hover:text-black" />
                </button>
                <h2 className="flex-1 text-center text-2xl font-bold text-gray-800">
                    [{title}] 공고 지원자 현황
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {applicants.length === 0 ? (
                    <div className="col-span-full text-center text-lg text-gray-500 py-20">
                        지원자가 없습니다.
                    </div>
                ) : (
                    applicants.map(applicant => (
                        <div
                            key={applicant.applicationId}
                            className="relative group bg-white rounded-lg p-5 shadow hover:shadow-lg transition"
                        >
                        <div className="text-base font-semibold text-gray-600 mb-2">
                        <span className="text-lg font-bold text-black">
                            {applicant.applicantNickname}
                        </span>{" "}
                            님의 지원
                        </div>

                        <div className="text-sm text-gray-700 font-semibold mb-3">
                            분야
                            <div className="text-base font-medium text-gray-900 mt-1">
                                {applicant.field}
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 font-semibold mb-3">
                            연락처
                            <div className="text-base font-medium text-gray-900 mt-1">
                                {formatPhoneNumber(applicant.contact)}
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 font-semibold mb-2">
                            보유 스킬
                            <div className="flex flex-wrap gap-2 mt-2">
                                {applicant.techStacks.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm bg-gray-200 rounded-full text-gray-800 font-medium"
                                    >
                                    {skill}
                                </span>
                                ))}
                            </div>
                        </div>

                        {/*승인 및 거부 */}
                        {applicant.status === "PENDING" ? (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg space-x-4">
                                <button
                                    onClick={() => handleStatusUpdateClick(applicant.applicationId, "APPROVED")}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    승인
                                </button>
                                <button
                                    onClick={() => handleStatusUpdateClick(applicant.applicationId, "REJECTED")}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    거부
                                </button>
                            </div>
                        ) : (
                            <div className={`absolute top-2 right-2 text-sm font-semibold text-white px-3 py-1 rounded-full
                            ${applicant.status === "APPROVED" ? "bg-green-500" : "bg-gray-500"}`}>
                                {applicant.status === "APPROVED" ? "승인됨" : "거부됨"}
                            </div>
                        )}
                    </div>
                    ))
                )}
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

export default ApplicantList;
