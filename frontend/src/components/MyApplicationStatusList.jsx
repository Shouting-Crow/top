import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyApplicationStatusList = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/applications/my-list", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    console.error("지원 내역을 불러오지 못했습니다.");
                }
            } catch (error) {
                console.error("서버 오류:", error);
            }
        };

        fetchApplications();
    }, []);

    const statusToText = (status) => {
        switch (status) {
            case "PENDING": return "대기";
            case "APPROVED": return "승인";
            case "REJECTED": return "거부";
            default: return "";
        }
    };

    const handleTitleClick = (application) => {
        if (!application.inactive) {
            const path = application.postType === "RECRUITMENT"
                ? `/recruitment/${application.basePostId}`
                : `/study-group/${application.basePostId}`;
            navigate(path);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">내 지원 현황</h3>

            {applications.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">지원한 공고가 없습니다.</p>
            ) : (
                <table className="w-full text-sm text-gray-700 table-auto">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-3 py-2 text-left">타입</th>
                        <th className="px-3 py-2 text-left">공고 제목</th>
                        <th className="px-3 py-2 text-left">지원일</th>
                        <th className="px-3 py-2 text-left">승인여부</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {applications.map((app, idx) => (
                        <tr key={idx}>
                            <td className="px-3 py-2">
                                {app.postType === "RECRUITMENT" ? "프로젝트" : "스터디그룹"}
                            </td>
                            <td
                                className={`px-3 py-2 hover:underline ${
                                    app.inactive
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-blue-600 cursor-pointer"
                                }`}
                                onClick={() => handleTitleClick(app)}
                            >
                                {app.recruitmentTitle}
                            </td>
                            <td className="px-3 py-2">
                                {new Date(app.applyDateTime).toLocaleDateString().slice(2)}
                            </td>
                            <td
                                className={`px-3 py-2 ${
                                    app.status === "APPROVED"
                                        ? "text-green-600 font-bold"
                                        : app.status === "REJECTED"
                                            ? "text-red-500 font-bold"
                                            : "text-gray-700 font-bold"
                                }`}
                            >
                                {statusToText(app.status)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyApplicationStatusList;
