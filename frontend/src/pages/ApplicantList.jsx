import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ApplicantList = () => {
    const [ title, setTitle ] = useState("");
    const [selectedUserInfo, setSelectedUserInfo] = useState(null);
    const { basePostId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicants = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login", {state: {from: location.pathname}});
                return;
            }

            try {
                const response = await fetch(`/api/applications/${basePostId}/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplicants(data.applicants);
                    setTitle(data.title);
                } else {
                    alert("지원자 정보를 불러오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("지원자 불러오기 실패:", error);
                alert("서버 오류가 발생했습니다.");
            }
        };

        fetchApplicants();
    }, [basePostId]);

    const handleViewUserInfo = async (userId) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/user-info/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedUserInfo(data);
            } else {
                alert("지원 정보를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("지원자 정보 요청 실패 : ", error);
        }
    };

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
                    applicationId: applicationId,
                    basePostId: basePostId,
                    status: status
                })
            });

            if (response.ok) {
                alert(`해당 지원을 ${status === "APPROVED" ? "승인" : "거부"}했습니다.`);

                setApplicants(prev =>
                    prev.map((app) => app.applicationId === applicationId
                        ? {...app, status }
                        : app
                    )
                );
            } else {
                alert("지원 상태 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("지원 상태 변경 오류 : ", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <>
            {/*사용자 지원 정보 모달*/}
            {selectedUserInfo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                        <button
                            onClick={() => setSelectedUserInfo(null)}
                            className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-semibold mb-4">지원 정보</h3>
                        <p><strong>닉네임:</strong> {selectedUserInfo.nickname}</p>
                        <p><strong>지원 분야:</strong> {selectedUserInfo.field}</p>
                        <p><strong>보유 스킬:</strong> {selectedUserInfo.techStacks.join(", ")}</p>
                        <button
                            onClick={() => setSelectedUserInfo(null)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
            <div className="w-full h-12"></div>

            <h2 className="text-2xl font-bold mb-6">[{title}] 공고 지원자 현황</h2>

            <div className="w-full max-w-4xl space-y-4">
                {applicants.map((applicant) => (
                    <div key={applicant.applicationId} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <span className="text-lg font-semibold">{applicant.applicantNickname}</span>
                        <div className="space-x-2">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() => handleViewUserInfo(applicant.userId)}
                            >
                                지원 정보 보기
                            </button>

                            {applicant.status === "PENDING" ? (
                                <>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={() => handleStatusUpdateClick(applicant.applicationId, "APPROVED")}
                                    >
                                        승인
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        onClick={() => handleStatusUpdateClick(applicant.applicationId, "REJECTED")}
                                    >
                                        거부
                                    </button>
                                </>
                            ) : (
                                <span
                                    className={`px-4 py-2 font-semibold rounded ${
                                        applicant.status === "APPROVED" ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {applicant.status === "APPROVED" ? "승인됨" : "거부됨"}
                                </span>
                            )}

                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-10 bg-orange-400 text-white px-6 py-2 rounded hover:bg-orange-500"
            >
                뒤로가기
            </button>
        </div>
        </>
    );
};

export default ApplicantList;